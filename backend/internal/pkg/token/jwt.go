package token

import (
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/diegoall/portfolio-backend/internal/config"
	"github.com/golang-jwt/jwt/v5"
)

// Claims son los datos propios que viajan dentro del JWT, además de los
// claims estándar (exp, iat, iss, aud) de RegisteredClaims.
type Claims struct {
	UserID int    `json:"user_id"`
	Email  string `json:"email"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

// TokenPairs es la respuesta emitida tras un login o refresh exitoso.
// El RefreshToken nunca se serializa en el JSON de respuesta (json:"-") —
// viaja exclusivamente en la cookie httpOnly, nunca en el body.
type TokenPairs struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"-"`
}

type JWTService struct {
	secret       []byte
	accessTTL    time.Duration
	refreshTTL   time.Duration
	issuer       string
	audience     string
	cookieName   string
	cookiePath   string
	cookieDomain string
}

func NewJWTService(cfg *config.Config) *JWTService {
	return &JWTService{
		secret:       []byte(cfg.JWTConfig.Secret),
		accessTTL:    time.Duration(cfg.JWTConfig.AccessTokenTTLMin) * time.Minute,
		refreshTTL:   time.Duration(cfg.JWTConfig.RefreshTokenTTLHr) * time.Hour,
		issuer:       cfg.JWTConfig.Issuer,
		audience:     cfg.JWTConfig.Audience,
		cookieName:   "refresh_token",
		cookiePath:   "/v1/admin",
		cookieDomain: cfg.JWTConfig.CookieDomain,
	}
}

func (s *JWTService) newToken(userID int, email, role string, ttl time.Duration) (string, time.Time, error) {
	expiresAt := time.Now().Add(ttl)
	claims := Claims{
		UserID: userID,
		Email:  email,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    s.issuer,
			Audience:  jwt.ClaimStrings{s.audience},
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := t.SignedString(s.secret)
	return signed, expiresAt, err
}

// GenerateTokenPair emite access token (minutos) + refresh token (horas/días)
// en una sola llamada — equivalente a Auth.GenerateTokenPair en el proyecto
// de Bold, pero con RegisteredClaims tipados en vez de jwt.MapClaims.
func (s *JWTService) GenerateTokenPair(userID int, email, role string) (TokenPairs, error) {
	accessToken, _, err := s.newToken(userID, email, role, s.accessTTL)
	if err != nil {
		return TokenPairs{}, err
	}

	refreshToken, _, err := s.newToken(userID, email, role, s.refreshTTL)
	if err != nil {
		return TokenPairs{}, err
	}

	return TokenPairs{AccessToken: accessToken, RefreshToken: refreshToken}, nil
}

// GenerateAccessToken emite solo un access token nuevo — usado en /refresh,
// donde el refresh token existente todavía es válido y no hace falta rotarlo.
func (s *JWTService) GenerateAccessToken(userID int, email, role string) (string, error) {
	token, _, err := s.newToken(userID, email, role, s.accessTTL)
	return token, err
}

// ValidateToken parsea y valida firma/expiración de cualquiera de los dos
// tipos de token (access o refresh comparten la misma estructura de claims).
func (s *JWTService) ValidateToken(tokenString string) (*Claims, error) {
	claims := &Claims{}
	parsed, err := jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("método de firma inesperado: %v", t.Header["alg"])
		}
		return s.secret, nil
	})
	if err != nil {
		return nil, err
	}
	if !parsed.Valid {
		return nil, errors.New("token inválido")
	}
	return claims, nil
}

// ExtractJWTToken lee el header "Authorization: Bearer <token>" de la request.
func (s *JWTService) ExtractJWTToken(r *http.Request) (string, error) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return "", errors.New("no se encontró el header Authorization")
	}

	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		return "", errors.New("formato de Authorization inválido, se esperaba 'Bearer <token>'")
	}

	return parts[1], nil
}

// ── Cookies del refresh token ───────────────────────────────────────────────
// Centralizadas en el JWTService (no en el controller) para que el nombre,
// path, dominio y TTL de la cookie vivan en un solo lugar — mismo rol que
// Auth.GetRefreshCookie / Auth.GetExpiredRefreshCookie en el proyecto de Bold.

func (s *JWTService) RefreshCookieName() string {
	return s.cookieName
}

func (s *JWTService) NewRefreshCookie(refreshToken string) *http.Cookie {
	return &http.Cookie{
		Name:     s.cookieName,
		Value:    refreshToken,
		Path:     s.cookiePath,
		Domain:   s.cookieDomain,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
		Expires:  time.Now().Add(s.refreshTTL),
		MaxAge:   int(s.refreshTTL.Seconds()),
	}
}

func (s *JWTService) ExpiredRefreshCookie() *http.Cookie {
	return &http.Cookie{
		Name:     s.cookieName,
		Value:    "",
		Path:     s.cookiePath,
		Domain:   s.cookieDomain,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
		Expires:  time.Unix(0, 0),
		MaxAge:   -1,
	}
}
