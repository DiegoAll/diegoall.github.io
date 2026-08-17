package models

import "time"

// AdminUser representa al único (o pocos) usuario(s) con acceso al panel
// de administración del portfolio.
type AdminUser struct {
	ID           int       `json:"id"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	CreatedAt    time.Time `json:"created_at"`
}

// LoginInput es el payload esperado en POST /v1/admin/login.
type LoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
