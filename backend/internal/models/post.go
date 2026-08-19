package models

import "time"

// Post representa una entrada del blog del portfolio.
type Post struct {
	ID         int    `json:"id"`
	Title      string `json:"title"`
	Slug       string `json:"slug"`
	Excerpt    string `json:"excerpt"`
	Content    string `json:"content"`
	CoverImage string `json:"cover_image,omitempty"`
	// Tags y Categories viajan como array en el JSON, aunque en la base de
	// datos se guardan como texto separado por coma (ver columnas tags y
	// categories en init.sql) — la conversión ocurre en el repository.
	Tags       []string  `json:"tags"`
	Categories []string  `json:"categories"`
	Published  bool      `json:"published"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

// CreatePostInput es el payload esperado en POST /v1/admin/posts.
// Si Slug viene vacío, el service lo genera automáticamente desde Title.
type CreatePostInput struct {
	Title      string   `json:"title"`
	Slug       string   `json:"slug"`
	Excerpt    string   `json:"excerpt"`
	Content    string   `json:"content"`
	CoverImage string   `json:"cover_image"`
	Tags       []string `json:"tags"`
	Categories []string `json:"categories"`
	Published  bool     `json:"published"`
}

// UpdatePostInput es el payload esperado en PUT /v1/admin/posts/{id}.
// Los punteros permiten actualizaciones parciales: un campo nil significa
// "no tocar este campo". Tags y Categories son slices, así que un valor nil
// (campo ausente en el JSON) significa "no tocar"; un slice vacío ([])
// significa "vaciar la lista" — se distinguen por presencia de la key en el
// JSON, no por longitud.
type UpdatePostInput struct {
	Title      *string   `json:"title"`
	Slug       *string   `json:"slug"`
	Excerpt    *string   `json:"excerpt"`
	Content    *string   `json:"content"`
	CoverImage *string   `json:"cover_image"`
	Tags       *[]string `json:"tags"`
	Categories *[]string `json:"categories"`
	Published  *bool     `json:"published"`
}
