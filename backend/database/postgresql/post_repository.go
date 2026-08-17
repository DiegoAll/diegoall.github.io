package postgresql

import (
	"context"
	"database/sql"

	"github.com/diegoall/portfolio-backend/internal/models"
)

type PostPostgresRepository struct {
	DB *sql.DB
}

func NewPostPostgresRepository(db *sql.DB) *PostPostgresRepository {
	return &PostPostgresRepository{DB: db}
}

func (r *PostPostgresRepository) CreatePost(ctx context.Context, post *models.Post) error {
	query := `
		INSERT INTO posts (title, slug, excerpt, content, cover_image, published)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at, updated_at`

	return r.DB.QueryRowContext(ctx, query,
		post.Title, post.Slug, post.Excerpt, post.Content, post.CoverImage, post.Published,
	).Scan(&post.ID, &post.CreatedAt, &post.UpdatedAt)
}

func (r *PostPostgresRepository) GetPostByID(ctx context.Context, id int) (*models.Post, error) {
	query := `
		SELECT id, title, slug, excerpt, content, cover_image, published, created_at, updated_at
		FROM posts
		WHERE id = $1`

	post := &models.Post{}
	err := r.DB.QueryRowContext(ctx, query, id).Scan(
		&post.ID, &post.Title, &post.Slug, &post.Excerpt, &post.Content,
		&post.CoverImage, &post.Published, &post.CreatedAt, &post.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return post, nil
}

func (r *PostPostgresRepository) GetPostBySlug(ctx context.Context, slug string) (*models.Post, error) {
	query := `
		SELECT id, title, slug, excerpt, content, cover_image, published, created_at, updated_at
		FROM posts
		WHERE slug = $1`

	post := &models.Post{}
	err := r.DB.QueryRowContext(ctx, query, slug).Scan(
		&post.ID, &post.Title, &post.Slug, &post.Excerpt, &post.Content,
		&post.CoverImage, &post.Published, &post.CreatedAt, &post.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return post, nil
}

func (r *PostPostgresRepository) ListPosts(ctx context.Context, onlyPublished bool) ([]*models.Post, error) {
	query := `
		SELECT id, title, slug, excerpt, content, cover_image, published, created_at, updated_at
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
		if err := rows.Scan(
			&post.ID, &post.Title, &post.Slug, &post.Excerpt, &post.Content,
			&post.CoverImage, &post.Published, &post.CreatedAt, &post.UpdatedAt,
		); err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}

	return posts, rows.Err()
}

func (r *PostPostgresRepository) UpdatePost(ctx context.Context, post *models.Post) error {
	query := `
		UPDATE posts
		SET title = $1, slug = $2, excerpt = $3, content = $4, cover_image = $5, published = $6, updated_at = NOW()
		WHERE id = $7
		RETURNING updated_at`

	return r.DB.QueryRowContext(ctx, query,
		post.Title, post.Slug, post.Excerpt, post.Content, post.CoverImage, post.Published, post.ID,
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
