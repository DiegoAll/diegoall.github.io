package controllers

import (
	"net/http"

	"github.com/diegoall/portfolio-backend/internal/pkg/logger"
	"github.com/diegoall/portfolio-backend/internal/pkg/utils"
)

type SystemController struct{}

func NewSystemController() *SystemController {
	return &SystemController{}
}

func (sc *SystemController) HealthCheck(w http.ResponseWriter, r *http.Request) {
	response := utils.JSONResponse{
		Error:   false,
		Message: "API está operativa",
		Data: map[string]string{
			"status": "OK",
			"uptime": "server is running",
		},
	}

	utils.WriteJSON(w, http.StatusOK, response)
	logger.InfoLog.Println("Health check realizado: API operativa.")
}
