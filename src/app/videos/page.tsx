"use client"

import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar/Navbar';

const page = () => {

  const [videos, setVideos] = useState<any[]>([]);
  const [query , setQuery] = useState('');
  const [filteredVideos, setFilteredVideos] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data));
  }, []);

  function truncateText(text: string, maxLength: number) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  }

  useEffect(()=>{
      setFilteredVideos(videos.filter((video) =>
      video.title.toLowerCase().includes(query.toLowerCase())
    ))
  },[query])
  
  const videosToRender = query ? filteredVideos : videos;

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
          {videosToRender.length > 0 ? (videosToRender.map((video, index) => (
            <a key={index} href={`/videos/${video.id}`}>
              <div
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
            </a>
          ))) : (<p className='text-xl text-white'>No Videos Found...</p>)}
        </div>

    </div>
  )
}

export default page;