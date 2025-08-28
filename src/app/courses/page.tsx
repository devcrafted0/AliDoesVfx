"use client"

import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar/Navbar';
import Image from 'next/image';

const page = () => {

  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data));
  }, []);

  function truncateText(text: string, maxLength: number) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  }

  return (
    <div className='overflow-hidden'>
      <div>
        <Navbar/>
      </div>
        <h1 className='mt-8 font-bold text-center text-4xl text-main'>Courses</h1>
        
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6 p-6">
          {videos.map((video, index) => (
            <div
              key={index}
              className="flex flex-col rounded-xl border border-white/20 bg-white/5 shadow-md overflow-hidden hover:scale-[1.02] hover:shadow-lg transition-transform duration-200 cursor-pointer"
            >
              <div className="w-full aspect-video overflow-hidden bg-black flex justify-center items-center">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 flex flex-col flex-1">
                <h1 className="font-semibold text-sm text-white mb-2 line-clamp-2">
                  {video.title}
                </h1>
                <p className="text-gray-400 text-xs leading-snug line-clamp-3">
                  {truncateText(video.description || "", 120)}
                </p>
              </div>
            </div>
          ))}
        </div>

    </div>
  )
}

export default page;