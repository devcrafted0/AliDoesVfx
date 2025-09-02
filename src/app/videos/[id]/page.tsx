"use client";

import BouncingLoader from "@/components/BouncingLoader/BouncingLoader";
import Navbar from "@/components/Navbar/Navbar";
import NotFound from "@/components/NotFound/NotFound";
import { useEffect, useState } from "react";
import CustomYouTubePlayer from "@/components/MediaPlayer/CustomMediaPlayer";
import { ChartNoAxesColumn } from "lucide-react";

type Video = {
  id: number;
  title: string;
  youtubeUrl: string;
  description?: string | null;
  thumbnail?: string;
  publishedAt: Date;
  createdAt: Date;
  views : number;
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

  useEffect(() => {
    fetch(`/api/videos/${id}`, { method: "POST" });
  }, [id]);


  if (loading) return <BouncingLoader/>;
  if (!video) return <NotFound href="/videos" pageName="Videos"/>

  return (
    <div className="relative overflow-hidden">
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
        <h1 className="text-main font-bold text-center text-[clamp(0.90rem,1vw,5rem)]">Video</h1>
        <CustomYouTubePlayer url={video.youtubeUrl} />
        <div className="w-screen p-3">
            <h1 className="text-gray-300 text-2xl font-bold flex items-center gap-1">
                <span>
                  {video.views} Views
                </span>
                <span>
                  <ChartNoAxesColumn />
                </span>
              </h1>
        </div>
        <p className="text-gray-400 text-[clamp(0.90rem,1vw,1.125rem)]">{video.description}</p>
      </div>
    </div>
  );
}
