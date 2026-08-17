package models

import "time"

// Post representa una entrada del blog del portfolio.
type Post struct {
	ID         int       `json:"id"`
	Title      string    `json:"title"`
	Slug       string    `json:"slug"`
	Excerpt    string    `json:"excerpt"`
	Content    string    `json:"content"`
	CoverImage string    `json:"cover_image,omitempty"`
	Published  bool      `json:"published"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

// CreatePostInput es el payload esperado en POST /v1/admin/posts.
// Si Slug viene vacío, el service lo genera automáticamente desde Title.
type CreatePostInput struct {
	Title      string `json:"title"`
	Slug       string `json:"slug"`
	Excerpt    string `json:"excerpt"`
	Content    string `json:"content"`
	CoverImage string `json:"cover_image"`
	Published  bool   `json:"published"`
}

// UpdatePostInput es el payload esperado en PUT /v1/admin/posts/{id}.
// Los punteros permiten actualizaciones parciales: un campo nil significa
// "no tocar este campo".
type UpdatePostInput struct {
	Title      *string `json:"title"`
	Slug       *string `json:"slug"`
	Excerpt    *string `json:"excerpt"`
	Content    *string `json:"content"`
	CoverImage *string `json:"cover_image"`
	Published  *bool   `json:"published"`
}
