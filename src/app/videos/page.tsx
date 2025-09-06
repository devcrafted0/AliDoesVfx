"use client"

import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar/Navbar';
import BouncingLoader from '@/components/BouncingLoader/BouncingLoader';
import { ChartNoAxesColumn } from 'lucide-react';
import { AiFillLike } from 'react-icons/ai';
import { LiaCommentSolid } from "react-icons/lia";
import Image from 'next/image';

type Video = {
  id: number;
  title: string;
  youtubeUrl: string;
  description?: string | null;
  thumbnail: string;
  publishedAt: Date;
  createdAt: Date;
  views : number;
  likes : number;
  initialLiked : boolean;
  comments : [];
};

const Page = () => {

  const [videos, setVideos] = useState<Video[]>([]);
  const [query , setQuery] = useState('');
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    try{
      fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data));
    } catch(err: unknown){
        if (err instanceof Error) setError(err.message);
        else setError("Unknown error occurred");
    } finally{
        setLoading(false);
    }
  }, []);

  function truncateText(text: string, maxLength: number) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  }

  useEffect(()=>{
      setFilteredVideos(videos.filter((video) =>
      video.title.toLowerCase().includes(query.toLowerCase())
    ))
  },[query , videos])
  
  const videosToRender = query ? filteredVideos : videos;

  if(error) return <p>Error : {error}</p>
  if (loading) return <BouncingLoader/>;

  return (
    <div className='overflow-hidden'>
      <div>
        <Navbar/>
      </div>
      <div className='mt-3 max-w-[90vw] m-auto flex justify-between items-center'>
        <h1 className='font-bold text-center text-4xl text-main mr-1'>Videos</h1>
        <input type="text" placeholder='Search...' className='text-white py-2 px-3 transform border border-[#FFB400] [@media(max-width:410px)]:scale-80 rounded-xl' value={query} onChange={(e)=>{setQuery(e.target.value); console.log(query)}} />
      </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6 p-6">
          {videosToRender.length > 0 ? (videosToRender.map((video, index) => {
            const commentCount = video.comments ? video.comments.length : 0;
            return(
            <a key={index} href={`/videos/${video.id}`}>
              <div
                className="flex flex-col h-full rounded-xl border border-white/20 bg-white/5 shadow-md overflow-hidden hover:scale-[1.02] hover:shadow-lg transition-transform duration-200 cursor-pointer"
                >
                <div className="w-full aspect-video overflow-hidden bg-black flex justify-center items-center">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    width={200}
                    height={200}
                    />
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h1 className="font-semibold text-sm text-white mb-2 line-clamp-2">
                    {video.title}
                  </h1>

                  <div className="flex-1">
                    <p className="text-gray-400 text-xs leading-snug line-clamp-3">
                      {truncateText(video.description || "", 120)}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center gap-4 text-gray-300 text-xs">
                    <div className="flex items-center gap-1">
                      <ChartNoAxesColumn className="w-4 h-4" />
                      <span>{video.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AiFillLike className="w-4 h-4" />
                      <span>{video.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <LiaCommentSolid className="w-4 h-4" />
                      <span>{commentCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </a>
            )
          })) : (<p className='text-xl text-white'>No Videos Found...</p>)}
        </div>

    </div>
  )
}

export default Page;