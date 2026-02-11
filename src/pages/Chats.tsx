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

      // 1. Fetch all messages where I am sender or receiver
      const { data: messages, error } = await supabase
        .from("messages")
        .select("sender_id, receiver_id")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (error) {
        console.error("Error fetching conversations:", error);
        setLoading(false);
        return;
      }

      // 2. Get unique IDs of people I'm talking to
      const chatPartnerIds = new Set();
      messages.forEach((msg) => {
        if (msg.sender_id !== user.id) chatPartnerIds.add(msg.sender_id);
        if (msg.receiver_id !== user.id) chatPartnerIds.add(msg.receiver_id);
      });

      const idsArray = Array.from(chatPartnerIds);

      if (idsArray.length > 0) {
        // 3. Fetch profiles for these IDs
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, display_name, email")
          .in("id", idsArray);

        setConversations(profiles || []);
      }
      setLoading(false);
    };

    fetchConversations();
  }, []);

  return (
    <div className="d-flex vh-100" style={{ backgroundColor: theme.bg, color: theme.text }}>
      <Navbar />
      <main className="flex-grow-1 p-4" style={{ maxWidth: "600px", margin: "0 auto", width: "100%" }}>
        <h3 className="mb-4">Messages</h3>

        {loading ? (
          <p>Loading conversations...</p>
        ) : conversations.length === 0 ? (
          <div className="text-center mt-5 opacity-50">
            <p>No active conversations yet.</p>
          </div>
        ) : (
          <div className="list-group">
            {conversations.map((person) => (
              <button
                key={person.id}
                onClick={() => navigate(`/chat/${person.id}`)}
                className="list-group-item list-group-item-action d-flex align-items-center justify-content-between"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  color: theme.text,
                  border: `1px solid ${theme.primary}20`,
                  marginBottom: "10px",
                  borderRadius: "8px"
                }}
              >
                <div>
                  <div className="fw-bold">{person.display_name || "User"}</div>
                  <small className="opacity-50">{person.email}</small>
                </div>
                <i className="bi bi-chevron-right"></i>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}