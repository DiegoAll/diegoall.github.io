import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { dateLocale } from '../i18n/utils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost';

function Blog() {
  const { t, i18n } = useTranslation('blog');
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

  const locale = dateLocale(i18n.resolvedLanguage);

  return (
    <section className="blog-page">
      <h1 className="section-title">{t('title')}</h1>

      {status === 'loading' && (
        <p className="blog-status">{t('loading')}</p>
      )}

      {status === 'error' && (
        <p className="blog-status">{t('error')}</p>
      )}

      {status === 'success' && posts.length === 0 && (
        <p className="blog-status">{t('empty')}</p>
      )}

      {status === 'success' && posts.length > 0 && (
        <div className="blog-list">
          {posts.map((post) => (
            <Link to={`/blog/${post.slug}`} className="blog-card" key={post.slug}>
              <div className="blog-card-body">
                {post.categories?.length > 0 && (
                  <div className="blog-card-categories">
                    {post.categories.map((c) => (
                      <span className="blog-category-badge" key={c}>{c}</span>
                    ))}
                  </div>
                )}

                <span className="blog-card-date">
                  {new Date(post.created_at).toLocaleDateString(locale, {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </span>
                <h2 className="blog-card-title">{post.title}</h2>
                <p className="blog-card-excerpt">{post.excerpt}</p>

                {post.tags?.length > 0 && (
                  <div className="blog-card-tags">
                    {post.tags.map((tag) => (
                      <span className="blog-tag-chip" key={tag}>#{tag}</span>
                    ))}
                  </div>
                )}

                <span className="blog-card-link">{t('readMore')}</span>
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
