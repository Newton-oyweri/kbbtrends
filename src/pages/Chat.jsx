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
  const [viewportHeight, setViewportHeight] = useState('calc(100vh - 80px)');

  const messagesEndRef = useRef(null);
  const pollingRef = useRef(null);

  // 1. Fetch Logic
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

  // 2. Initialization & Keyboard Fix
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/login"); return; }
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

    // Visual Viewport Handling for Mobile Keyboard
    const handleResize = () => {
      if (window.visualViewport) {
        setViewportHeight(`${window.visualViewport.height - 80}px`);
      }
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    
    pollingRef.current = setInterval(() => {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) fetchMessages(user.id);
      });
    }, 3000);

    return () => {
      clearInterval(pollingRef.current);
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, [receiverId, navigate, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. Send Message Logic
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const content = newMessage.trim();
    setNewMessage(""); 

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
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: "100vh", overflow: "hidden" }}>
      <Navbar />
      
      <main 
        className="container-fluid d-flex flex-column p-0" 
        style={{ 
          height: viewportHeight,
          maxWidth: "900px", 
          margin: "0 auto",
          backgroundColor: theme.cardBg,
          borderLeft: `1px solid ${theme.primary}15`,
          borderRight: `1px solid ${theme.primary}15`,
          position: "relative",
          transition: "height 0.1s ease-out"
        }}
      >
        {/* HEADER */}
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom flex-shrink-0" 
             style={{ background: theme.cardBg, borderColor: `${theme.primary}20`, zIndex: 5 }}>
          <div className="d-flex align-items-center">
            <button onClick={() => navigate(-1)} className="btn border-0 p-0 me-3" style={{ color: theme.text }}>
              <i className="bi bi-chevron-left fs-4"></i>
            </button>
            <img 
              src={receiverProfile?.avatar_url || `https://ui-avatars.com/api/?name=${receiverProfile?.display_name}`} 
              alt="avatar"
              className="rounded-circle me-3" 
              style={{ width: "40px", height: "40px", border: `1px solid ${theme.primary}30`, objectFit: "cover" }} 
            />
            <div>
              <h6 className="m-0 fw-bold uppercase tracking-tight">{receiverProfile?.display_name || "Vybz User"}</h6>
              <small className="fw-bold" style={{ fontSize: '0.65rem', color: theme.primary }}>
                {isInitialLoading ? "SYNCING..." : "ONLINE"}
              </small>
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-grow-1 overflow-y-auto p-4 d-flex flex-column custom-scrollbar" 
             style={{ backgroundColor: `${theme.bg}` }}>
          {messages.map((msg, index) => {
            const isMe = msg.sender_id === currentUser?.id;
            return (
              <div key={msg.id || index} className={`d-flex mb-3 ${isMe ? "justify-content-end" : "justify-content-start"}`}>
                <div 
                  className="p-3 shadow-sm" 
                  style={{ 
                    maxWidth: '80%', 
                    borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                    backgroundColor: isMe ? theme.primary : `${theme.primary}15`,
                    color: isMe ? '#fff' : theme.text,
                  }}
                >
                  <div className="fw-medium">{msg.content}</div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="p-3 border-top flex-shrink-0" style={{ backgroundColor: theme.cardBg, borderColor: `${theme.primary}20` }}>
          <form onSubmit={sendMessage} className="d-flex align-items-center gap-2">
            <div className="flex-grow-1 d-flex align-items-center rounded-pill px-3 py-1"
                 style={{ backgroundColor: `${theme.primary}10`, border: `1px solid ${theme.primary}20` }}>
              <input 
                type="text" 
                className="form-control border-0 bg-transparent shadow-none py-2"
                style={{ color: theme.text }}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button type="submit" className="btn btn-link p-0" style={{ color: theme.primary }} disabled={!newMessage.trim()}>
                <i className="bi bi-send-fill fs-4"></i>
              </button>
            </div>
          </form>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${theme.primary}40; border-radius: 10px; }
      `}</style>
    </div>
  );
}