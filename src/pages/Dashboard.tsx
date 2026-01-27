import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../supabase";
import Navbar from "../components/Navbar";
import Matches from "./Matches"; 
import { Link } from "react-router-dom";


function Home() {
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);

  // Mention / tagging state
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);

  const textareaRef = useRef(null);
  const dropdownRef = useRef(null);

  // Fetch initial data
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      await fetchComments();
      setLoading(false);
    };
    init();
  }, []);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select(`
        id,
        content,
        created_at,
        profiles (
          username,
          display_name
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching:", error.message);
    } else {
      setComments(data || []);
    }
  };

  // Search users for @mention when typing after @
  const searchUsers = async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 1) {
      setMentionSuggestions([]);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("username, display_name")
      .ilike("username", `%${searchTerm}%`)
      .limit(6);

    if (!error && data) {
      setMentionSuggestions(data);
    }
  };

  // Handle textarea change + detect @mention trigger
  const handleCommentChange = (e) => {
    const value = e.target.value;
    setCommentText(value);

    const pos = e.target.selectionStart;
    setCursorPosition(pos);

    const textBeforeCursor = value.substring(0, pos);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");

    if (lastAtIndex !== -1) {
      const searchText = textBeforeCursor.substring(lastAtIndex + 1);
      // Only trigger if we're right after @ or @ + letters
      if (!searchText.includes(" ") && !searchText.includes("\n")) {
        setMentionSearch(searchText);
        setShowMentionDropdown(true);
        searchUsers(searchText);
        return;
      }
    }

    setShowMentionDropdown(false);
    setMentionSuggestions([]);
  };

  // Insert selected @username into textarea
  const handleSelectMention = (username) => {
    const before = commentText.substring(0, cursorPosition - mentionSearch.length - 1); // -1 for the @
    const after = commentText.substring(cursorPosition);

    const newText = `${before}@${username} ${after}`;
    setCommentText(newText);

    // Move cursor after the inserted mention
    const newPos = before.length + username.length + 2; // +1 for @ +1 for space
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newPos, newPos);
      }
    }, 0);

    setShowMentionDropdown(false);
    setMentionSuggestions([]);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowMentionDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const postComment = async (e) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;

    const { error } = await supabase
      .from("comments")
      .insert({
        user_id: user.id,
        content: commentText.trim(),
      });

    if (error) {
      alert(error.message);
    } else {
      setCommentText("");
      setShowMentionDropdown(false);
      fetchComments();
    }
  };

  if (loading) return <p>Loading e-football portal...</p>;

  return (
    <>
      <Navbar />
      <div className="mt-5" style={{ padding: "20px", fontFamily: "sans-serif" }}>
        <Matches />



        {/* Post Comment Section with @mentions */}
        {user ? (
          <form onSubmit={postComment} style={{ marginBottom: "20px", position: "relative" }}>
            <div style={{ position: "relative" }}>
              <textarea
                ref={textareaRef}
                style={{
                  width: "100%",
                  height: "80px",
                  display: "block",
                  marginBottom: "10px",
                  padding: "8px",
                  resize: "vertical",
                }}
                placeholder="Add a comment... Use @ to mention someone"
                value={commentText}
                onChange={handleCommentChange}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setShowMentionDropdown(false);
                }}
              />

              {/* Mention Dropdown */}
              {showMentionDropdown && mentionSuggestions.length > 0 && (
                <ul
                  ref={dropdownRef}
                  style={{
                    position: "absolute",
                    bottom: "100%",
                    left: 0,
                    width: "100%",
                    maxHeight: "200px",
                    overflowY: "auto",
                    background: "white",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    zIndex: 10,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                >
                  {mentionSuggestions.map((profile) => (
                    <li
                      key={profile.username}
                      onClick={() => handleSelectMention(profile.username)}
                      style={{
                        padding: "8px 12px",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f0f0")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                    >
                      <strong>@{profile.username}</strong>
                      {profile.display_name && (
                        <span style={{ color: "#666", marginLeft: "8px" }}>
                          {profile.display_name}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="submit"
              style={{
                padding: "8px 16px",
                cursor: "pointer",
                background: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Post Comment
            </button>
          </form>
        ) : (
          <p><i>Please log in to post comments.</i></p>
        )}

        {/* Display Comments */}


<div className="comments-list mt-4">
  <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
    <h3 className="h5 fw-bold mb-0 text-dark">Community Feed</h3>
    <span className="badge bg-primary rounded-pill">{comments.length} Comments</span>
  </div>

  {comments.length === 0 && (
    <div className="text-center py-5 bg-light rounded-3 border border-dashed">
      <p className="text-muted mb-0">No comments yet. Be the first to join the conversation!</p>
    </div>
  )}

  <div className="d-flex flex-column gap-3">
    {comments.map((c) => (
      <div key={c.id} className="card border-0 shadow-sm">
        <div className="card-body p-3">
          <div className="d-flex align-items-center gap-2 mb-2">
            
            {/* Wrap Avatar in Link */}
            <Link to={`/profile/${c.profiles?.username}`} className="text-decoration-none">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: "32px", height: "32px", fontSize: "0.8rem" }}>
                {(c.profiles?.display_name || "U")[0].toUpperCase()}
              </div>
            </Link>
            
            <div className="d-flex flex-column">
              {/* Wrap Name in Link */}
              <Link 
                to={`/profile/${c.profiles?.username}`} 
                className="fw-bold text-dark lh-1 text-decoration-none"
                style={{ cursor: "pointer" }}
                onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
              >
                {c.profiles?.display_name || "Unknown User"}
              </Link>
              
              <span className="text-muted small" style={{ fontSize: "0.75rem" }}>
                @{c.profiles?.username || "user"} • {new Date(c.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          <p className="card-text text-secondary mt-2 ps-1" style={{ whiteSpace: "pre-wrap", fontSize: "0.95rem", lineHeight: "1.5" }}>
            {c.content}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>
      </div>
    </>
  );
}

export default Home;