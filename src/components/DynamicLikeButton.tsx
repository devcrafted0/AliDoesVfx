import { useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";

type LikeButtonParams = {
    videoId : number ; 
    initialLiked : boolean ; 
    initialCount : number; 
}

export default function DynamicLikeButton({ videoId, initialLiked, initialCount } : LikeButtonParams) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  const handleLike = async () => {
  const prevLiked = liked;
  const prevCount = count;

  // optimistic update
  setLiked(!liked);
  setCount(liked ? count - 1 : count + 1);

  const res = await fetch(`/api/videos/${videoId}/like`, { method: "POST" });
  if (!res.ok) {
    // rollback on error
    setLiked(prevLiked);
    setCount(prevCount);
  }
};

  return (
    <button onClick={handleLike} className="flex items-center text-white gap-1">
      {liked ? <AiFillLike className="cursor-pointer" /> : <AiOutlineLike className="cursor-pointer" />}  {count}
    </button>
  );
}
