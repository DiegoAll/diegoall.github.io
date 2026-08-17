-- ─────────────────────────────────────────────────────────────────────────
-- Portfolio Backend — esquema inicial
-- Se ejecuta automáticamente al levantar el contenedor de Postgres
-- (docker-entrypoint-initdb.d), solo en un volumen nuevo/vacío.
-- ─────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS admin_users (
    id            SERIAL PRIMARY KEY,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    slug        VARCHAR(255) UNIQUE NOT NULL,
    excerpt     TEXT DEFAULT '',
    content     TEXT NOT NULL DEFAULT '',
    cover_image VARCHAR(500) DEFAULT '',
    published   BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_published ON posts (published);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts (slug);

-- ── Posts de ejemplo tipo "lorem ipsum" ─────────────────────────────────
-- Sirven para probar de una vez el listado público, el detalle por slug,
-- y el filtro published/borrador, mientras se construye el panel admin.
INSERT INTO posts (title, slug, excerpt, content, published)
VALUES
  (
    'Bienvenido a mi portfolio',
    'bienvenido-a-mi-portfolio',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    true
  ),
  (
    'Notas sobre seguridad en APIs',
    'notas-sobre-seguridad-en-apis',
    'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.',
    'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore veritatis.',
    true
  ),
  (
    'Borrador: próximo proyecto',
    'borrador-proximo-proyecto',
    'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
    'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
    false
  )
ON CONFLICT (slug) DO NOTHING;

-- ── Usuario admin ────────────────────────────────────────────────────────
-- Generar el hash con: go run ./cmd/hashgen "tu-password-segura"
-- Descomentar y completar antes de levantar en un entorno real:
-- INSERT INTO admin_users (email, password_hash) VALUES
--   ('diego@example.com', '<hash_bcrypt_aqui>')
-- ON CONFLICT (email) DO NOTHING;