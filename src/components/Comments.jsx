"use client";
import { useState } from "react";

export default function Comments({ videoId, initialComments, user }) {
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setLoading(true);

    const commentObj = {
      username: user.username,
      userId: user.id,
      comment: newComment.trim(),
      imageURL : user.imageUrl,
    };

    try {
      const res = await fetch(`/api/videos/${videoId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentObj),
      });

      const data = await res.json();

      if (res.ok) {
        // Optimistic update
        setComments((prev) => [...prev, data.comment]);
        setNewComment("");
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setLoading(false);
    }
  };

  function timeAgo(dateString) {
    const now = new Date();
    const created = new Date(dateString);
    const diff = Math.floor((now.getTime() - created.getTime()) / 1000); // seconds

    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  }

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const visibleComments = sortedComments.slice(0, visibleCount);

  return (
    <div className="mt-6 w-full max-w-lg">
      <h2 className="text-lg font-semibold mb-2 text-gray-300">Comments :</h2>

      {/* Input field */}
      <div className="flex gap-2 mb-5">
        <input
          type="text"
          className="flex-1 border p-2 rounded-lg text-white"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          onClick={handleAddComment}
          disabled={loading}
          className="px-4 py-2 bg-main text-white rounded-lg disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      {/* Existing comments */}
      <div className="space-y-3 mb-10">
      {comments.length === 0 ? (
        <p className="text-sm text-gray-300">No comments yet...</p>
      ) : (
        <>
          {visibleComments.map((c, idx) => (
            <div key={idx} className="p-2 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8">
                  <img
                    src={c.imageURL}
                    alt={c.comment}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-400 text-[11px]">
                    @{c.username.toLowerCase()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">
                    {c.createdAt ? timeAgo(c.createdAt) : ""}
                  </p>
                </div>
              </div>
              <p className="text-md text-white">{c.comment}</p>
              <p className="text-xs text-gray-400">
                {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
              </p>
            </div>
          ))}

          {/* Load more button */}
          {comments.length > visibleCount && (
            <div className="flex justify-center">
              <button
                onClick={handleLoadMore}
                className="px-4 py-2 mt-4 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600"
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
}
