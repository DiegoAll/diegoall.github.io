package services

import (
	"context"
	"errors"
	"regexp"
	"strings"

	"github.com/diegoall/portfolio-backend/internal/models"
	"github.com/diegoall/portfolio-backend/internal/repository"
)

type PostService interface {
	CreatePost(ctx context.Context, input models.CreatePostInput) (*models.Post, error)
	GetPostByID(ctx context.Context, id int) (*models.Post, error)
	GetPostBySlug(ctx context.Context, slug string) (*models.Post, error)
	ListPosts(ctx context.Context, onlyPublished bool) ([]*models.Post, error)
	UpdatePost(ctx context.Context, id int, input models.UpdatePostInput) (*models.Post, error)
	DeletePost(ctx context.Context, id int) error
}

type DefaultPostService struct {
	repo repository.PostRepository
}

func NewDefaultPostService(repo repository.PostRepository) *DefaultPostService {
	return &DefaultPostService{repo: repo}
}

var slugSanitizer = regexp.MustCompile(`[^a-z0-9-]+`)

// slugify genera un slug URL-friendly a partir del título cuando el cliente
// no envía uno explícito.
func slugify(title string) string {
	s := strings.ToLower(strings.TrimSpace(title))
	s = strings.ReplaceAll(s, " ", "-")
	return slugSanitizer.ReplaceAllString(s, "")
}

// normalizeList limpia espacios, pasa a minúsculas y elimina duplicados y
// entradas vacías de una lista de tags o categorías. Se usa tanto en
// creación como en actualización para que el listado y el filtro (cuando lo
// agreguemos) siempre comparen valores consistentes.
func normalizeList(items []string) []string {
	seen := make(map[string]bool)
	out := make([]string, 0, len(items))
	for _, item := range items {
		v := strings.ToLower(strings.TrimSpace(item))
		if v == "" || seen[v] {
			continue
		}
		seen[v] = true
		out = append(out, v)
	}
	return out
}

func (s *DefaultPostService) CreatePost(ctx context.Context, input models.CreatePostInput) (*models.Post, error) {
	if strings.TrimSpace(input.Title) == "" {
		return nil, errors.New("el título es obligatorio")
	}

	slug := strings.TrimSpace(input.Slug)
	if slug == "" {
		slug = slugify(input.Title)
	}
	if slug == "" {
		return nil, errors.New("no fue posible generar un slug válido a partir del título")
	}

	post := &models.Post{
		Title:      input.Title,
		Slug:       slug,
		Excerpt:    input.Excerpt,
		Content:    input.Content,
		CoverImage: input.CoverImage,
		Tags:       normalizeList(input.Tags),
		Categories: normalizeList(input.Categories),
		Published:  input.Published,
	}

	if err := s.repo.CreatePost(ctx, post); err != nil {
		return nil, err
	}

	return post, nil
}

func (s *DefaultPostService) GetPostByID(ctx context.Context, id int) (*models.Post, error) {
	return s.repo.GetPostByID(ctx, id)
}

func (s *DefaultPostService) GetPostBySlug(ctx context.Context, slug string) (*models.Post, error) {
	return s.repo.GetPostBySlug(ctx, slug)
}

func (s *DefaultPostService) ListPosts(ctx context.Context, onlyPublished bool) ([]*models.Post, error) {
	posts, err := s.repo.ListPosts(ctx, onlyPublished)
	if err != nil {
		return nil, err
	}
	if posts == nil {
		posts = []*models.Post{}
	}
	return posts, nil
}

func (s *DefaultPostService) UpdatePost(ctx context.Context, id int, input models.UpdatePostInput) (*models.Post, error) {
	post, err := s.repo.GetPostByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if input.Title != nil {
		post.Title = *input.Title
	}
	if input.Slug != nil {
		post.Slug = *input.Slug
	}
	if input.Excerpt != nil {
		post.Excerpt = *input.Excerpt
	}
	if input.Content != nil {
		post.Content = *input.Content
	}
	if input.CoverImage != nil {
		post.CoverImage = *input.CoverImage
	}
	if input.Tags != nil {
		post.Tags = normalizeList(*input.Tags)
	}
	if input.Categories != nil {
		post.Categories = normalizeList(*input.Categories)
	}
	if input.Published != nil {
		post.Published = *input.Published
	}

	if err := s.repo.UpdatePost(ctx, post); err != nil {
		return nil, err
	}

	return post, nil
}

func (s *DefaultPostService) DeletePost(ctx context.Context, id int) error {
	return s.repo.DeletePost(ctx, id)
}
