import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from './ThemeContext.tsx';
import { supabase } from '../supabase';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';

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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: theme.bg, color: theme.text }}>
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.bg, color: theme.text }}>
      <main style={{ width: '100%', padding: '10px' }}>
        
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', opacity: 0.7 }}>
            No posts yet.
          </div>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              style={{
                backgroundColor: theme.card || '#1e1e1e',
                borderRadius: '12px',
                marginBottom: '10px',
                border: `1px solid ${theme.border || '#333'}`,
                width: '100%', // Full screen width
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                      width: '45px', height: '45px', borderRadius: '50%',
                      backgroundColor: theme.primary, color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 'bold', marginRight: '12px',
                    }}>
                    {(post.profiles?.display_name?.[0] || '?').toUpperCase()}
                  </div>
                  <div>
                    <Link to={`/profileview/${post.user_id}`} style={{ color: theme.text, textDecoration: 'none', fontWeight: 700 }}>
                      {post.profiles?.display_name || 'User'}
                    </Link>
                    <div style={{ opacity: 0.5, fontSize: '0.8rem' }}>{formatDate(post.created_at)}</div>
                  </div>
                </div>
                <MoreHorizontal size={20} style={{ opacity: 0.6 }} />
              </div>

              {/* Content text */}
              {post.content && (
                <div style={{ padding: '0 16px 12px 16px', fontSize: '1.05rem', lineHeight: '1.5' }}>
                  {post.content}
                </div>
              )}

              {/* Full Width Image */}
              {post.image_url && (
                <div style={{ width: '100%', background: '#000' }}>
                  <img 
                    src={post.image_url} 
                    alt="" 
                    style={{ width: '100%', display: 'block', maxHeight: '80vh', objectFit: 'contain' }} 
                  />
                </div>
              )}

              {/* Full Width Action Bar */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '10px 16px', 
                borderTop: `1px solid ${theme.border}33`,
                justifyContent: 'space-around' // Distribute buttons evenly
              }}>
                <ActionButton icon={<Heart size={22} />} label="Like" color="#ff4b4b" hoverBg="#ff4b4b15" />
                <ActionButton icon={<MessageCircle size={22} />} label="Comment" color={theme.primary} hoverBg={`${theme.primary}15`} />
                <ActionButton icon={<Share2 size={22} />} label="Share" color="#4bbdff" hoverBg="#4bbdff15" />
              </div>
            </article>
          ))
        )}
      </main>
    </div>
  );
}

function ActionButton({ icon, label, color, hoverBg }: any) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        background: hover ? hoverBg : 'none', border: 'none',
        color: hover ? color : 'inherit', padding: '10px 20px',
        borderRadius: '8px', cursor: 'pointer', fontSize: '1rem',
        flex: 1, justifyContent: 'center', transition: '0.2s'
      }}
    >
      {icon}
      <span style={{ fontWeight: '500' }}>{label}</span>
    </button>
  );
}