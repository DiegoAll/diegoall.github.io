import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | success | error

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_URL}/v1/posts`)
      .then((res) => {
        if (!res.ok) throw new Error('Request failed');
        return res.json();
      })
      .then((json) => {
        if (!cancelled) {
          setPosts(json.data || []);
          setStatus('success');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => { cancelled = true; };
  }, []);

  return (
    <section className="blog-page">
      <h1 className="section-title">Blog</h1>

      {status === 'loading' && (
        <p className="blog-status">Cargando publicaciones...</p>
      )}

      {status === 'error' && (
        <p className="blog-status">
          No se pudieron cargar las publicaciones. Intenta de nuevo más tarde.
        </p>
      )}

      {status === 'success' && posts.length === 0 && (
        <p className="blog-status">Aún no hay publicaciones.</p>
      )}

      {status === 'success' && posts.length > 0 && (
        <div className="blog-list">
          {posts.map((post) => (
            <Link to={`/blog/${post.slug}`} className="blog-card" key={post.slug}>
              <div className="blog-card-body">
                <span className="blog-card-date">
                  {new Date(post.created_at).toLocaleDateString('es-CO', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </span>
                <h2 className="blog-card-title">{post.title}</h2>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <span className="blog-card-link">Leer más →</span>
              </div>

              <div className="blog-card-thumb">
                {post.cover_image ? (
                  <img src={post.cover_image} alt={post.title} />
                ) : (
                  <span className="blog-card-thumb-initial">
                    {post.title.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default Blog;