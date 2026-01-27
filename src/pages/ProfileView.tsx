import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase"; 
import Navbar from "../components/Navbar";

export default function ProfileView() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const cleanUsername = decodeURIComponent(username || "");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("profiles")
        .select("display_name, username")
        .eq("username", cleanUsername)
        .single();
      if (data) setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, [cleanUsername]);

  return (
    <main className="min-vh-100 pb-5" style={{ backgroundColor: "#0a0e17", color: "#e0e0e0", fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      <Navbar />
      
      <div className="container-fluid mt-5 pt-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-info"></div>
          </div>
        ) : profile ? (
          <div className="row g-4 px-md-4">
            
            {/* Left Sidebar Info */}
            <div className="col-lg-4 col-xl-3">
              <div className="card border-0 shadow-lg overflow-hidden" style={{ backgroundColor: "#161d2b", borderLeft: "4px solid #00d4ff" }}>
                <div className="card-body p-4">
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="flex-shrink-0 bg-primary text-white d-flex align-items-center justify-content-center fw-bold shadow" 
                         style={{ 
                           width: "65px", 
                           height: "65px", 
                           fontSize: "1.8rem", 
                           borderRadius: "8px",
                           background: "linear-gradient(135deg, #0052ff 0%, #00d4ff 100%)",
                           boxShadow: "0 0 15px rgba(0, 212, 255, 0.4)"
                         }}>
                      {(profile.display_name || "U")[0].toUpperCase()}
                    </div>
                    
                    {/* Overflow Protection for Names */}
                    <div className="overflow-hidden">
                      <h4 className="mb-0 fw-bold text-white text-truncate" title={profile.display_name}>
                        {profile.display_name}
                      </h4>
                      <p className="text-info mb-0 small fw-bold text-truncate">
                        @{profile.username}
                      </p>
                    </div>
                  </div>

                  <div className="d-grid gap-2">
                    <div className="p-2 rounded bg-dark bg-opacity-50 border border-secondary small d-flex justify-content-between align-items-center">
                      <span className="text-secondary text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>Status</span>
                      <span className="text-success fw-bold small">...</span>
                    </div>
                    <div className="p-2 rounded bg-dark bg-opacity-50 border border-secondary small d-flex justify-content-between align-items-center">
                      <span className="text-secondary text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>Rank</span>
                      <span className="text-warning fw-bold small">...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Main Content Section */}
            <div className="col-lg-8 col-xl-9">
              <div className="p-4 rounded shadow-sm h-100 overflow-hidden" style={{ backgroundColor: "#161d2b", border: "1px solid rgba(255,255,255,0.05)" }}>
                <h5 className="text-uppercase fw-black mb-4 pb-2 border-bottom border-secondary" style={{ letterSpacing: "2px", color: "#00d4ff" }}>
                  Player Statistics
                </h5>

                coming soon ...
              </div>
            </div>

          </div>
        ) : (
          <div className="container py-5 text-center">
            <div className="alert alert-danger d-inline-block bg-danger text-white border-0 px-5">
              User "@{cleanUsername}" not found.
            </div>
          </div>
        )}
      </div>
    </main>
  );
}