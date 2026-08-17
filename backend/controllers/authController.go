package controllers

import (
	"net/http"

	"github.com/diegoall/portfolio-backend/internal/models"
	"github.com/diegoall/portfolio-backend/internal/pkg/logger"
	"github.com/diegoall/portfolio-backend/internal/pkg/token"
	"github.com/diegoall/portfolio-backend/internal/pkg/utils"
	"github.com/diegoall/portfolio-backend/services"
)

type AuthController struct {
	service    services.AuthService
	jwtService *token.JWTService
}

func NewAuthController(service services.AuthService, jwtService *token.JWTService) *AuthController {
	return &AuthController{service: service, jwtService: jwtService}
}

// Login — POST /v1/admin/login
// Ruta "oculta": no está enlazada desde ninguna vista pública del frontend.
// La seguridad real la dan bcrypt (hash de contraseña) y el JWT firmado,
// no el hecho de que la URL no aparezca en ningún link.
func (ac *AuthController) Login(w http.ResponseWriter, r *http.Request) {
	var input models.LoginInput
	if err := utils.ReadJSON(w, r, &input); err != nil {
		utils.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	tokens, err := ac.service.Login(r.Context(), input)
	if err != nil {
		logger.ErrorLog.Printf("Intento de login fallido para %s: %v", input.Email, err)
		utils.ErrorJSON(w, err, http.StatusUnauthorized)
		return
	}

	// El refresh token viaja en una cookie httpOnly — nunca en el body ni en
	// localStorage/sessionStorage, para evitar robo por XSS. La cookie la
	// arma el JWTService (nombre/path/dominio/TTL en un solo lugar).
	http.SetCookie(w, ac.jwtService.NewRefreshCookie(tokens.RefreshToken))

	logger.InfoLog.Printf("Login exitoso: %s", input.Email)
	utils.WriteJSON(w, http.StatusOK, utils.JSONResponse{
		Error:   false,
		Message: "Login exitoso",
		Data:    map[string]string{"access_token": tokens.AccessToken},
	})
}

// Refresh — GET /v1/admin/refresh
// El frontend lo llama al cargar la app y periódicamente, igual que en el
// patrón del proyecto de Bold (toggleRefresh + credentials: "include").
func (ac *AuthController) Refresh(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie(ac.jwtService.RefreshCookieName())
	if err != nil {
		utils.ErrorJSON(w, err, http.StatusUnauthorized)
		return
	}

	accessToken, err := ac.service.RefreshAccessToken(r.Context(), cookie.Value)
	if err != nil {
		utils.ErrorJSON(w, err, http.StatusUnauthorized)
		return
	}

	utils.WriteJSON(w, http.StatusOK, utils.JSONResponse{
		Error: false,
		Data:  map[string]string{"access_token": accessToken},
	})
}

// Logout — GET /v1/admin/logout
func (ac *AuthController) Logout(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, ac.jwtService.ExpiredRefreshCookie())
	utils.WriteJSON(w, http.StatusOK, utils.JSONResponse{Error: false, Message: "Sesión cerrada"})
}
