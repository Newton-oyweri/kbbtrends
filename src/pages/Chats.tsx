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

      // 1. Fetch messages with content to show snippets
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

      // 2. Group by partner and keep ONLY the latest message
      const latestMsgs = {};
      messages.forEach((msg) => {
        const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        if (!latestMsgs[partnerId]) {
          latestMsgs[partnerId] = msg;
        }
      });

      const partnerIds = Object.keys(latestMsgs);

      if (partnerIds.length > 0) {
        // 3. Fetch full profiles for these partners
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, display_name, avatar_url, email")
          .in("id", partnerIds);

        // Merge profile info with their last message
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
    <div className="d-flex vh-100 overflow-hidden" style={{ backgroundColor: theme.bg, color: theme.text }}>
      <Navbar />
      
      <main className="flex-grow-1 d-flex flex-column" style={{  margin: "0 auto", width: "100%", borderLeft: `1px solid ${theme.primary}15`, borderRight: `1px solid ${theme.primary}15` }}>
        
        {/* HEADER */}
        <div className="p-4 d-flex justify-content-between align-items-center">
          <h2 className="fw-bold m-0">Messages</h2>
          <button className="btn btn-primary rounded-circle shadow-sm" style={{ width: '45px', height: '45px' }}>
             <i className="bi bi-pencil-square"></i>
          </button>
        </div>

        {/* SEARCH BAR (Visual only for now) */}
        <div className="px-4 mb-3">
            <div className="d-flex align-items-center px-3 py-2 rounded-3" style={{ backgroundColor: `${theme.primary}10` }}>
                <i className="bi bi-search opacity-50 me-2"></i>
                <input type="text" placeholder="Search chats..." className="bg-transparent border-0 w-100 shadow-none" style={{ color: theme.text, fontSize: '0.9rem' }} />
            </div>
        </div>

        {/* CONVERSATIONS LIST */}
        <div className="flex-grow-1 overflow-auto px-2">
          {loading ? (
            <div className="text-center mt-5"><div className="spinner-border spinner-border-sm opacity-50"></div></div>
          ) : conversations.length === 0 ? (
            <div className="text-center mt-5 opacity-50">
              <i className="bi bi-chat-dots fs-1 d-block mb-3"></i>
              <p>No conversations yet.</p>
            </div>
          ) : (
            conversations.map((person) => (
              <div
                key={person.id}
                onClick={() => navigate(`/chat/${person.id}`)}
                className="d-flex align-items-center p-3 mb-1 conversation-card"
                style={{
                  cursor: 'pointer',
                  borderRadius: "16px",
                  transition: 'all 0.2s ease',
                  borderBottom: `1px solid ${theme.primary}05`
                }}
              >
                {/* AVATAR WITH STATUS */}
                <div className="position-relative">
                    <img 
                        src={person.avatar_url || `https://ui-avatars.com/api/?name=${person.display_name}&background=random`} 
                        alt="avatar" 
                        className="rounded-circle"
                        style={{ width: "55px", height: "55px", objectFit: "cover" }}
                    />
                    <div className="position-absolute bottom-0 end-0 bg-success border border-2 border-white rounded-circle" style={{ width: '14px', height: '14px' }}></div>
                </div>

                {/* CONTENT */}
                <div className="ms-3 flex-grow-1 overflow-hidden">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="m-0 fw-bold text-truncate" style={{ maxWidth: '180px' }}>{person.display_name || "Anonymous"}</h6>
                    <small className="opacity-50" style={{ fontSize: '0.7rem' }}>
                        {new Date(person.time).toLocaleDateString() === new Date().toLocaleDateString() 
                          ? new Date(person.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : new Date(person.time).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </small>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-1">
                    <p className="m-0 text-truncate opacity-75" style={{ fontSize: '0.85rem', maxWidth: '240px' }}>
                        {person.lastMsg}
                    </p>
                    {/* Placeholder for unread count bubble */}
                    <span className="badge rounded-pill bg-primary" style={{ fontSize: '0.6rem' }}>New</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <style>{`
        .conversation-card:hover {
            background-color: ${theme.primary}15 !important;
            transform: scale(0.99);
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${theme.primary}30; border-radius: 10px; }
      `}</style>
    </div>
  );
}