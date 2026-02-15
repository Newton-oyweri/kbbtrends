import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { useTheme } from '../pages/ThemeContext.tsx';

type Post = {
  id: string;
  user_id: string;
  content: string | null;
  image_url: string | null;
  created_at: string;
  profiles: { display_name: string | null; avatar_url: string | null; } | null;
};

export default function PostFeed() {
  const { theme } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select(`id, user_id, content, image_url, created_at, profiles!inner ( display_name, avatar_url )`)
        .order('created_at', { ascending: false }).limit(30);
      if (data) setPosts(data as Post[]);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const formatDate = (dateStr: string) => {
    const diffMins = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;

  return (
    <div style={{  margin: '0 auto' }}>
      {posts.map((post, index) => (
        <article key={post.id} className="post-card shadow-sm" style={{ 
          backgroundColor: theme.cardBg, borderRadius: '20px', marginBottom: '16px', 
          border: `1px solid ${theme.border}44`, overflow: 'hidden', animationDelay: `${index * 0.1}s` 
        }}>
          <div className="d-flex align-items-center justify-content-between p-3">
            <Link to={`/profileview/${post.user_id}`} className="d-flex align-items-center text-decoration-none" style={{ color: theme.text }}>
              <img src={post.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${post.profiles?.display_name}`} 
                style={{ width: '42px', height: '42px', borderRadius: '12px', objectFit: 'cover', marginRight: '12px' }} alt="" />
              <div>
                <div className="fw-bold">{post.profiles?.display_name || 'Anonymous'}</div>
                <div className="small opacity-50">{formatDate(post.created_at)}</div>
              </div>
            </Link>
            <MoreHorizontal size={20} className="opacity-50 cursor-pointer" />
          </div>
          {post.content && <div className="px-3 pb-3">{post.content}</div>}
          {post.image_url && <img src={post.image_url} className="w-100" style={{ maxHeight: '500px', objectFit: 'cover' }} alt="" />}
          <div className="d-flex justify-content-around p-2 border-top border-secondary border-opacity-10">
            <button className="btn border-0 d-flex align-items-center gap-2" style={{ color: theme.text }}><Heart size={18}/> Liking</button>
            <button className="btn border-0 d-flex align-items-center gap-2" style={{ color: theme.text }}><MessageCircle size={18}/> Talk</button>
            <button className="btn border-0 d-flex align-items-center gap-2" style={{ color: theme.text }}><Share2 size={18}/> Plug</button>
          </div>
        </article>
      ))}
    </div>
  );
}