import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../supabase";
import { Link } from "react-router-dom";

function CommunityFeed({ user }: { user: any }) {
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Reply & Slide Logic
  const [replyingTo, setReplyingTo] = useState<{id: string, username: string} | null>(null);
  const [dragX, setDragX] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const startX = useRef(0);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select(`id, content, created_at, user_id, profiles (username, display_name)`)
      .order("created_at", { ascending: false });

    if (!error) setComments(data || []);
    setLoading(false);
  };

  const postComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;

    const contentToSend = replyingTo 
      ? `Replying to @${replyingTo.username}: ${commentText.trim()}`
      : commentText.trim();

    const { error } = await supabase
      .from("comments")
      .insert({ user_id: user.id, content: contentToSend });

    if (!error) {
      setCommentText("");
      setReplyingTo(null);
      fetchComments();
    }
  };

  const handleStart = (e: any, id: string) => {
    startX.current = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    setActiveId(id);
  };

  const handleMove = (e: any) => {
    if (activeId === null) return;
    const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const diff = currentX - startX.current;
    if (diff > 0 && diff < 100) setDragX(diff);
  };

  const handleEnd = (id?: string, profile?: any) => {
    if (dragX > 60 && id && profile) {
      setReplyingTo({ id, username: profile.username });
    }
    setDragX(0);
    setActiveId(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container-fluid vh-100 d-flex flex-column p-0">

      {/* Message List */}
      <div 
        className="flex-grow-1 p-3 overflow-auto d-flex flex-column-reverse"
        onMouseMove={handleMove}
        onMouseUp={() => handleEnd()}
        onTouchMove={handleMove}
        onTouchEnd={() => handleEnd()}
      >
        {comments.map((c) => {
          const isMe = user?.id === c.user_id;
          const isDragging = activeId === c.id;

          return (
            <div key={c.id} className={`d-flex mb-3 ${isMe ? 'justify-content-end' : 'justify-content-start'}`}>
              <div 
                onMouseDown={(e) => handleStart(e, c.id)}
                onTouchStart={(e) => handleStart(e, c.id)}
                onMouseUp={() => handleEnd(c.id, c.profiles)}
                onTouchEnd={() => handleEnd(c.id, c.profiles)}
                className="border p-2"
                style={{ 
                  maxWidth: "80%",
                  transform: `translateX(${isDragging ? dragX : 0}px)`,
                  transition: isDragging ? 'none' : 'transform 0.2s',
                  backgroundColor: isMe ? '#f8f9fa' : '#ffffff'
                }}
              >
                {!isMe && (
                  <Link to={`/profile/${c.profiles?.username}`} className="d-block fw-bold small mb-1">
                    {c.profiles?.display_name || c.profiles?.username}
                  </Link>
                )}
                <p className="m-0">{c.content}</p>
                <small className="text-muted d-block text-end" style={{ fontSize: '0.7rem' }}>
                  {new Date(c.created_at).toLocaleTimeString()}
                </small>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="p-3 border-top">
        {replyingTo && (
          <div className="alert alert-info py-1 px-2 d-flex justify-content-between align-items-center mb-2">
            <small>Replying to @{replyingTo.username}</small>
            <button className="btn-close" style={{ fontSize: '0.5rem' }} onClick={() => setReplyingTo(null)}></button>
          </div>
        )}
        
        {user ? (
          <form onSubmit={postComment} className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Message..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">Send</button>
          </form>
        ) : (
          <p className="text-center small">Please log in to participate.</p>
        )}
      </div>
    </div>
  );
}

export default CommunityFeed;