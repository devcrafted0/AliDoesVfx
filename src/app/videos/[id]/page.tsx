"use client";

import BouncingLoader from "@/components/BouncingLoader/BouncingLoader";
import Navbar from "@/components/Navbar/Navbar";
import NotFound from "@/components/NotFound/NotFound";
import { useEffect, useState } from "react";

type Video = {
  id: number;
  title: string;
  youtubeUrl: string;
  description?: string | null;
  thumbnail?: string;
  publishedAt: Date;
  createdAt: Date;
};


export default function VideoDetails({ params }: { params: {id : string} }) {
  const id = Number(params.id);
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideo() {
      try {
        const res = await fetch(`/api/videos/${id}`);
        if (!res.ok) throw new Error("Failed to fetch video");

        const data = await res.json();
        setVideo(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVideo();
  }, [id]);

  if (loading) return <BouncingLoader/>;
  if (!video) return <NotFound href="/videos" pageName="Videos"/>

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 z-10">
        <Navbar/>
      </div>
      <div className="relative w-screen h-100 bg-white flex justify-center items-center overflow-hidden [@media(max-width:680px)]:h-60">
        <img src={video.thumbnail} alt={video.title} className="min-w-full min-h-[150%] object-cover [clip-path:inset(50px_0px_50px_0px)]" />
        <div className="absolute top-0 left-0 bg-black/50 w-full h-full flex justify-center items-center">
          <h1 className="font-bold text-main [text-shadow:3px_3px_10px_rgba(0,0,0,0.8)] text-[clamp(0.8rem,2vw,2.5rem)]">{video.title}</h1>
        </div>
      </div>

      <div className="p-5">
        <p className="text-gray-600">{video.description}</p>
        <p className="text-gray-600">{video.youtubeUrl}</p>
      </div>
    </div>
  );
}
