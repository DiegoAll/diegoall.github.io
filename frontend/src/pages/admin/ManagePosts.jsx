import { useCallback, useEffect, useMemo, useState } from 'react';
import { marked } from 'marked';
import { useAuth } from '../../context/AuthContext';
import { useAdminApi } from '../../hooks/useAdminApi';

const emptyForm = {
  id: null,
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image: '',
  tags: '',
  categories: '',
  published: false,
};

function ManagePosts() {
  const { logout } = useAuth();
  const { request } = useAdminApi();

  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Vista previa en vivo: convierte el Markdown que el admin va escribiendo
  // a HTML con el mismo parser (marked) que usa BlogPost.jsx en el sitio
  // público — así lo que se ve acá es exactamente lo que verá el visitante.
  const previewHtml = useMemo(() => marked.parse(form.content || ''), [form.content]);

  const loadPosts = useCallback(async () => {
    setStatus('loading');
    try {
      // GET /v1/admin/posts trae TODOS los posts (incluye borradores),
      // a diferencia de GET /v1/posts que usa el frontend público.
      const json = await request('/v1/admin/posts');
      setPosts(json.data || []);
      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }, [request]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  function openCreateForm() {
    setForm(emptyForm);
    setError('');
    setShowForm(true);
  }

  function openEditForm(post) {
    setForm({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      cover_image: post.cover_image || '',
      tags: (post.tags || []).join(', '),
      categories: (post.categories || []).join(', '),
      published: post.published,
    });
    setError('');
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      content: form.content,
      cover_image: form.cover_image,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      categories: form.categories.split(',').map((c) => c.trim()).filter(Boolean),
      published: form.published,
    };

    try {
      if (form.id) {
        await request(`/v1/admin/posts/${form.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await request('/v1/admin/posts', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      setShowForm(false);
      await loadPosts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // togglePublished reutiliza PUT /v1/admin/posts/{id} enviando solo el campo
  // "published" — el backend soporta actualización parcial (UpdatePostInput
  // usa punteros: un campo ausente en el JSON significa "no tocar", ver
  // post.go y post_service.go), así que no hace falta reenviar todo el post.
  async function togglePublished(post) {
    setError('');
    try {
      await request(`/v1/admin/posts/${post.id}`, {
        method: 'PUT',
        body: JSON.stringify({ published: !post.published }),
      });
      await loadPosts();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(post) {
    if (!window.confirm(`¿Eliminar "${post.title}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    setError('');
    try {
      await request(`/v1/admin/posts/${post.id}`, { method: 'DELETE' });
      await loadPosts();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Gestionar posts</h1>
        <div className="admin-header-actions">
          <button className="admin-btn-primary" onClick={openCreateForm}>
            + Nuevo post
          </button>
          <button className="admin-btn-secondary" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {error && <p className="admin-login-error">{error}</p>}

      {status === 'loading' && <p className="admin-status">Cargando posts...</p>}
      {status === 'error' && !posts.length && (
        <p className="admin-status">No se pudieron cargar los posts.</p>
      )}

      {status === 'success' && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Estado</th>
              <th>Creado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <span className={`admin-badge ${post.published ? 'published' : 'draft'}`}>
                    {post.published ? 'Publicado' : 'Borrador'}
                  </span>
                </td>
                <td>{new Date(post.created_at).toLocaleDateString('es-CO')}</td>
                <td className="admin-table-actions">
                  <button className="admin-row-btn" onClick={() => openEditForm(post)}>
                    Editar
                  </button>
                  <button
                    className={post.published ? 'admin-row-btn warn' : 'admin-row-btn success'}
                    onClick={() => togglePublished(post)}
                  >
                    {post.published ? 'Deshabilitar' : 'Publicar'}
                  </button>
                  <button className="admin-row-btn danger" onClick={() => handleDelete(post)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan="4">Aún no hay posts.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <form
            className="admin-modal admin-modal-wide"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <h2>{form.id ? 'Editar post' : 'Nuevo post'}</h2>

            <label className="admin-field">
              <span>Título</span>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </label>

            <label className="admin-field">
              <span>Slug (opcional — se genera del título si se deja vacío)</span>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </label>

            <label className="admin-field">
              <span>Extracto — resumen corto que aparece en la tarjeta del blog (no en el post completo)</span>
              <textarea
                rows={2}
                placeholder="Ej: Cómo protegimos la API de ataques de fuerza bruta con rate limiting..."
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              />
            </label>

            <label className="admin-field">
              <span>Contenido — Markdown (mismo formato de GitHub: # título, **negrita**, listas, etc.)</span>
            </label>
            <div className="admin-editor-split">
              <textarea
                className="admin-editor-textarea"
                rows={16}
                placeholder={'## Subtítulo\n\nTexto normal con **negrita** y `código`.\n\n- item 1\n- item 2'}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
              <div
                className="admin-editor-preview"
                dangerouslySetInnerHTML={{ __html: previewHtml || '<p class="admin-editor-empty">La vista previa aparece aquí…</p>' }}
              />
            </div>

            <label className="admin-field">
              <span>Imagen de portada (URL)</span>
              <input
                value={form.cover_image}
                onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
              />
            </label>

            <label className="admin-field">
              <span>Tags (separados por coma)</span>
              <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
            </label>

            <label className="admin-field">
              <span>Categorías (separadas por coma)</span>
              <input
                value={form.categories}
                onChange={(e) => setForm({ ...form, categories: e.target.value })}
              />
            </label>

            <label className="admin-checkbox">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              <span>Publicado</span>
            </label>

            <div className="admin-modal-actions">
              <button type="button" onClick={() => setShowForm(false)}>
                Cancelar
              </button>
              <button type="submit" className="admin-btn-primary" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ManagePosts;