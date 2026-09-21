package controllers

import (
	"database/sql"
	"net/http"

	"github.com/diegoall/portfolio-backend/internal/pkg/logger"
	"github.com/diegoall/portfolio-backend/internal/pkg/utils"
)

// SettingsController no usa repository ni service a propósito: a diferencia
// de Post (slugs, normalización de tags) o Auth (bcrypt, JWT), este dominio
// no tiene lógica de negocio que separar de la persistencia — es un
// key/value plano. Envolverlo en las mismas 3 capas que Post/Auth sería
// ceremonia sin beneficio. Si en el futuro Settings crece con reglas reales
// (ej. validaciones, dependencias entre flags), ahí sí se justifica
// extraer repository/service siguiendo el mismo patrón que el resto.
type SettingsController struct {
	db *sql.DB
}

func NewSettingsController(db *sql.DB) *SettingsController {
	return &SettingsController{db: db}
}

type settingsResponse struct {
	HighlightsEnabled bool `json:"highlights_enabled"`
}

// GetPublicSettings — GET /v1/settings (público).
// El Navbar y la ruta /highlights del frontend la consultan en cada carga
// para decidir si se muestran.
func (sc *SettingsController) GetPublicSettings(w http.ResponseWriter, r *http.Request) {
	var enabled bool
	query := `SELECT value FROM site_settings WHERE key = 'highlights_enabled'`
	err := sc.db.QueryRowContext(r.Context(), query).Scan(&enabled)
	if err != nil {
		// Si la fila no existe todavía (antes de correr la migración a
		// mano), asumimos "encendido" para no romper el sitio por defecto.
		enabled = true
	}

	utils.WriteJSON(w, http.StatusOK, utils.JSONResponse{
		Error: false,
		Data:  settingsResponse{HighlightsEnabled: enabled},
	})
}

// UpdateHighlightsSetting — PUT /v1/admin/settings/highlights (protegido).
// Body esperado: {"enabled": false}
func (sc *SettingsController) UpdateHighlightsSetting(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Enabled bool `json:"enabled"`
	}
	if err := utils.ReadJSON(w, r, &input); err != nil {
		utils.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	query := `
		INSERT INTO site_settings (key, value) VALUES ('highlights_enabled', $1)
		ON CONFLICT (key) DO UPDATE SET value = $1`
	if _, err := sc.db.ExecContext(r.Context(), query, input.Enabled); err != nil {
		logger.ErrorLog.Printf("Error al actualizar settings: %v", err)
		utils.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	logger.InfoLog.Printf("Highlights enabled actualizado a: %v", input.Enabled)
	utils.WriteJSON(w, http.StatusOK, utils.JSONResponse{
		Error:   false,
		Message: "Configuración actualizada",
		Data:    settingsResponse{HighlightsEnabled: input.Enabled},
	})
}
