package config

import (
	"os"
	"strconv"
)

type ServerConfig struct {
	Port int
}

type DatabaseConfig struct {
	Host     string
	Port     int
	Username string
	Password string
	Database string
	SSLMode  string
}

type JWTConfig struct {
	Secret            string
	AccessTokenTTLMin int
	RefreshTokenTTLHr int
	Issuer            string
	Audience          string
	CookieDomain      string
}

type Config struct {
	ServerConfig   ServerConfig
	DatabaseConfig DatabaseConfig
	JWTConfig      JWTConfig
	FrontendURL    string
}

// LoadConfig lee la configuración desde variables de entorno, con valores
// por defecto razonables para desarrollo local (docker-compose).
func LoadConfig() (*Config, error) {
	port, err := strconv.Atoi(getEnv("PORT", "8000"))
	if err != nil {
		return nil, err
	}

	dbPort, err := strconv.Atoi(getEnv("DB_PORT", "5432"))
	if err != nil {
		return nil, err
	}

	accessTTL, err := strconv.Atoi(getEnv("JWT_ACCESS_TTL_MIN", "15"))
	if err != nil {
		return nil, err
	}

	refreshTTL, err := strconv.Atoi(getEnv("JWT_REFRESH_TTL_HOURS", "168"))
	if err != nil {
		return nil, err
	}

	cfg := &Config{
		ServerConfig: ServerConfig{
			Port: port,
		},
		DatabaseConfig: DatabaseConfig{
			Host:     getEnv("DB_HOST", "db"),
			Port:     dbPort,
			Username: getEnv("DB_USER", "postgres"),
			Password: getEnv("DB_PASSWORD", "postgres"),
			Database: getEnv("DB_NAME", "portfolio-db"),
			SSLMode:  getEnv("DB_SSLMODE", "disable"),
		},
		JWTConfig: JWTConfig{
			Secret:            getEnv("JWT_SECRET", ""),
			AccessTokenTTLMin: accessTTL,
			RefreshTokenTTLHr: refreshTTL,
			Issuer:            getEnv("JWT_ISSUER", "diegoall.dev"),
			Audience:          getEnv("JWT_AUDIENCE", "diegoall.dev"),
			CookieDomain:      getEnv("COOKIE_DOMAIN", ""),
		},
		FrontendURL: getEnv("FRONTEND_URL", "http://localhost:5173"),
	}

	return cfg, nil
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok && value != "" {
		return value
	}
	return fallback
}
