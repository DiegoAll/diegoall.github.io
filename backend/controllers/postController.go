package controllers

import (
	"net/http"
	"strconv"

	"github.com/diegoall/portfolio-backend/internal/models"
	"github.com/diegoall/portfolio-backend/internal/pkg/logger"
	"github.com/diegoall/portfolio-backend/internal/pkg/utils"
	"github.com/diegoall/portfolio-backend/services"

	"github.com/go-chi/chi"
)

type PostController struct {
	service services.PostService
}

func NewPostController(service services.PostService) *PostController {
	return &PostController{service: service}
}

// ListPublicPosts — GET /v1/posts (público, solo posts publicados).
func (pc *PostController) ListPublicPosts(w http.ResponseWriter, r *http.Request) {
	posts, err := pc.service.ListPosts(r.Context(), true)
	if err != nil {
		logger.ErrorLog.Printf("Error al listar posts: %v", err)
		utils.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusOK, utils.JSONResponse{Error: false, Data: posts})
}

// GetPostBySlug — GET /v1/posts/{slug} (público).
func (pc *PostController) GetPostBySlug(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")

	post, err := pc.service.GetPostBySlug(r.Context(), slug)
	if err != nil {
		utils.ErrorJSON(w, err, http.StatusNotFound)
		return
	}
	utils.WriteJSON(w, http.StatusOK, utils.JSONResponse{Error: false, Data: post})
}

// ListAllPosts — GET /v1/admin/posts (protegido, incluye borradores).
func (pc *PostController) ListAllPosts(w http.ResponseWriter, r *http.Request) {
	posts, err := pc.service.ListPosts(r.Context(), false)
	if err != nil {
		logger.ErrorLog.Printf("Error al listar posts (admin): %v", err)
		utils.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusOK, utils.JSONResponse{Error: false, Data: posts})
}

// CreatePost — POST /v1/admin/posts (protegido).
func (pc *PostController) CreatePost(w http.ResponseWriter, r *http.Request) {
	var input models.CreatePostInput
	if err := utils.ReadJSON(w, r, &input); err != nil {
		utils.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	post, err := pc.service.CreatePost(r.Context(), input)
	if err != nil {
		utils.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	logger.InfoLog.Printf("Post creado: %s (id=%d)", post.Slug, post.ID)
	utils.WriteJSON(w, http.StatusCreated, utils.JSONResponse{
		Error:   false,
		Message: "Post creado exitosamente",
		Data:    post,
	})
}

// UpdatePost — PUT /v1/admin/posts/{id} (protegido).
func (pc *PostController) UpdatePost(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		utils.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	var input models.UpdatePostInput
	if err := utils.ReadJSON(w, r, &input); err != nil {
		utils.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	post, err := pc.service.UpdatePost(r.Context(), id, input)
	if err != nil {
		utils.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	utils.WriteJSON(w, http.StatusOK, utils.JSONResponse{
		Error:   false,
		Message: "Post actualizado",
		Data:    post,
	})
}

// DeletePost — DELETE /v1/admin/posts/{id} (protegido).
func (pc *PostController) DeletePost(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		utils.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	if err := pc.service.DeletePost(r.Context(), id); err != nil {
		utils.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	utils.WriteJSON(w, http.StatusOK, utils.JSONResponse{Error: false, Message: "Post eliminado"})
}
