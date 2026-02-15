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
  <div
    style={{
      backgroundColor: theme.bg,
      color: theme.text,
      minHeight: '100vh',
      display: 'flex',           // flex container
      flexDirection: 'row',      // ← key change: row instead of column
    }}
  >
    <Navbar />                   {/* assumed to be vertical sidebar now */}

    <main
      style={{
        flex: 1,                 // ← this makes main take all remaining horizontal space
        overflowY: 'auto',       // scroll if content is long
        padding: '20px',
      }}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : error ? (
        <div style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
          <div className="alert alert-danger">{error}</div>
        </div>
      ) : (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          {/* Cover */}
          <div
            style={{
              height: '180px',
              backgroundColor: theme.primary,
              backgroundImage: profile.cover_url ? `url(${profile.cover_url})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {/* Avatar + Name section */}
          <div style={{ textAlign: 'center', marginTop: '-60px' }}>
            <div
              style={{
                width: '120px',
                height: '120px',
                margin: '0 auto',
                borderRadius: '50%',
                border: `4px solid ${theme.bg}`,
                backgroundColor: theme.primary,
                backgroundImage: profile.avatar_url ? `url(${profile.avatar_url})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />

            <h2 style={{ margin: '16px 0 4px', fontWeight: 700 }}>
              {profile.display_name || 'Anonymous User'}
            </h2>

            <p style={{ margin: 0, opacity: 0.7 }}>
              {profile.email}
            </p>
          </div>

          {/* Bio & Actions */}
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            {profile.bio && (
              <p style={{ marginBottom: '24px', lineHeight: 1.6 }}>
                {profile.bio}
              </p>
            )}

            <button
              style={{
                backgroundColor: theme.primary,
                color: 'white',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '6px',
                fontSize: '1rem',
                cursor: 'pointer',
              }}
              onClick={() => navigate(`/chat/${profile.id}`)}
            >
              Message User
            </button>
          </div>
        </div>
      )}
    </main>
  </div>
);
}