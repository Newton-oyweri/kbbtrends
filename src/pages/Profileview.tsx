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
        .select("display_name, email, id")
        .eq("id", userId)
        .single();

      if (error) setError("User not found");
      else setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, [userId]);

  return (
    <div className="d-flex h-100 w-100" style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh' }}>
      <Navbar />
      <main className="flex-fill p-4">
        {loading ? <p>Loading...</p> : error ? <div className="alert alert-danger">{error}</div> : (
          <div className="card p-4 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: `1px solid ${theme.primary}30`, color: theme.text }}>
            <h2>{profile.display_name || "Anonymous User"}</h2>
            <p className="text-muted">{profile.email}</p>
            
            <button 
              className="btn btn-primary mt-3"
              onClick={() => navigate(`/chat/${profile.id}`)}
            >
              Message this User
            </button>
          </div>
        )}
      </main>
    </div>
  );
}