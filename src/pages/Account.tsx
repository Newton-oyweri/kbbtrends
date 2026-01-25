"use client";

import { useEffect, useState } from "react";
import { supabase } from "../supabase"; // adjust path
import Navbar from "../components/Navbar"; // adjust path

export default function ProfilePage() {
  const [profile, setProfile] = useState<{ username: string | null; display_name: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Controlled form fields — start empty, fill them once profile loads
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  
  // Track whether save is in progress
  const [saving, setSaving] = useState(false);

  // Load profile + fill form fields
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          setError("Please log in to view your profile.");
          return;
        }

        const { data, error: profileError } = await supabase
          .from("profiles")
          .select("username, display_name")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        setProfile(data);
        
        // ← Important: fill the form with existing values
        setUsername(data?.username || "");
        setDisplayName(data?.display_name || "");

      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in to save.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username: username.trim() || null,           // allow clearing
          display_name: displayName.trim() || null,
        })
        .eq("id", user.id);

      if (error) throw error;

      // Update local state so displayed profile reflects changes immediately
      setProfile((prev) => ({
        ...prev,
        username: username.trim() || null,
        display_name: displayName.trim() || null,
      }));

      alert("Profile updated successfully!"); // ← replace with toast in real app

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mt-5">
      <Navbar />

      <div className="container py-5">
        <h1 className="mb-4">Your Profile</h1>

        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading your profile...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <>
            {/* Edit Form */}
            <div className="card p-4 mb-5 shadow-sm">
              <h4 className="card-title mb-4">Update Profile</h4>

              <div className="mb-3">
                <label className="form-label">Display Name</label>
                <input
                  className="form-control"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Isack M"
                  disabled={saving}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Username</label>
                <div className="input-group">
                  <span className="input-group-text">@</span>
                  <input
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="yourusername"
                    disabled={saving}
                  />
                </div>
                <div className="form-text">
                  Used for profile links, mentions, etc.
                </div>
              </div>

              {error && <div className="alert alert-danger mt-3">{error}</div>}

              <button
                className="btn btn-primary"
                onClick={handleSaveProfile}
                disabled={saving || loading}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>

            {/* Current Profile Preview */}
            <div className="card shadow-sm">
              <div className="card-body">
                <h2 className="card-title">
                  {profile?.display_name || "Hello!"}
                </h2>
                <p className="card-text fs-5">
                  <strong>Username:</strong>{" "}
                  {profile?.username ? `@${profile.username}` : "not set"}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}