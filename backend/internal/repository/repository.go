package repository

import (
	"context"

	"github.com/diegoall/portfolio-backend/internal/models"
)

// PostRepository define las operaciones de persistencia para los posts del blog.
type PostRepository interface {
	CreatePost(ctx context.Context, post *models.Post) error
	GetPostByID(ctx context.Context, id int) (*models.Post, error)
	GetPostBySlug(ctx context.Context, slug string) (*models.Post, error)
	ListPosts(ctx context.Context, onlyPublished bool) ([]*models.Post, error)
	UpdatePost(ctx context.Context, post *models.Post) error
	DeletePost(ctx context.Context, id int) error
}

// AuthRepository define las operaciones de persistencia para el usuario administrador.
type AuthRepository interface {
	GetUserByEmail(ctx context.Context, email string) (*models.AdminUser, error)
	GetUserByID(ctx context.Context, id int) (*models.AdminUser, error)
	// CreateUser inserta un admin_user nuevo. Se usa desde el bootstrap de
	// arranque (ver cmd/api/main.go) para crear el primer admin a partir de
	// ADMIN_EMAIL / ADMIN_PASSWORD en docker-compose.yaml — no hace falta
	// una CLI aparte para generar el hash.
	CreateUser(ctx context.Context, email, passwordHash string) error
}

// Instancias globales, seteadas una vez en main.go e inyectadas hacia los
// servicios. Mismo patrón que en el proyecto de Bold.
var (
	PostRepo PostRepository
	AuthRepo AuthRepository
)

func SetPostRepository(r PostRepository) {
	PostRepo = r
}

func SetAuthRepository(r AuthRepository) {
	AuthRepo = r
}
