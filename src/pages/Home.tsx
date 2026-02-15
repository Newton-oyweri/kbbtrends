import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from './ThemeContext.tsx';
import { supabase } from '../supabase';
import { Heart, MessageCircle, Share2, MoreHorizontal, Bell, Search, Zap } from 'lucide-react';

// --- TYPES ---
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

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select(`id, user_id, content, image_url, created_at, profiles ( display_name )`)
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

  // --- HELPERS ---
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
      
      {/* --- INJECTED ANIMATIONS (gradient now uses theme.primary → theme.secondary) --- */}
      <style>{`
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-trends {
          background: linear-gradient(-45deg, ${theme.primary}, ${theme.secondary || '#ff9500'}, #4bbdff, ${theme.primary});
          background-size: 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientFlow 6s ease infinite;
          font-weight: 900;
        }
        .nav-slide-down {
          animation: slideDown 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes postFadeIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .post-card {
          animation: postFadeIn 0.5s ease forwards;
        }
      `}</style>

      <nav className="navbar fixed-top px-5" style={{ 
        backgroundColor: `${theme.bg}F2`, 
        backdropFilter: 'blur(15px)', 
        borderBottom: `1px solid ${theme.border || '#1e3a5f'}88`, 
        height: '75px', 
        zIndex: 1050 
      }}>
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <Link to="/" className="d-flex align-items-center text-decoration-none">
            <Zap size={28} color={theme.primary} fill={theme.primary} className="me-2" />
            <h1 className="m-0" style={{ fontSize: '1.8rem', letterSpacing: '-1px' }}>
              <span style={{ color: theme.text, fontWeight: '800' }}>KIBABII</span>
              <span className="animate-trends ms-2">TRENDS</span>
            </h1>
          </Link>

          <div className="d-flex align-items-center bg-dark rounded-pill px-3 py-2" style={{ width: '400px', border: `1px solid ${theme.border || '#1e3a5f'}` }}>
            <Search size={18} className="opacity-50 me-2" style={{ color: theme.text }} />
            <input 
              type="text" 
              placeholder="Search Campus Trends..." 
              className="bg-transparent border-0 w-100" 
              style={{ outline: 'none', color: theme.text }} 
            />
          </div>

          <div className="d-flex gap-4 align-items-center">
            <Bell size={24} style={{ cursor: 'pointer', color: theme.text }} />
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: theme.primary }}></div>
          </div>
        </div>
      </nav>

      {/* --- MAIN FEED --- */}
      <main className="container-fluid" style={{ 
        paddingTop: '90px', 
        margin: '0 auto',
        paddingBottom: '40px'
      }}>
        
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', opacity: 0.7, color: theme.text }}>
            No trends yet. Start the vibe, Comrade!
          </div>
        ) : (
          posts.map((post, index) => (
            <article
              key={post.id}
              className="post-card shadow-sm"
              style={{
                backgroundColor: theme.cardBg,
                borderRadius: '20px',
                marginBottom: '16px',
                border: `1px solid ${theme.border || '#1e3a5f'}`,
                overflow: 'hidden',
                animationDelay: `${index * 0.1}s` 
              }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                      width: '42px', height: '42px', borderRadius: '12px',
                      backgroundColor: theme.primary, color: '#000',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 'bold', marginRight: '12px',
                      boxShadow: `0 4px 12px ${theme.primary}66`
                    }}>
                    {(post.profiles?.display_name?.[0] || '?').toUpperCase()}
                  </div>
                  <div>
                    <Link to={`/profileview/${post.user_id}`} style={{ color: theme.text, textDecoration: 'none', fontWeight: 700 }}>
                      {post.profiles?.display_name || 'Anonymous Comrade'}
                    </Link>
                    <div style={{ opacity: 0.6, fontSize: '0.75rem', color: theme.text }}>
                      {formatDate(post.created_at)}
                    </div>
                  </div>
                </div>
                <MoreHorizontal size={20} style={{ opacity: 0.6, cursor: 'pointer', color: theme.text }} />
              </div>

              {/* Text Content */}
              {post.content && (
                <div style={{ padding: '0px 18px 15px 18px', fontSize: '1.05rem', lineHeight: '1.5', color: theme.text }}>
                  {post.content}
                </div>
              )}

              {/* Media Content */}
              {post.image_url && (
                <div style={{ width: '100%', backgroundColor: '#000', overflow: 'hidden' }}>
                  <img 
                    src={post.image_url} 
                    alt="Trend" 
                    style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', display: 'block' }} 
                  />
                </div>
              )}

              {/* Action Bar */}
              <div style={{ 
                display: 'flex', 
                padding: '8px 12px', 
                borderTop: `1px solid ${theme.border || '#1e3a5f'}44`,
                justifyContent: 'space-around'
              }}>
                <ActionButton icon={<Heart size={20} />} label="Liking" color="#ff4b4b" hoverBg="#ff4b4b22" />
                <ActionButton icon={<MessageCircle size={20} />} label="Talk" color={theme.primary} hoverBg={`${theme.primary}22`} />
                <ActionButton icon={<Share2 size={20} />} label="Plug" color={theme.secondary || '#ff9500'} hoverBg={`${theme.secondary || '#ff9500'}22`} />
              </div>
            </article>
          ))
        )}
      </main>
    </div>
  );
}

// --- REUSABLE ACTION BUTTON ---
function ActionButton({ icon, label, color, hoverBg }: any) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => setActive(!active)}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        background: hover ? hoverBg : 'none', border: 'none',
        color: active ? color : (hover ? color : 'inherit'), 
        padding: '10px 15px',
        borderRadius: '12px', cursor: 'pointer', fontSize: '0.9rem',
        flex: 1, justifyContent: 'center', transition: 'all 0.2s ease',
        transform: active ? 'scale(1.1)' : 'scale(1)'
      }}
    >
      {icon}
      <span style={{ fontWeight: '600' }}>{label}</span>
    </button>
  );
}