import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost';

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
        <Link to="/blog" className="highlight-link">← Volver al blog</Link>
      </div>
    );
  }

  return (
    <article className="blog-post-page">
      <Link to="/blog" className="blog-back-link">← Volver al blog</Link>
      <span className="blog-card-date">
        {new Date(post.created_at).toLocaleDateString('es-CO', {
          year: 'numeric', month: 'long', day: 'numeric',
        })}
      </span>
      <h1 className="blog-post-title">{post.title}</h1>
      <div
        className="blog-post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}

export default BlogPost;