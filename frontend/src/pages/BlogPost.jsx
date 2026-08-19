import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost';
const WORDS_PER_MINUTE = 200;

// Calcula un tiempo de lectura aproximado a partir del HTML del post, sin
// depender de un campo guardado en la base de datos (así nunca queda
// desincronizado si se edita el contenido desde el futuro panel de admin).
function estimateReadingTime(html) {
  const text = html.replace(/<[^>]+>/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  return minutes;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');

    fetch(`${API_URL}/v1/posts/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((json) => {
        if (!cancelled) {
          setPost(json.data);
          setStatus('success');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => { cancelled = true; };
  }, [slug]);

  if (status === 'loading') {
    return <p className="blog-status">Cargando...</p>;
  }

  if (status === 'error' || !post) {
    return (
      <div className="blog-post-page">
        <p className="blog-status">No se encontró esta publicación.</p>
        <Link to="/blog" className="blog-back-link">← Volver al blog</Link>
      </div>
    );
  }

  const readingMinutes = estimateReadingTime(post.content);
  // Se considera "actualizado" solo si la diferencia con la creación supera
  // un minuto — evita mostrar "Actualizado" en posts que nunca se editaron
  // (created_at y updated_at pueden diferir en milisegundos por el propio
  // INSERT con DEFAULT NOW() en dos columnas separadas).
  const wasUpdated =
    new Date(post.updated_at).getTime() - new Date(post.created_at).getTime() > 60000;

  return (
    <article className="blog-post-page">
      <Link to="/blog" className="blog-back-link">← Volver al blog</Link>

      {post.categories?.length > 0 && (
        <div className="blog-card-categories">
          {post.categories.map((c) => (
            <span className="blog-category-badge" key={c}>{c}</span>
          ))}
        </div>
      )}

      <h1 className="blog-post-title">{post.title}</h1>

      <div className="blog-post-meta">
        <span>{formatDate(post.created_at)}</span>
        <span className="blog-post-meta-sep">·</span>
        <span>{readingMinutes} min de lectura</span>
        {wasUpdated && (
          <>
            <span className="blog-post-meta-sep">·</span>
            <span>Actualizado el {formatDate(post.updated_at)}</span>
          </>
        )}
      </div>

      <div
        className="blog-post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.tags?.length > 0 && (
        <div className="blog-post-tags">
          {post.tags.map((t) => (
            <span className="blog-tag-chip" key={t}>#{t}</span>
          ))}
        </div>
      )}
    </article>
  );
}

export default BlogPost;