package middleware

import (
	"context"
	"net/http"

	"github.com/diegoall/portfolio-backend/internal/pkg/logger"
	"github.com/diegoall/portfolio-backend/internal/pkg/token"
	"github.com/diegoall/portfolio-backend/internal/pkg/utils"
	"github.com/diegoall/portfolio-backend/services"
)

type contextKey string

const ClaimsContextKey contextKey = "claims"

// Middleware contiene las dependencias necesarias para los middlewares de la API.
type Middleware struct {
	JWTService  *token.JWTService
	AuthService services.AuthService
}

func NewMiddleware(jwtService *token.JWTService, authService services.AuthService) *Middleware {
	return &Middleware{JWTService: jwtService, AuthService: authService}
}

// AuthTokenMiddleware valida el access token JWT enviado en el header
// Authorization y, si es válido, agrega los claims al contexto de la request.
func (mw *Middleware) AuthTokenMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenString, err := mw.JWTService.ExtractJWTToken(r)
		if err != nil {
			logger.ErrorLog.Printf("Error al extraer token: %v", err)
			utils.ErrorJSON(w, err, http.StatusUnauthorized)
			return
		}

		claims, err := mw.AuthService.ValidateAccessToken(r.Context(), tokenString)
		if err != nil {
			logger.ErrorLog.Printf("Validación de token fallida: %v", err)
			utils.ErrorJSON(w, err, http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), ClaimsContextKey, claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
