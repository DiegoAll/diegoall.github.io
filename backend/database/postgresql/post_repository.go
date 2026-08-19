package postgresql

import (
	"context"
	"database/sql"
	"strings"

	"github.com/diegoall/portfolio-backend/internal/models"
)

type PostPostgresRepository struct {
	DB *sql.DB
}

func NewPostPostgresRepository(db *sql.DB) *PostPostgresRepository {
	return &PostPostgresRepository{DB: db}
}

// ── Conversión tags/categories ──────────────────────────────────────────────
// En la base de datos, tags y categories se guardan como texto separado por
// coma (columnas VARCHAR, ver init.sql), pero el modelo Go los expone como
// []string para que el JSON hacia el frontend salga como array. Estas dos
// funciones son la única traducción entre ambos formatos — el service ya
// normaliza (minúsculas, sin duplicados) antes de llegar acá, así que este
// repository solo hace split/join, sin lógica de negocio.

func splitList(s string) []string {
	if strings.TrimSpace(s) == "" {
		return []string{}
	}
	parts := strings.Split(s, ",")
	out := make([]string, 0, len(parts))
	for _, p := range parts {
		v := strings.TrimSpace(p)
		if v != "" {
			out = append(out, v)
		}
	}
	return out
}

func joinList(items []string) string {
	return strings.Join(items, ", ")
}

func (r *PostPostgresRepository) CreatePost(ctx context.Context, post *models.Post) error {
	query := `
		INSERT INTO posts (title, slug, excerpt, content, cover_image, tags, categories, published)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, created_at, updated_at`

	return r.DB.QueryRowContext(ctx, query,
		post.Title, post.Slug, post.Excerpt, post.Content, post.CoverImage,
		joinList(post.Tags), joinList(post.Categories), post.Published,
	).Scan(&post.ID, &post.CreatedAt, &post.UpdatedAt)
}

func (r *PostPostgresRepository) GetPostByID(ctx context.Context, id int) (*models.Post, error) {
	query := `
		SELECT id, title, slug, excerpt, content, cover_image, tags, categories, published, created_at, updated_at
		FROM posts
		WHERE id = $1`

	post := &models.Post{}
	var tags, categories string
	err := r.DB.QueryRowContext(ctx, query, id).Scan(
		&post.ID, &post.Title, &post.Slug, &post.Excerpt, &post.Content,
		&post.CoverImage, &tags, &categories, &post.Published, &post.CreatedAt, &post.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	post.Tags = splitList(tags)
	post.Categories = splitList(categories)
	return post, nil
}

func (r *PostPostgresRepository) GetPostBySlug(ctx context.Context, slug string) (*models.Post, error) {
	query := `
		SELECT id, title, slug, excerpt, content, cover_image, tags, categories, published, created_at, updated_at
		FROM posts
		WHERE slug = $1`

	post := &models.Post{}
	var tags, categories string
	err := r.DB.QueryRowContext(ctx, query, slug).Scan(
		&post.ID, &post.Title, &post.Slug, &post.Excerpt, &post.Content,
		&post.CoverImage, &tags, &categories, &post.Published, &post.CreatedAt, &post.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	post.Tags = splitList(tags)
	post.Categories = splitList(categories)
	return post, nil
}

func (r *PostPostgresRepository) ListPosts(ctx context.Context, onlyPublished bool) ([]*models.Post, error) {
	query := `
		SELECT id, title, slug, excerpt, content, cover_image, tags, categories, published, created_at, updated_at
		FROM posts`

	if onlyPublished {
		query += ` WHERE published = true`
	}
	query += ` ORDER BY created_at DESC`

	rows, err := r.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []*models.Post
	for rows.Next() {
		post := &models.Post{}
		var tags, categories string
		if err := rows.Scan(
			&post.ID, &post.Title, &post.Slug, &post.Excerpt, &post.Content,
			&post.CoverImage, &tags, &categories, &post.Published, &post.CreatedAt, &post.UpdatedAt,
		); err != nil {
			return nil, err
		}
		post.Tags = splitList(tags)
		post.Categories = splitList(categories)
		posts = append(posts, post)
	}

	return posts, rows.Err()
}

func (r *PostPostgresRepository) UpdatePost(ctx context.Context, post *models.Post) error {
	query := `
		UPDATE posts
		SET title = $1, slug = $2, excerpt = $3, content = $4, cover_image = $5,
		    tags = $6, categories = $7, published = $8, updated_at = NOW()
		WHERE id = $9
		RETURNING updated_at`

	return r.DB.QueryRowContext(ctx, query,
		post.Title, post.Slug, post.Excerpt, post.Content, post.CoverImage,
		joinList(post.Tags), joinList(post.Categories), post.Published, post.ID,
	).Scan(&post.UpdatedAt)
}

func (r *PostPostgresRepository) DeletePost(ctx context.Context, id int) error {
	query := `DELETE FROM posts WHERE id = $1`

	result, err := r.DB.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return sql.ErrNoRows
	}

	return nil
}
