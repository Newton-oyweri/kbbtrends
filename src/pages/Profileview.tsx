import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
import { useTheme } from "./ThemeContext.tsx";
import { supabase } from "../supabase";

interface Post {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
}

export default function ProfileView() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // State for Bootstrap Tabs
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      setLoading(true);
      
      // 1. Fetch Profile
      const { data: profileData, error: profileErr } = await supabase
        .from("profiles")
        .select("display_name, email, id, avatar_url, cover_url, bio")
        .eq("id", userId)
        .single();

      if (profileErr) {
        setError("User not found" as any);
      } else {
        setProfile(profileData);
        
        // 2. Fetch User's Posts
        const { data: postsData } = await supabase
          .from("posts")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        setPosts(postsData || []);
      }
      setLoading(false);
    };

    fetchProfileAndPosts();
  }, [userId]);

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: "100vh", display: "flex" }}>
      <Navbar />

      <main style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : error ? (
          <div className="alert alert-danger mx-auto" style={{ maxWidth: "600px" }}>{error}</div>
        ) : (
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            
            {/* --- COVER --- */}
            <div
              onClick={() => profile.cover_url && setShowModal(true)}
              style={{
                width: "100%", aspectRatio: "16 / 6",
                backgroundImage: profile.cover_url ? `url(${profile.cover_url})` : "none",
                backgroundColor: `${theme.primary}20`, backgroundSize: "cover", backgroundPosition: "center",
                borderRadius: "20px", cursor: profile.cover_url ? "pointer" : "default"
              }}
            />

            {/* --- HEADER --- */}
            <div style={{ padding: "0 20px", position: "relative" }}>
              <div style={{ display: "flex", alignItems: "flex-end", marginTop: "-65px", gap: "20px", flexWrap: "wrap" }}>
                <img
                  src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.display_name}`}
                  alt="Avatar"
                  style={{ width: "130px", height: "130px", borderRadius: "50%", border: `6px solid ${theme.bg}`, objectFit: "cover" }}
                />
                <div style={{ flex: 1, paddingBottom: "10px" }}>
                  <h2 className="mb-1 fw-bold">{profile.display_name}</h2>
                  <div className="d-flex gap-3 opacity-75 small">
                    <span><strong>{posts.length}</strong> Posts</span>
                    <span><strong>1.2k</strong> Followers</span>
                    <span><strong>8.5k</strong> Likes</span>
                  </div>
                </div>
                <div style={{ position: "relative", paddingBottom: "10px" }}>
                  <div className="cartoon-hi">Hi! 👋</div>
                  <button className="btn btn-primary rounded-pill px-4 fw-bold" onClick={() => navigate(`/chat/${profile.id}`)}>
                    Message
                  </button>
                </div>
              </div>

              {/* --- BOOTSTRAP TABS --- */}
              <ul className="nav nav-tabs mt-5 border-0 justify-content-center">
                <li className="nav-item">
                  <button 
                    className={`nav-link border-0 ${activeTab === 'posts' ? 'active fw-bold border-bottom border-3 border-primary' : ''}`}
                    style={{ color: activeTab === 'posts' ? theme.primary : theme.text, background: 'none' }}
                    onClick={() => setActiveTab('posts')}
                  >
                    Posts
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link border-0 ${activeTab === 'about' ? 'active fw-bold border-bottom border-3 border-primary' : ''}`}
                    style={{ color: activeTab === 'about' ? theme.primary : theme.text, background: 'none' }}
                    onClick={() => setActiveTab('about')}
                  >
                    About
                  </button>
                </li>
              </ul>

              {/* --- TAB CONTENT --- */}
              <div className="tab-content py-4">
                {activeTab === 'about' ? (
                  <div className="p-4 rounded-4" style={{ backgroundColor: `${theme.primary}05`, borderLeft: `5px solid ${theme.primary}` }}>
                    <h6 className="text-uppercase small opacity-50 fw-bold">Bio</h6>
                    <p style={{ whiteSpace: "pre-wrap" }}>{profile.bio || "No bio yet."}</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-4">
                    {posts.length === 0 ? (
                      <p className="text-center opacity-50 my-5">No posts yet.</p>
                    ) : (
                      posts.map((post) => (
                        <div key={post.id} className="p-4 rounded-4" style={{ backgroundColor: `${theme.primary}05`, border: `1px solid ${theme.primary}10` }}>
                          <p className="mb-3" style={{ fontSize: "1.1rem" }}>{post.content}</p>
                          {post.image_url && (
                            <img src={post.image_url} alt="Post" className="img-fluid rounded-3 mb-2" style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }} />
                          )}
                          <small className="opacity-50">{new Date(post.created_at).toLocaleDateString()}</small>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* STYLES */}
      <style>{`
        .nav-link.active { background-color: transparent !important; }
        .cartoon-hi {
          position: absolute; top: -40px; left: 10px; background: ${theme.primary};
          color: white; padding: 4px 12px; borderRadius: 15px 15px 15px 2px;
          fontSize: 0.8rem; fontWeight: bold; animation: bounce 2s infinite;
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
          40% {transform: translateY(-10px);}
        }
      `}</style>

      {/* IMAGE MODAL */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <img src={profile.cover_url} alt="Full Cover" style={{ maxWidth: '90%', maxHeight: '80%', borderRadius: '12px' }} />
        </div>
      )}
    </div>
  );
}