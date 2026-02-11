import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.tsx';
import { useTheme } from './ThemeContext.tsx';
import { supabase } from '../supabase';

type Post = {
  id: string;
  user_id: string;
  content: string | null;
  image_url: string | null;
  created_at: string;
  profiles: {
    display_name: string | null;
  } | null;
};

export default function Dashboard() {
  const { theme } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id, user_id, content, image_url, created_at,
          profiles ( display_name )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching posts:', error);
      } else if (data) {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      ...(date.getFullYear() !== now.getFullYear() && { year: 'numeric' }),
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.bg }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.text }}>
          Loading posts...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: theme.bg,
        color: theme.text,
      }}
    >
      {/* Left sidebar - fixed/sticky */}
      <div
     
      >
        <Navbar />  {/* vertical */}
      </div>

      {/* Main content area - scrolls */}
      <main
        style={{
    
          flex: 1,
          padding: '24px 32px',
          width: '100%',
          minHeight: '100vh',
        }}
      >
        {posts.length === 0 ? (
          <div className="w-100" style={{ textAlign: 'center', padding: '80px 20px', opacity: 0.7 }}>
            No posts yet. Be the first to share something!
          </div>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              style={{
                backgroundColor: theme.card || '#1e1e1e',
                borderRadius: '12px',
                marginBottom: '24px',
                padding: '20px',
                border: `1px solid ${theme.border || '#333'}`,
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: theme.primary,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    marginRight: '14px',
                    flexShrink: 0,
                  }}
                >
                  {(post.profiles?.display_name?.[0] || '?').toUpperCase()}
                </div>

                <div style={{ flex: 1 }}>
                  <Link
                    to={`/profileview/${post.user_id}`}
                    style={{
                      color: theme.text,
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '1.05rem',
                      display: 'block',
                    }}
                  >
                    {post.profiles?.display_name || 'User'}
                  </Link>
                  <small style={{ opacity: 0.65, fontSize: '0.875rem' }}>
                    {formatDate(post.created_at)}
                  </small>
                </div>
              </div>

              {/* Content text */}
              {post.content && (
                <p
                  style={{
                    margin: '0 0 16px 0',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    lineHeight: 1.6,
                    fontSize: '1.05rem',
                  }}
                >
                  {post.content}
                </p>
              )}

              {/* Image */}
              {post.image_url && (
                <div
                  style={{
                    margin: '12px 0',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: '#0001',
                  }}
                >
                  <img
                    src={post.image_url}
                    alt=""
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      maxHeight: '680px',
                      objectFit: 'cover',
                    }}
                    loading="lazy"
                  />
                </div>
              )}
            </article>
          ))
        )}
      </main>
    </div>
  );
}