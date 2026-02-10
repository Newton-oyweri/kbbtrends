import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.tsx";
import { useTheme } from "./ThemeContext.tsx";
import { supabase } from "../supabase";

type ProfileData = {
  display_name: string | null;
  email: string;
};

export default function ProfileView() {
  const { theme } = useTheme();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, email")
        .eq("id", user.id)
        .single();

      if (error) {
        setError("Failed to load profile");
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  return (
    <div
      className="d-flex h-100 w-100"
      style={{ backgroundColor: theme.bg, fontFamily: theme.font, color: theme.text }}
    >
      <Navbar />

      <main className="flex-fill overflow-auto">
        <div className="container py-4">
          <h1 className="mb-4">My Profile</h1>

          {loading && <p>Loading profile...</p>}

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {!loading && profile && (
            <div className="card shadow-sm">
              <div className="card-body">
                <h4 className="card-title mb-3">
                  {profile.display_name || "No display name"}
                </h4>

                <p className="card-text">
                  <strong>Email:</strong> {profile.email}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
