import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase.js";
import Navbar from "../components/Navbar.tsx";
import { useTheme } from "./ThemeContext.tsx";

export default function Chat() {
  const { receiverId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [receiverProfile, setReceiverProfile] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const messagesEndRef = useRef(null);
  const pollingRef = useRef(null);

  // Wrapped in useCallback to satisfy dependency warnings
  const fetchMessages = useCallback(async (userId) => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${userId})`)
      .order("created_at", { ascending: true });

    if (data) {
      setMessages((prev) => (prev.length !== data.length ? data : prev));
    }
  }, [receiverId]);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }
      setCurrentUser(user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", receiverId)
        .single();
      setReceiverProfile(profile);
      
      await fetchMessages(user.id);
      setIsInitialLoading(false);
    };

    init();

    pollingRef.current = setInterval(() => {
      // Use a functional check or a stable ID here
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) fetchMessages(user.id);
      });
    }, 3000);

    return () => clearInterval(pollingRef.current);
  }, [receiverId, navigate, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const content = newMessage.trim();
    setNewMessage(""); 

    // Optimistic UI update
    const tempMsg = {
      id: `temp-${Date.now()}`,
      content: content,
      sender_id: currentUser.id,
      created_at: new Date().toISOString(),
      sending: true 
    };
    setMessages((prev) => [...prev, tempMsg]);

    const { error } = await supabase.from("messages").insert([{
      content,
      sender_id: currentUser.id,
      receiver_id: receiverId,
    }]);

    if (!error) fetchMessages(currentUser.id);
  };

  return (
    <div className="d-flex vh-100 overflow-hidden" style={{ backgroundColor: theme.bg, color: theme.text, fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      
      <main className="flex-grow-1 d-flex flex-column position-relative shadow-lg" 
            style={{ 
              height: "100vh", 
             
              margin: "0 auto", 
              backgroundColor: theme.bg,
              borderLeft: `1px solid ${theme.primary}15`,
              borderRight: `1px solid ${theme.primary}15`
            }}>
        
        {/* NATIVE HEADER */}
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom" 
             style={{ 
               zIndex: 10, 
               background: theme.bg, 
               backdropFilter: "blur(10px)",
               borderColor: `${theme.primary}20 !important`
             }}>
          <div className="d-flex align-items-center">
            <button onClick={() => navigate(-1)} className="btn btn-link p-0 me-3" style={{ color: theme.text }}>
              <i className="bi bi-arrow-left fs-4"></i>
            </button>
            <img 
              src={receiverProfile?.avatar_url || `https://ui-avatars.com/api/?name=${receiverProfile?.display_name}`} 
              alt="avatar"
              className="rounded-circle me-3" 
              style={{ width: "40px", height: "40px", border: `1px solid ${theme.primary}30` }} 
            />
            <div>
              <h6 className="m-0 fw-bold">{receiverProfile?.display_name || "Chat Partner"}</h6>
              <small style={{ fontSize: '0.7rem', color: theme.primary }}>
                {isInitialLoading ? "Connecting..." : "Active now"}
              </small>
            </div>
          </div>
          <i className="bi bi-info-circle fs-5 opacity-50"></i>
        </div>

        {/* MESSAGES AREA */}
        <div className="flex-grow-1 overflow-auto p-4 d-flex flex-column" 
             style={{ backgroundColor: `${theme.primary}05` }}>
          {messages.map((msg) => {
            const isMe = msg.sender_id === currentUser?.id;
            return (
              <div key={msg.id} className={`d-flex mb-2 ${isMe ? "justify-content-end" : "justify-content-start"}`}>
                <div 
                  className="p-2 px-3 shadow-sm" 
                  style={{ 
                    maxWidth: '75%', 
                    borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    fontSize: '0.92rem',
                    backgroundColor: isMe ? theme.primary : (theme.bg === '#fff' ? '#fff' : '#2d2d2d'),
                    color: isMe ? '#fff' : theme.text,
                    border: isMe ? 'none' : `1px solid ${theme.primary}15`
                  }}
                >
                  {msg.content}
                  <div className="d-flex align-items-center justify-content-end mt-1" style={{ fontSize: "0.6rem", opacity: 0.6 }}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {isMe && (
                      <i className={`bi bi-check2-all ms-1 ${msg.sending ? "opacity-30" : "text-light"}`}></i>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT AREA */}
        <div className="p-3 border-top" style={{ backgroundColor: theme.bg, borderColor: `${theme.primary}20 !important` }}>
          <form onSubmit={sendMessage} 
                className="d-flex align-items-center rounded-pill px-3 py-1"
                style={{ backgroundColor: `${theme.primary}10` }}>
            <input 
              type="text" 
              className="form-control border-0 bg-transparent shadow-none"
              style={{ color: theme.text }}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Message..."
            />
            <button type="submit" className="btn btn-link p-0" style={{ color: theme.primary }} disabled={!newMessage.trim()}>
              <i className="bi bi-send-fill fs-4"></i>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}