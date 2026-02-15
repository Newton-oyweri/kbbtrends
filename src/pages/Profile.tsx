import React, { useEffect, useState, FormEvent } from "react";
import Navbar from "../components/Navbar.tsx";
import { useTheme } from "./ThemeContext.tsx";
import { supabase } from "../supabase";

export default function Profile() {
  const { theme } = useTheme();

  // Basic Info
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  // Avatar & Cover State
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverLoading, setCoverLoading] = useState(false);

  // Post State
  const [postContent, setPostContent] = useState("");
  const [postFile, setPostFile] = useState<File | null>(null);
  const [postPreview, setPostPreview] = useState<string | null>(null);
  const [postLoading, setPostLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("display_name, avatar_url, cover_url, bio")
        .eq("id", user.id)
        .single();

      if (data) {
        setDisplayName(data.display_name || "");
        setBio(data.bio || "");
        setAvatarUrl(data.avatar_url || null);
        setCoverUrl(data.cover_url || null);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName, bio: bio })
      .eq("id", user.id);

    setProfileLoading(false);
    alert(error ? "Error: " + error.message : "Profile details updated!");
  };

  const handleUploadAvatar = async (file: File) => {
    setAvatarLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const filePath = `${user.id}/avatar-${Date.now()}.${file.name.split(".").pop()}`;
    const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file);

    if (!uploadError) {
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
      await supabase.from("profiles").update({ avatar_url: urlData.publicUrl }).eq("id", user.id);
      setAvatarUrl(urlData.publicUrl);
      setAvatarPreview(null);
    }
    setAvatarLoading(false);
  };

  const handleUploadCover = async (file: File) => {
    setCoverLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const filePath = `${user.id}/cover-${Date.now()}.${file.name.split(".").pop()}`;
    const { error: uploadError } = await supabase.storage.from("covers").upload(filePath, file);

    if (!uploadError) {
      const { data: urlData } = supabase.storage.from("covers").getPublicUrl(filePath);
      await supabase.from("profiles").update({ cover_url: urlData.publicUrl }).eq("id", user.id);
      setCoverUrl(urlData.publicUrl);
      setCoverPreview(null);
    }
    setCoverLoading(false);
  };

  const handleCreatePost = async (e: FormEvent) => {
    e.preventDefault();
    setPostLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setPostLoading(false); return; }

    let imageUrl = null;
    if (postFile) {
      const filePath = `posts/${user.id}/${Date.now()}`;
      const { error: uploadError } = await supabase.storage.from("post-images").upload(filePath, postFile);
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from("post-images").getPublicUrl(filePath);
        imageUrl = urlData.publicUrl;
      }
    }

    const { error: insertError } = await supabase.from("posts").insert([{
      content: postContent,
      user_id: user.id,
      image_url: imageUrl
    }]);

    if (!insertError) {
      setPostContent("");
      setPostFile(null);
      setPostPreview(null);
      alert("Posted!");
    }
    setPostLoading(false);
  };

  return (
    <div style={{ display: "flex", backgroundColor: theme.bg, color: theme.text, minHeight: "100vh" }}>
      <Navbar />

      <main style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 className="mb-4 fw-bold">Edit Profile</h2>

          <div style={{ position: "relative", marginBottom: "80px" }}>
            {/* Cover Section */}
            <div
              style={{
                width: "100%", aspectRatio: "16 / 6",
                backgroundImage: `url(${coverPreview || coverUrl || ""})`,
                backgroundColor: `${theme.primary}20`, backgroundSize: "cover", backgroundPosition: "center",
                borderRadius: "20px", border: `1px solid ${theme.primary}30`,
                position: "relative", overflow: "hidden"
              }}
            >
              <label style={{
                position: "absolute", bottom: "10px", right: "10px",
                backgroundColor: "rgba(0,0,0,0.6)", color: "white", padding: "8px 15px",
                borderRadius: "20px", cursor: "pointer", fontSize: "0.8rem"
              }}>
                <i className="bi bi-camera-fill me-2"></i> {coverLoading ? "Uploading..." : "Change Cover"}
                <input type="file" hidden accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setCoverPreview(URL.createObjectURL(file));
                    handleUploadCover(file);
                  }
                }} />
              </label>
            </div>

            {/* Avatar Section */}
            <div style={{ position: "absolute", bottom: "-60px", left: "20px", zIndex: 10, width: "130px", height: "130px" }}>
              <img
                src={avatarPreview || avatarUrl || `https://ui-avatars.com/api/?name=${displayName}`}
                alt="Profile Avatar"
                style={{
                  width: "100%", height: "100%", borderRadius: "50%",
                  border: `6px solid ${theme.bg}`, objectFit: "cover", backgroundColor: theme.bg
                }}
              />
              <label style={{
                position: "absolute", bottom: "5px", right: "5px",
                backgroundColor: theme.primary, color: "white", width: "35px", height: "35px",
                borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", border: `3px solid ${theme.bg}`
              }}>
                <i className="bi bi-pencil-fill" style={{ fontSize: "0.8rem" }}></i>
                <input type="file" hidden accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setAvatarPreview(URL.createObjectURL(file));
                    handleUploadAvatar(file);
                  }
                }} />
              </label>
            </div>
          </div>

          <div style={{ padding: "0 10px" }}>
            <form onSubmit={handleUpdateProfile} className="mt-4">
              <div className="mb-4">
                <label className="fw-bold small mb-1 opacity-75">Display Name</label>
                <input 
                  type="text" className="form-control form-control-lg" 
                  style={{ backgroundColor: `${theme.primary}05`, color: theme.text, border: `1px solid ${theme.primary}20` }}
                  value={displayName} onChange={(e) => setDisplayName(e.target.value)} 
                />
              </div>

              <div className="mb-4">
                <label className="fw-bold small mb-1 opacity-75">Bio</label>
                <textarea 
                  className="form-control" 
                  style={{ backgroundColor: `${theme.primary}05`, color: theme.text, border: `1px solid ${theme.primary}20` }}
                  rows={4} value={bio} onChange={(e) => setBio(e.target.value)} 
                  placeholder="Tell the world who you are..."
                />
              </div>

              <button type="submit" disabled={profileLoading || avatarLoading || coverLoading} className="btn btn-primary px-5 py-2 fw-bold" style={{ borderRadius: "50px" }}>
                {profileLoading ? "Saving Changes..." : "Save Profile"}
              </button>
            </form>

            <hr style={{ margin: "40px 0", opacity: 0.1 }} />

            <section className="mb-5">
              <h4 className="fw-bold mb-3">Create a Post</h4>
              <div className="p-4 rounded-4" style={{ backgroundColor: `${theme.primary}05`, border: `1px solid ${theme.primary}10` }}>
                <textarea 
                  className="form-control border-0 bg-transparent shadow-none mb-3" 
                  value={postContent} onChange={(e) => setPostContent(e.target.value)}
                  placeholder="What's happening?" rows={3} style={{ color: theme.text, fontSize: "1.1rem" }}
                />
                {postPreview && <img src={postPreview} alt="Post preview" className="img-fluid rounded-3 mb-3" style={{ maxHeight: "300px" }} />}
                <div className="d-flex justify-content-between align-items-center">
                  <label className="btn btn-outline-primary btn-sm rounded-pill">
                    <i className="bi bi-image me-2"></i> Add Image
                    <input type="file" hidden accept="image/*" onChange={(e) => {
                       const file = e.target.files?.[0];
                       if(file) {
                         setPostFile(file);
                         setPostPreview(URL.createObjectURL(file));
                       }
                    }} />
                  </label>
                  <button onClick={handleCreatePost} disabled={postLoading || (!postContent.trim() && !postFile)} className="btn btn-primary rounded-pill px-4">
                    {postLoading ? "Posting..." : "Post"}
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}