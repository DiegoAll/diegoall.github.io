package postgresql

import (
	"context"
	"database/sql"

	"github.com/diegoall/portfolio-backend/internal/models"
)

type AuthPostgresRepository struct {
	DB *sql.DB
}

func NewAuthPostgresRepository(db *sql.DB) *AuthPostgresRepository {
	return &AuthPostgresRepository{DB: db}
}

func (r *AuthPostgresRepository) GetUserByEmail(ctx context.Context, email string) (*models.AdminUser, error) {
	query := `
		SELECT id, email, password_hash, created_at
		FROM admin_users
		WHERE email = $1`

	user := &models.AdminUser{}
	err := r.DB.QueryRowContext(ctx, query, email).Scan(
		&user.ID, &user.Email, &user.PasswordHash, &user.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (r *AuthPostgresRepository) GetUserByID(ctx context.Context, id int) (*models.AdminUser, error) {
	query := `
		SELECT id, email, password_hash, created_at
		FROM admin_users
		WHERE id = $1`

	user := &models.AdminUser{}
	err := r.DB.QueryRowContext(ctx, query, id).Scan(
		&user.ID, &user.Email, &user.PasswordHash, &user.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (r *AuthPostgresRepository) CreateUser(ctx context.Context, email, passwordHash string) error {
	query := `
		INSERT INTO admin_users (email, password_hash)
		VALUES ($1, $2)
		ON CONFLICT (email) DO NOTHING`

	_, err := r.DB.ExecContext(ctx, query, email, passwordHash)
	return err
}
