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
  const [activeTab, setActiveTab] = useState<'matches' | 'discussion'>('matches');

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

      <div className="mt-5 pt-3 container-fluid" style={{ fontFamily: "sans-serif" }}>

  {/* Navigation Pills */}
  <ul className="nav nav-pills nav-fill mb-4" id="match-discussion-tabs" role="tablist">
    <li className="nav-item" role="presentation">
      <button
        className={`nav-link w-100 ${activeTab === 'matches' ? 'active' : ''}`}
        onClick={() => setActiveTab('matches')}
        type="button"
        role="tab"
      >
        Matches
      </button>
    </li>
    <li className="nav-item" role="presentation">
      <button
        className={`nav-link w-100 ${activeTab === 'discussion' ? 'active' : ''}`}
        onClick={() => setActiveTab('discussion')}
        type="button"
        role="tab"
      >
        Community Feed
      </button>
    </li>
  </ul>

  {/* Tab content */}
  <div className="tab-content">

    {/* Matches */}
    <div
      className={`tab-pane fade ${activeTab === 'matches' ? 'show active' : ''}`}
      role="tabpanel"
    >
      <Matches />
    </div>

    {/* Discussion / Comments */}
    <div
      className={`tab-pane fade ${activeTab === 'discussion' ? 'show active' : ''}`}
      role="tabpanel"
    >
      {/* Comment form */}
      {user ? (
        <form onSubmit={postComment} className="mb-4 position-relative">
          <textarea
            ref={textareaRef}
            className="form-control mb-2"
            rows={3}
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
              className="list-group position-absolute w-100 shadow"
              style={{ bottom: "100%", zIndex: 10, maxHeight: "200px", overflowY: "auto" }}
            >
              {mentionSuggestions.map((profile) => (
                <li
                  key={profile.username}
                  className="list-group-item list-group-item-action"
                  onClick={() => handleSelectMention(profile.username)}
                >
                  <strong>@{profile.username}</strong>
                  {profile.display_name && (
                    <span className="text-muted ms-2">{profile.display_name}</span>
                  )}
                </li>
              ))}
            </ul>
          )}

          <button type="submit" className="btn btn-primary">
            Post Comment
          </button>
        </form>
      ) : (
        <p className="text-muted fst-italic mb-4">
          Please log in to post comments.
        </p>
      )}

      {/* Comments list */}
      <div className="comments-list">
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
          <h3 className="h5 fw-bold mb-0">Community Feed</h3>
          <span className="badge bg-primary rounded-pill fs-6 px-3 py-2">
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </span>
        </div>

        {comments.length === 0 ? (
          <div className="text-center py-5 bg-light rounded-3 border border-dashed">
            <p className="text-muted mb-0 fs-5">
              No comments yet. Be the first to join the conversation!
            </p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {comments.map((c) => (
              <div key={c.id} className="card border-0 shadow-sm">
                <div className="card-body p-3">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <Link to={`/profile/${c.profiles?.username}`} className="text-decoration-none">
                      <div
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm flex-shrink-0"
                        style={{ width: "48px", height: "48px", fontSize: "1.1rem" }}
                      >
                        {(c.profiles?.display_name || c.profiles?.username || "U")[0].toUpperCase()}
                      </div>
                    </Link>

                    <div>
                      <Link
                        to={`/profile/${c.profiles?.username}`}
                        className="fw-bold text-dark text-decoration-none d-block"
                      >
                        {c.profiles?.display_name || c.profiles?.username || "Unknown User"}
                      </Link>
                      <small className="text-muted">
                        @{c.profiles?.username || "user"} • {new Date(c.created_at).toLocaleString()}
                      </small>
                    </div>
                  </div>

                  <p className="card-text text-secondary mb-0" style={{ whiteSpace: "pre-wrap" }}>
                    {c.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

  </div>
</div>
      
    </>
  );
}

export default Home;