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

  // Common input style to ensure visibility across themes
  const inputStyle = {
    backgroundColor: `${theme.primary}10`,
    color: theme.text,
    borderRadius: "12px",
    border: `1px solid ${theme.primary}20`,
    padding: "12px 15px"
  };

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: "100vh" }}>
      <Navbar />

      <main className="container py-4">
        <div style={{ maxWidth: "850px", margin: "0 auto" }}>
          
          {/* PROFILE EDIT CARD */}
          <div 
            className="p-4 rounded-4 mb-4" 
            style={{ 
                backgroundColor: theme.cardBg, 
                border: `1px solid ${theme.primary}20`,
                boxShadow: `0 10px 30px ${theme.glow}10`
            }}
          >
            <h2 className="mb-4 fw-black uppercase tracking-tighter" style={{ color: theme.text }}>Edit Profile</h2>

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
                  position: "absolute", bottom: "15px", right: "15px",
                  backgroundColor: "rgba(0,0,0,0.7)", color: "white", padding: "8px 18px",
                  borderRadius: "50px", cursor: "pointer", fontSize: "0.75rem", fontWeight: "bold",
                  backdropFilter: "blur(5px)", border: "1px solid rgba(255,255,255,0.2)"
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
              <div style={{ position: "absolute", bottom: "-60px", left: "30px", zIndex: 10, width: "130px", height: "130px" }}>
                <img
                  src={avatarPreview || avatarUrl || `https://ui-avatars.com/api/?name=${displayName}`}
                  alt="Profile"
                  style={{
                    width: "100%", height: "100%", borderRadius: "50%",
                    border: `6px solid ${theme.cardBg}`, objectFit: "cover", backgroundColor: theme.bg
                  }}
                />
                <label style={{
                  position: "absolute", bottom: "5px", right: "5px",
                  backgroundColor: theme.primary, color: "white", width: "38px", height: "38px",
                  borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", border: `4px solid ${theme.cardBg}`, boxShadow: `0 0 10px ${theme.glow}50`
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

            <form onSubmit={handleUpdateProfile} className="px-2">
              <div className="row">
                <div className="col-md-6 mb-4">
                  <label className="fw-bold small mb-2 uppercase tracking-wider" style={{ color: theme.text, opacity: 0.7 }}>Display Name</label>
                  <input 
                    type="text" 
                    className="form-control border-0 shadow-none" 
                    style={inputStyle}
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)} 
                  />
                </div>
                <div className="col-12 mb-4">
                  <label className="fw-bold small mb-2 uppercase tracking-wider" style={{ color: theme.text, opacity: 0.7 }}>Bio</label>
                  <textarea 
                    className="form-control border-0 shadow-none" 
                    style={inputStyle}
                    rows={3} 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)} 
                    placeholder="Tell the world who you are..."
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={profileLoading || avatarLoading || coverLoading} 
                className="btn px-5 py-2 fw-bold transition-all active:scale-95 border-0" 
                style={{ 
                    borderRadius: "50px", 
                    backgroundColor: theme.primary, 
                    color: "#fff",
                    boxShadow: `0 5px 15px ${theme.glow}40`
                }}
              >
                {profileLoading ? "Saving..." : "Update Profile"}
              </button>
            </form>
          </div>

          {/* CREATE POST CARD */}
          <div 
            className="p-4 rounded-4" 
            style={{ 
                backgroundColor: theme.cardBg, 
                border: `1px solid ${theme.primary}20`,
                boxShadow: `0 10px 30px ${theme.glow}05`
            }}
          >
            <h4 className="fw-black uppercase tracking-tight mb-4" style={{ color: theme.text, opacity: 0.8, fontSize: '1rem' }}>Create a Post</h4>
            <div className="p-1">
              <textarea 
                className="form-control border-0 bg-transparent shadow-none mb-3" 
                value={postContent} 
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What's on your mind?" 
                rows={3} 
                style={{ color: theme.text, fontSize: "1.2rem", fontWeight: "500" }}
              />
              
              {postPreview && (
                <div className="position-relative mb-3">
                    <img src={postPreview} alt="Post preview" className="img-fluid rounded-4 w-100" style={{ maxHeight: "400px", objectFit: "cover" }} />
                    <button 
                        className="btn btn-dark btn-sm position-absolute top-0 end-0 m-2 rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '30px', height: '30px', opacity: 0.8 }}
                        onClick={() => {setPostFile(null); setPostPreview(null);}}
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
              )}

              <div className="d-flex justify-content-between align-items-center pt-3 border-top" style={{ borderColor: `${theme.primary}20` }}>
                <label className="btn border-0 rounded-pill px-3 d-flex align-items-center" style={{ color: theme.primary, backgroundColor: `${theme.primary}15`, fontWeight: '600' }}>
                  <i className="bi bi-image-fill me-2"></i> Photo
                  <input type="file" hidden accept="image/*" onChange={(e) => {
                     const file = e.target.files?.[0];
                     if(file) {
                       setPostFile(file);
                       setPostPreview(URL.createObjectURL(file));
                     }
                  }} />
                </label>
                <button 
                  onClick={handleCreatePost} 
                  disabled={postLoading || (!postContent.trim() && !postFile)} 
                  className="btn px-4 fw-bold rounded-pill border-0"
                  style={{ backgroundColor: theme.primary, color: "#fff", boxShadow: `0 4px 12px ${theme.glow}30` }}
                >
                  {postLoading ? "Posting..." : "Post Vybz"}
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}