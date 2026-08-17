package postgresql

import (
	"database/sql"
	"fmt"

	"github.com/diegoall/portfolio-backend/internal/config"

	// Adaptador de pgx/v4 para database/sql. Se registra bajo el nombre de
	// driver "pgx" — el resto del código (sql.DB, QueryRowContext, etc.) no
	// cambia nada, porque sigue siendo la interfaz estándar database/sql.
	_ "github.com/jackc/pgx/v4/stdlib"
)

// NewPostgresConnection abre y verifica (Ping) la conexión a PostgreSQL.
func NewPostgresConnection(cfg *config.Config) (*sql.DB, error) {
	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		cfg.DatabaseConfig.Host,
		cfg.DatabaseConfig.Port,
		cfg.DatabaseConfig.Username,
		cfg.DatabaseConfig.Password,
		cfg.DatabaseConfig.Database,
		cfg.DatabaseConfig.SSLMode,
	)

	db, err := sql.Open("pgx", dsn)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, err
	}

	return db, nil
}
