import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase.js";
import Navbar from "../components/Navbar.tsx";
import { useTheme } from "./ThemeContext.tsx";

export default function Chat() {
  const { receiverId } = useParams();
  const { theme } = useTheme();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const setupChat = async () => {
      setLoading(true);
      setError(null);

      // 1. Check Authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        setError("You must be logged in to view messages.");
        setLoading(false);
        return;
      }
      
      if (user.id === receiverId) {
        setError("You cannot start a chat with yourself.");
        setLoading(false);
        return;
      }

      setCurrentUser(user);

      // 2. Fetch Initial Messages
      if (receiverId) {
        const { data, error: fetchError } = await supabase
          .from("messages")
          .select("*")
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`)
          .order("created_at", { ascending: true });

        if (fetchError) {
          setError("Could not load conversation history.");
        } else {
          setMessages(data || []);
        }
      }
      setLoading(false);
    };

    setupChat();
  }, [receiverId]);

  // Real-time Subscription
  useEffect(() => {
    if (!currentUser || !receiverId) return;

    const channel = supabase
      .channel(`chat:${receiverId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const msg = payload.new;
        const isRelevant = 
          (msg.sender_id === currentUser.id && msg.receiver_id === receiverId) ||
          (msg.sender_id === receiverId && msg.receiver_id === currentUser.id);

        if (isRelevant) {
          setMessages((prev) => (prev.find(m => m.id === msg.id) ? prev : [...prev, msg]));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [currentUser, receiverId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !receiverId) return;

    const { error: sendError } = await supabase.from("messages").insert([
      {
        content: newMessage.trim(),
        sender_id: currentUser.id,
        receiver_id: receiverId,
      },
    ]);

    if (sendError) {
      alert("Failed to send message. Please try again.");
    } else {
      setNewMessage("");
    }
  };

  return (
    <div className="d-flex vh-100" style={{ backgroundColor: theme.bg, color: theme.text }}>
      <Navbar />
      <main className="flex-grow-1 d-flex flex-column p-3" style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}>
        
        <div className="pb-3 border-bottom mb-3 d-flex justify-content-between align-items-center">
          <h5 className="m-0">Chat</h5>
          {loading && <small className="text-muted">Connecting...</small>}
        </div>

        {/* Error State */}
        {error ? (
          <div className="flex-grow-1 d-flex align-items-center justify-content-center">
            <div className="alert alert-warning text-center shadow-sm w-100">
              <i className="bi bi-exclamation-triangle-fill d-block mb-2"></i>
              {error}
            </div>
          </div>
        ) : (
          <>
            <div className="flex-grow-1 overflow-auto pe-2" style={{ scrollbarWidth: 'thin' }}>
              {messages.length === 0 && !loading && (
                <div className="text-center text-muted mt-5">
                  <p>No messages yet. Say hello!</p>
                </div>
              )}
              
              {messages.map((msg) => {
                const isMe = msg.sender_id === currentUser?.id;
                return (
                  <div key={msg.id} className={`d-flex mb-3 ${isMe ? "justify-content-end" : "justify-content-start"}`}>
                    <div 
                      className="p-2 px-3 rounded-3 shadow-sm" 
                      style={{ 
                        maxWidth: '80%', 
                        backgroundColor: isMe ? theme.primary : '#f0f0f0',
                        color: isMe ? '#fff' : '#000',
                        borderRadius: isMe ? '15px 15px 2px 15px' : '15px 15px 15px 2px'
                      }}
                    >
                      <div style={{ fontSize: "0.95rem" }}>{msg.content}</div>
                      <div style={{ fontSize: "0.7rem", opacity: 0.7, textAlign: "right", marginTop: "4px" }}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="d-flex gap-2 pt-3 border-top mt-auto">
              <input 
                type="text" 
                className="form-control"
                disabled={loading}
                style={{ backgroundColor: 'transparent', color: theme.text, border: `1px solid ${theme.primary}40` }}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write your message..."
              />
              <button type="submit" disabled={loading} className="btn btn-primary px-4">Send</button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}