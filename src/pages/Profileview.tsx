import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
import { useTheme } from "./ThemeContext.tsx";
import { supabase } from "../supabase";

export default function ProfileView() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, email, id, avatar_url, cover_url, bio")
        .eq("id", userId)
        .single();

      if (error) setError("User not found");
      else setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, [userId]);

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: "100vh", display: "flex", flexDirection: "row" }}>
      <Navbar />

      <main style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "100px 20px" }}>
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : error ? (
          <div style={{ maxWidth: "600px", margin: "40px auto", textAlign: "center" }}>
            <div className="alert alert-danger">{error}</div>
          </div>
        ) : (
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            
            {/* --- COVER PHOTO --- */}
            <div
              onClick={() => profile.cover_url && setShowModal(true)}
              style={{
                width: "100%",
                aspectRatio: "16 / 6",
                backgroundColor: `${theme.primary}20`,
                backgroundImage: profile.cover_url ? `url(${profile.cover_url})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "20px",
                border: `1px solid ${theme.primary}10`,
                cursor: "pointer",
                zIndex: 1, // Stay behind avatar
                position: "relative"
              }}
            />

            {/* --- AVATAR & STATS --- */}
            <div style={{ padding: "0 20px", position: "relative", zIndex: 2 }}>
              <div style={{ display: "flex", alignItems: "flex-end", marginTop: "-65px", gap: "20px", flexWrap: "wrap" }}>
                
                {/* Avatar with high z-index */}
                <img
                  src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.display_name}`}
                  alt="Avatar"
                  style={{
                    width: "130px", height: "130px", borderRadius: "50%",
                    border: `6px solid ${theme.bg}`,
                    objectFit: "cover",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
                  }}
                />

                <div style={{ flex: 1, paddingBottom: "10px", minWidth: "250px" }}>
                  <h2 style={{ margin: "0 0 4px", fontWeight: 800 }}>{profile.display_name}</h2>
                  
                  {/* PLACEHOLDER STATS */}
                  <div className="d-flex gap-4 mt-2" style={{ opacity: 0.8, fontSize: "0.9rem" }}>
                    <span><strong>1.2k</strong> Followers</span>
                    <span><strong>450</strong> Following</span>
                    <span><strong>8.5k</strong> Likes</span>
                  </div>
                </div>

                {/* ANIMATED MESSAGE BUTTON */}
                <div style={{ position: "relative", paddingBottom: "10px" }}>
                  {/* Cartoon Bubble Animation */}
                  <div className="cartoon-hi" style={{
                    position: "absolute",
                    top: "-40px",
                    left: "10px",
                    background: theme.primary,
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: "15px 15px 15px 2px",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    animation: "bounce 2s infinite"
                  }}>
                    Hi! 👋
                  </div>

                  <button
                    style={{
                      backgroundColor: theme.primary, color: "white", border: "none",
                      padding: "12px 28px", borderRadius: "50px", fontWeight: "bold",
                      boxShadow: `0 4px 14px ${theme.primary}40`, cursor: "pointer"
                    }}
                    onClick={() => navigate(`/chat/${profile.id}`)}
                  >
                    Message
                  </button>
                </div>
              </div>

              {/* BIO */}
              <div style={{ marginTop: "40px" }}>
                <p style={{ 
                    fontSize: "1.05rem", lineHeight: 1.6, padding: "20px",
                    backgroundColor: `${theme.primary}05`, borderRadius: "15px",
                    borderLeft: `5px solid ${theme.primary}`
                }}>
                  {profile.bio || "No bio yet... this user is a man/woman of mystery."}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL CSS (Add this to your global CSS or a style tag) */}
      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {transform: translateY(0) rotate(-5deg);}
          40% {transform: translateY(-10px) rotate(5deg);}
          60% {transform: translateY(-5px) rotate(-5deg);}
        }
        .cartoon-hi:after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          border-width: 8px 8px 0 0;
          border-style: solid;
          border-color: ${theme.primary} transparent transparent transparent;
        }
      `}</style>

      {/* COVER MODAL */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, cursor: 'zoom-out'
        }}>
          <img src={profile.cover_url} alt="Full Cover" style={{ maxWidth: '90%', maxHeight: '80%', borderRadius: '12px' }} />
        </div>
      )}
    </div>
  );
}