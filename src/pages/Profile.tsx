import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import Navbar from "../components/Navbar.tsx";
import { useTheme } from "./ThemeContext.tsx";
import { supabase } from "../supabase";

export default function Profile() {
  const { theme } = useTheme();

  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const [postContent, setPostContent] = useState("");
  const [postFile, setPostFile] = useState<File | null>(null);
  const [postPreview, setPostPreview] = useState<string | null>(null);
  const [postLoading, setPostLoading] = useState(false);

  // Fetch profile data (name + avatar)
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Profile fetch error:", error);
      } else if (data) {
        setDisplayName(data.display_name || "");
        setAvatarUrl(data.avatar_url || null);
      }
    };
    fetchProfile();
  }, []);

  // Handle profile name update
  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName })
      .eq("id", user.id);

    alert(error ? "Update failed: " + error.message : "Profile updated!");
  };

  // Handle avatar file selection + preview
  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Upload avatar + update profile
  const handleUploadAvatar = async () => {
    if (!avatarFile) return;
    setAvatarLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in");
      setAvatarLoading(false);
      return;
    }

    const fileExt = avatarFile.name.split(".").pop() || "jpg";
    const fileName = `avatar.${fileExt}`; // fixed name → overwrites old one
    const filePath = `${user.id}/${fileName}`;

    // Upload (upsert: true → replaces if exists)
    const { error: uploadError } = await supabase.storage
      .from("avatars") // ← create this bucket in Supabase dashboard if not exists
      .upload(filePath, avatarFile, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      alert("Avatar upload failed: " + uploadError.message);
      setAvatarLoading(false);
      return;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;
    if (!publicUrl) {
      alert("Could not get avatar URL");
      setAvatarLoading(false);
      return;
    }

    // Save URL to profiles table
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id);

    if (updateError) {
      alert("Failed to save avatar URL: " + updateError.message);
    } else {
      setAvatarUrl(publicUrl);
      setAvatarFile(null);
      setAvatarPreview(null);
      alert("Profile picture updated!");
    }

    setAvatarLoading(false);
  };

  // Existing post creation (kept mostly unchanged, renamed vars for clarity)
  const handlePostFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setPostFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPostPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCreatePost = async (e: FormEvent) => {
    e.preventDefault();
    setPostLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in");
      setPostLoading(false);
      return;
    }

    let imageUrl: string | null = null;

    if (postFile) {
      const fileExt = postFile.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `posts/${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(filePath, postFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        alert("Image upload failed: " + uploadError.message);
        setPostLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("post-images")
        .getPublicUrl(filePath);

      imageUrl = urlData.publicUrl;
    }

    const { error: insertError } = await supabase
      .from("posts")
      .insert([
        {
          content: postContent.trim() || null,
          user_id: user.id,
          image_url: imageUrl,
        },
      ]);

    if (insertError) {
      alert("Failed to create post: " + insertError.message);
    } else {
      setPostContent("");
      setPostFile(null);
      setPostPreview(null);
      alert("Posted successfully!");
    }

    setPostLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: theme.bg,
        color: theme.text,
        minHeight: "100vh",
      }}
    >
      <Navbar />

      <main style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        {/* Profile Picture Upload */}
        <section style={{ marginBottom: "40px", textAlign: "center" }}>
          <h3>Profile Picture</h3>

          {avatarUrl || avatarPreview ? (
            <img
              src={avatarPreview || avatarUrl || ""}
              alt="Profile"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                border: `3px solid ${theme.primary || "#00d4ff"}`,
                marginBottom: "16px",
              }}
            />
          ) : (
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                backgroundColor: "#333",
                margin: "0 auto 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
              }}
            >
              ?
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: "block", margin: "0 auto 12px" }}
          />

          <button
            onClick={handleUploadAvatar}
            disabled={avatarLoading || !avatarFile}
            style={{
              backgroundColor: theme.primary || "#00d4ff",
              color: "white",
              border: "none",
              padding: "8px 20px",
              borderRadius: "6px",
              cursor: avatarFile ? "pointer" : "not-allowed",
              opacity: avatarFile ? 1 : 0.6,
            }}
          >
            {avatarLoading ? "Uploading..." : "Upload Profile Picture"}
          </button>
        </section>

        <hr style={{ margin: "40px 0" }} />

        {/* Edit Display Name */}
        <section style={{ marginBottom: "40px" }}>
          <h3>Edit Profile</h3>
          <form onSubmit={handleUpdateProfile}>
            <input
              type="text"
              className="form-control mb-2"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Display Name"
            />
            <button type="submit" className="btn btn-secondary">
              Save Name
            </button>
          </form>
        </section>

        <hr style={{ margin: "40px 0" }} />

        {/* Create Post */}
        <section>
          <h3>Create New Post</h3>
          <form onSubmit={handleCreatePost}>
            <textarea
              className="form-control mb-3"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What's on your mind?"
              rows={3}
            />

            <div className="mb-3">
              <label htmlFor="postImage" className="form-label">
                Add an image (optional)
              </label>
              <input
                type="file"
                className="form-control"
                id="postImage"
                accept="image/*"
                onChange={handlePostFileChange}
              />
            </div>

            {postPreview && (
              <div className="mb-3 text-center">
                <img
                  src={postPreview}
                  alt="Post Preview"
                  style={{ maxWidth: "280px", borderRadius: "8px" }}
                />
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={postLoading || (!postContent.trim() && !postFile)}
            >
              {postLoading ? "Posting..." : "Post"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}