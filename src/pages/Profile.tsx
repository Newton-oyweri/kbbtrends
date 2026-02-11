import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import Navbar from "../components/Navbar.tsx";
import { useTheme } from "./ThemeContext.tsx";
import { supabase } from "../supabase";

export default function Profile() {
  const { theme } = useTheme();

  const [displayName, setDisplayName] = useState("");
  const [postContent, setPostContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // optional nice-to-have
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", user.id)
          .single();
        if (data) setDisplayName(data.display_name || "");
      }
    };
    getProfile();
  }, []);

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName })
      .eq("id", user.id);

    alert(error ? "Update failed" : "Profile updated!");
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: validate it's an image
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setSelectedFile(file);

    // Optional: show preview
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCreatePost = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in");
      setLoading(false);
      return;
    }

    let imageUrl: string | null = null;

    // 1. Upload image if selected
    if (selectedFile) {
      const fileExt = selectedFile.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `posts/${user.id}/${fileName}`; // organized path

      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(filePath, selectedFile, {
          cacheControl: "3600", // 1 hour cache
          upsert: false,        // don't overwrite if exists (rare)
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        alert("Failed to upload image: " + uploadError.message);
        setLoading(false);
        return;
      }

      // 2. Get public URL (since bucket is public)
      const { data: urlData } = supabase.storage
        .from("post-images")
        .getPublicUrl(filePath);

      imageUrl = urlData.publicUrl;

      if (!imageUrl) {
        alert("Could not get public URL");
        setLoading(false);
        return;
      }
    }

    // 3. Create the post (with or without image)
    const { error: insertError } = await supabase
      .from("posts")
      .insert([
        {
          content: postContent.trim() || null, // allow text-only or image-only posts
          user_id: user.id,
          image_url: imageUrl,
        },
      ]);

    if (insertError) {
      console.error("Post insert error:", insertError);
      alert("Failed to create post: " + insertError.message);
    } else {
      setPostContent("");
      setSelectedFile(null);
      setPreviewUrl(null);
      alert("Posted successfully!");
    }

    setLoading(false);
  };

  return (
    <div style={{ display: "flex", backgroundColor: theme.bg, color: theme.text, minHeight: "100vh" }}>
      <Navbar />

      <main style={{ flex: 1, padding: "20px" }}>
        {/* Profile Edit Section */}
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
            <button type="submit" className="btn btn-secondary">Save Name</button>
          </form>
        </section>

        <hr />

        {/* Post Creation Section */}
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

            {/* Image upload input */}
            <div className="mb-3">
              <label htmlFor="postImage" className="form-label">
                Add an image (optional)
              </label>
              <input
                type="file"
                className="form-control"
                id="postImage"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            {/* Optional live preview */}
            {previewUrl && (
              <div className="mb-3">
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ maxWidth: "280px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
                />
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || (!postContent.trim() && !selectedFile)}
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}