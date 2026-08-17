package services

import (
	"context"
	"errors"

	"github.com/diegoall/portfolio-backend/internal/models"
	"github.com/diegoall/portfolio-backend/internal/pkg/token"
	"github.com/diegoall/portfolio-backend/internal/repository"

	"golang.org/x/crypto/bcrypt"
)

type AuthService interface {
	Login(ctx context.Context, input models.LoginInput) (token.TokenPairs, error)
	RefreshAccessToken(ctx context.Context, refreshToken string) (string, error)
	ValidateAccessToken(ctx context.Context, tokenString string) (*token.Claims, error)
}

type DefaultAuthService struct {
	repo       repository.AuthRepository
	jwtService *token.JWTService
}

func NewDefaultAuthService(repo repository.AuthRepository, jwtService *token.JWTService) *DefaultAuthService {
	return &DefaultAuthService{repo: repo, jwtService: jwtService}
}

// Login valida email + password contra el hash bcrypt almacenado y, si es
// correcto, emite un par de tokens (access corto, refresh largo).
// El mensaje de error es genérico a propósito: no debe revelar si el email
// existe o no (evita user enumeration).
func (s *DefaultAuthService) Login(ctx context.Context, input models.LoginInput) (token.TokenPairs, error) {
	user, err := s.repo.GetUserByEmail(ctx, input.Email)
	if err != nil {
		return token.TokenPairs{}, errors.New("credenciales inválidas")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)); err != nil {
		return token.TokenPairs{}, errors.New("credenciales inválidas")
	}

	return s.jwtService.GenerateTokenPair(user.ID, user.Email, "admin")
}

func (s *DefaultAuthService) RefreshAccessToken(ctx context.Context, refreshToken string) (string, error) {
	claims, err := s.jwtService.ValidateToken(refreshToken)
	if err != nil {
		return "", errors.New("refresh token inválido o expirado")
	}

	user, err := s.repo.GetUserByID(ctx, claims.UserID)
	if err != nil {
		return "", errors.New("usuario no encontrado")
	}

	return s.jwtService.GenerateAccessToken(user.ID, user.Email, "admin")
}

func (s *DefaultAuthService) ValidateAccessToken(ctx context.Context, tokenString string) (*token.Claims, error) {
	claims, err := s.jwtService.ValidateToken(tokenString)
	if err != nil {
		return nil, err
	}

	if _, err := s.repo.GetUserByID(ctx, claims.UserID); err != nil {
		return nil, errors.New("usuario no encontrado")
	}

	return claims, nil
}
