package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/diegoall/portfolio-backend/controllers"
	"github.com/diegoall/portfolio-backend/database/postgresql"
	"github.com/diegoall/portfolio-backend/internal/config"
	"github.com/diegoall/portfolio-backend/internal/pkg/logger"
	"github.com/diegoall/portfolio-backend/internal/pkg/middleware"
	"github.com/diegoall/portfolio-backend/internal/pkg/token"
	"github.com/diegoall/portfolio-backend/internal/repository"
	"github.com/diegoall/portfolio-backend/services"

	"golang.org/x/crypto/bcrypt"
)

type application struct {
	config           *config.Config
	infoLog          *log.Logger
	errorLog         *log.Logger
	middleware       *middleware.Middleware
	authController   *controllers.AuthController
	systemController *controllers.SystemController
	postController   *controllers.PostController
}

func main() {
	logger.Init()

	cfg, err := config.LoadConfig()
	if err != nil {
		logger.ErrorLog.Fatalf("Error al cargar la configuración: %v", err)
	}

	logger.InfoLog.Println("Servidor iniciado")

	db, err := postgresql.NewPostgresConnection(cfg)
	if err != nil {
		logger.ErrorLog.Fatalf("Error al conectar con la base de datos: %v", err)
	}
	logger.InfoLog.Println("Conexión a PostgreSQL establecida exitosamente.")

	defer func() {
		if err := db.Close(); err != nil {
			logger.ErrorLog.Printf("Error al cerrar la conexión a la base de datos: %v", err)
		}
	}()

	// ── Repositorios ──────────────────────────────────────────────────────
	authRepo := postgresql.NewAuthPostgresRepository(db)
	postRepo := postgresql.NewPostPostgresRepository(db)

	repository.SetAuthRepository(authRepo)
	repository.SetPostRepository(postRepo)

	// ── Bootstrap del admin desde variables de entorno ───────────────────
	// Reemplaza a la CLI cmd/hashgen: si ADMIN_EMAIL + ADMIN_PASSWORD están
	// seteadas (ver Docker-compose.yaml) y el usuario todavía no existe, se
	// crea acá con el hash bcrypt calculado en caliente. Es idempotente —
	// en arranques posteriores detecta que ya existe y no hace nada.
	bootstrapAdminUser(context.Background(), repository.AuthRepo)

	// ── Servicios ─────────────────────────────────────────────────────────
	jwtService := token.NewJWTService(cfg)
	authService := services.NewDefaultAuthService(repository.AuthRepo, jwtService)
	postService := services.NewDefaultPostService(repository.PostRepo)

	// ── Controladores ─────────────────────────────────────────────────────
	authController := controllers.NewAuthController(authService, jwtService)
	systemController := controllers.NewSystemController()
	postController := controllers.NewPostController(postService)

	mw := middleware.NewMiddleware(jwtService, authService)

	app := &application{
		config:           cfg,
		infoLog:          logger.InfoLog,
		errorLog:         logger.ErrorLog,
		middleware:       mw,
		authController:   authController,
		systemController: systemController,
		postController:   postController,
	}

	if err := app.serve(); err != nil {
		logger.ErrorLog.Fatal(err)
	}
}

// bootstrapAdminUser crea el primer usuario admin a partir de ADMIN_EMAIL y
// ADMIN_PASSWORD si ambas están presentes y el usuario todavía no existe.
// Pensado solo para el primer arranque: una vez creado el admin, podés
// quitar ADMIN_PASSWORD del .env/docker-compose (queda el hash en DB, la
// variable en texto plano ya no hace falta).
func bootstrapAdminUser(ctx context.Context, repo repository.AuthRepository) {
	email := os.Getenv("ADMIN_EMAIL")
	password := os.Getenv("ADMIN_PASSWORD")

	if email == "" || password == "" {
		return
	}

	if _, err := repo.GetUserByEmail(ctx, email); err == nil {
		// Ya existe — no hacemos nada (idempotente).
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		logger.ErrorLog.Printf("Error generando el hash del admin de bootstrap: %v", err)
		return
	}

	if err := repo.CreateUser(ctx, email, string(hash)); err != nil {
		logger.ErrorLog.Printf("Error creando el admin de bootstrap: %v", err)
		return
	}

	logger.InfoLog.Printf("Usuario admin creado desde variables de entorno: %s", email)
}

// serve levanta el servidor HTTP plano. El TLS/HTTPS se maneja en Nginx
// (reverse proxy), no acá, para mantener este servicio simple — a diferencia
// del proyecto de Bold donde el backend sí terminaba TLS directamente.
func (app *application) serve() error {
	app.infoLog.Printf("API escuchando en el puerto %d", app.config.ServerConfig.Port)

	srv := &http.Server{
		Addr:    fmt.Sprintf(":%d", app.config.ServerConfig.Port),
		Handler: app.routes(),
	}

	return srv.ListenAndServe()
}
