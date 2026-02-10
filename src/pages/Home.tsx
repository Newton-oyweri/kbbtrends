import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.tsx';
import { useTheme } from './ThemeContext.tsx';
import { supabase } from "../supabase";

export default function Dashboard() {
  const { theme } = useTheme();
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      // Pulls content + the display_name from the profiles table
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (
            display_name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (!error && data) setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <div style={{ display: 'flex', backgroundColor: theme.bg, color: theme.text, minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '20px' }}>
        {posts.map((post) => (
          <div key={post.id} style={{ borderBottom: `1px solid ${theme.primary}20`, padding: '15px' }}>
            {/* Accessing the joined profile data */}
            <strong style={{ color: theme.primary }}>
              {post.profiles?.display_name || 'User'} 
            </strong>
            <p style={{ margin: '8px 0' }}>{post.content}</p>
            {post.image_url && <img src={post.image_url} alt="post" style={{ maxWidth: '100%', borderRadius: '8px' }} />}
            <br />
            <small style={{ opacity: 0.5 }}>{new Date(post.created_at).toLocaleDateString()}</small>
          </div>
        ))}
      </main>
    </div>
  );
}