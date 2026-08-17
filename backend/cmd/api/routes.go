package main

import (
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
)

func (app *application) routes() http.Handler {
	mux := chi.NewRouter()
	mux.Use(middleware.Recoverer)
	mux.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{app.config.FrontendURL},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	mux.Route("/v1", func(r chi.Router) {
		// ── Rutas públicas ────────────────────────────────────────────────
		r.Get("/health", app.systemController.HealthCheck)
		r.Get("/posts", app.postController.ListPublicPosts)
		r.Get("/posts/{slug}", app.postController.GetPostBySlug)

		// ── Rutas de administración ("ocultas") ──────────────────────────
		// No están enlazadas desde ninguna vista del frontend público.
		// Login/Refresh/Logout no llevan el middleware (obviamente: todavía
		// no hay token). Las de posts sí, protegidas por JWT.
		r.Route("/admin", func(r chi.Router) {
			r.Post("/login", app.authController.Login)
			r.Get("/refresh", app.authController.Refresh)
			r.Get("/logout", app.authController.Logout)

			r.Group(func(r chi.Router) {
				r.Use(app.middleware.AuthTokenMiddleware)
				r.Get("/posts", app.postController.ListAllPosts)
				r.Post("/posts", app.postController.CreatePost)
				r.Put("/posts/{id}", app.postController.UpdatePost)
				r.Delete("/posts/{id}", app.postController.DeletePost)
			})
		})
	})

	return mux
}
