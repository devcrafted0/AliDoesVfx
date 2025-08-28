"use client";

import { useEffect, useState } from "react";

const Page = ({ params }: { params: { id: string } }) => {
  const currentId = Number(params.id);

  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => {
        setVideos(data);
        setLoading(false);
      });
  }, []);

  const video = videos.find((f) => f.id === currentId);

  if (loading) return <p>Loading...</p>;
  if (!video) return <p>Video not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-2">{video.title}</h1>
      <p className="text-gray-500 mb-4">{video.description}</p>
    </div>
  );
};

export default Page;
