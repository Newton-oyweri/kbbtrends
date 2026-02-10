import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.tsx";
import { useTheme } from "./ThemeContext.tsx";
import { supabase } from "../supabase";

export default function Profile() {
  const { theme } = useTheme();
  const [displayName, setDisplayName] = useState("");
  const [postContent, setPostContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("profiles").select("display_name").eq("id", user.id).single();
        if (data) setDisplayName(data.display_name || "");
      }
    };
    getProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName })
      .eq("id", user.id);

    alert(error ? "Update failed" : "Profile updated!");
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase
        .from("posts")
        .insert([{ content: postContent, user_id: user.id }]);

      if (!error) {
        setPostContent("");
        alert("Posted!");
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', backgroundColor: theme.bg, color: theme.text, minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '20px' }}>
        {/* Profile Edit Section */}
        <section style={{ marginBottom: '40px' }}>
          <h3>Edit Profile</h3>
          <form onSubmit={handleUpdateProfile}>
            <input 
              type="text" 
              className="form-control mb-2" 
              value={displayName} 
              onChange={(e) => setDisplayName(e.target.value)} 
              placeholder="Display Name"
            />
            <button type="submit" className="btn btn-secondary">Save Name</button>
          </form>
        </section>

        <hr />

        {/* Post Creation Section */}
        <section>
          <h3>Create New Post</h3>
          <form onSubmit={handleCreatePost}>
            <textarea
              className="form-control mb-2"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What's on your mind?"
              required
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Posting..." : "Post"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}