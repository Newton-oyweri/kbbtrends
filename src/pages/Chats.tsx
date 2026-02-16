import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase.js";
import Navbar from "../components/Navbar.tsx";
import { useTheme } from "./ThemeContext.tsx";

export default function Chats() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: messages, error } = await supabase
        .from("messages")
        .select("sender_id, receiver_id, content, created_at")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching conversations:", error);
        setLoading(false);
        return;
      }

      const latestMsgs = {};
      messages.forEach((msg) => {
        const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        if (!latestMsgs[partnerId]) {
          latestMsgs[partnerId] = msg;
        }
      });

      const partnerIds = Object.keys(latestMsgs);

      if (partnerIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, display_name, avatar_url, email")
          .in("id", partnerIds);

        const formattedChats = profiles.map(profile => ({
          ...profile,
          lastMsg: latestMsgs[profile.id].content,
          time: latestMsgs[profile.id].created_at
        })).sort((a, b) => new Date(b.time) - new Date(a.time));

        setConversations(formattedChats);
      }
      setLoading(false);
    };

    fetchConversations();
  }, []);

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: "100vh" }}>
      <Navbar />
      
      <main className="container py-4">
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          
          {/* INBOX HEADER CARD */}
          <div 
            className="p-4 rounded-4 mb-3 d-flex justify-content-between align-items-center"
            style={{ 
              backgroundColor: theme.cardBg, 
              border: `1px solid ${theme.primary}20`,
              boxShadow: `0 8px 30px ${theme.glow}10`
            }}
          >
            <div>
                <h2 className="fw-black m-0 uppercase tracking-tighter">Messages</h2>
                <span className="small opacity-50 fw-bold">{conversations.length} Active Conversations</span>
            </div>
            <button 
              className="btn rounded-circle d-flex align-items-center justify-content-center shadow-sm transition-all active:scale-90" 
              style={{ 
                width: '50px', 
                height: '50px', 
                backgroundColor: theme.primary, 
                color: '#fff',
                boxShadow: `0 0 15px ${theme.glow}50`
              }}
            >
               <i className="bi bi-pencil-square fs-5"></i>
            </button>
          </div>

          {/* SEARCH BAR */}
          <div className="mb-4">
              <div className="d-flex align-items-center px-3 py-3 rounded-4" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.primary}15` }}>
                  <i className="bi bi-search opacity-50 me-3" style={{ color: theme.primary }}></i>
                  <input 
                    type="text" 
                    placeholder="Search conversations..." 
                    className="bg-transparent border-0 w-100 shadow-none" 
                    style={{ color: theme.text, fontSize: '1rem', fontWeight: '500' }} 
                  />
              </div>
          </div>

          {/* CONVERSATIONS LIST */}
          <div className="rounded-4 overflow-hidden" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.primary}10` }}>
            {loading ? (
              <div className="py-5 text-center"><div className="spinner-border opacity-50" style={{ color: theme.primary }}></div></div>
            ) : conversations.length === 0 ? (
              <div className="py-5 text-center opacity-50">
                <i className="bi bi-chat-heart fs-1 d-block mb-3" style={{ color: theme.primary }}></i>
                <p className="fw-bold">No vybz found. Start a conversation!</p>
              </div>
            ) : (
              conversations.map((person, index) => (
                <div
                  key={person.id}
                  onClick={() => navigate(`/chat/${person.id}`)}
                  className="d-flex align-items-center p-3 conversation-card"
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    borderBottom: index !== conversations.length - 1 ? `1px solid ${theme.primary}10` : 'none',
                    backgroundColor: 'transparent'
                  }}
                >
                  {/* AVATAR WITH GLOW */}
                  <div className="position-relative">
                      <img 
                          src={person.avatar_url || `https://ui-avatars.com/api/?name=${person.display_name}&background=random`} 
                          alt="avatar" 
                          className="rounded-circle"
                          style={{ 
                            width: "60px", 
                            height: "60px", 
                            objectFit: "cover",
                            border: `2px solid ${theme.primary}30`
                          }}
                      />
                      <div className="position-absolute bottom-0 end-0 bg-success border border-3 rounded-circle" style={{ width: '16px', height: '16px', borderColor: theme.cardBg }}></div>
                  </div>

                  {/* PREVIEW CONTENT */}
                  <div className="ms-3 flex-grow-1 overflow-hidden">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <h6 className="m-0 fw-bold text-truncate" style={{ fontSize: '1.1rem' }}>{person.display_name || "Anonymous"}</h6>
                      <small className="opacity-50 fw-bold" style={{ fontSize: '0.75rem' }}>
                          {new Date(person.time).toLocaleDateString() === new Date().toLocaleDateString() 
                            ? new Date(person.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : new Date(person.time).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </small>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="m-0 text-truncate opacity-75" style={{ fontSize: '0.9rem', maxWidth: '80%' }}>
                          {person.lastMsg}
                      </p>
                      <span className="badge rounded-pill" style={{ backgroundColor: `${theme.primary}20`, color: theme.primary, fontSize: '0.7rem' }}>Vybz</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <style>{`
        .conversation-card:hover {
            background-color: ${theme.primary}08 !important;
            padding-left: 1.5rem !important;
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: ${theme.primary}20; border-radius: 10px; }
      `}</style>
    </div>
  );
}