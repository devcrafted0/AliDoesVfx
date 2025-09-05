"use client"
import BouncingLoader from "@/components/BouncingLoader/BouncingLoader";
import Navbar from "@/components/Navbar/Navbar";
import { useEffect, useState } from "react";

export type Comment = {
  id: number;
  username: string;
  comment: string;
  imageURL: string;
  createdAt: string | null;
};


const Page = () => {

  const [comments , setComments] = useState<Comment[]>([]);
  const [loading , setLoading] = useState<boolean>(true);

  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(()=>{
    const fetchComments = async() => {
      try {        
        const res = await fetch(`/api/videos/comments`);
        if (!res.ok) {
          throw new Error(`Failed to fetch video: ${res.status}`);
        }
        const data = await res.json();
        setComments(data.comments);        
      } catch (err) {
      } finally {
        setLoading(false);
      }
   }
   fetchComments();
  }, [] )

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  function timeAgo(dateString : string) {
    const now = new Date();
    const created = new Date(dateString);
    const diff = Math.floor((now.getTime() - created.getTime()) / 1000); // seconds

    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  }

  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.createdAt??"").getTime() - new Date(a.createdAt??"").getTime()
  );

  const visibleComments = sortedComments.slice(0, visibleCount);

  return (
    <div className="p-5">
      <div className="overflow-hidden">
        <Navbar/>
      </div>
      <h1 className="text-white w-full text-4xl text-main text-center font-bold my-5">Comments</h1>
      {loading ? 
      <div className="w-full h-full overflow-hidden">
        <div className="transform -translate-y-80 -translate-x-10">
          <BouncingLoader/> 
        </div>
      </div>
      : <div className="space-y-3 mb-10">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-300">No comments yet...</p>
        ) : (
          <>
            {visibleComments.map((c, idx) => (
              <div key={idx} className="p-2 border rounded-lg hover:bg-white/10 cursor-pointer transition-all duration-75 ">
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
      </div>}
      
    </div>
  )
}

export default Page;