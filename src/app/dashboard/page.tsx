"use client"

import React, { useEffect, useState } from 'react';
import { Video, Plus, BookOpen, Menu, X,  Users, Delete, DeleteIcon, ChartNoAxesColumn } from 'lucide-react';
import BodyPortal from '@/components/PortalBody';
import { MdClose, MdDelete, MdEdit } from 'react-icons/md';
import BouncingLoader from '@/components/BouncingLoader/BouncingLoader';
import Navbar from '@/components/Navbar/Navbar';
import { AiFillLike } from 'react-icons/ai';
import { LiaCommentSolid } from 'react-icons/lia';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('all-videos');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formOpen , setFormOpen] = useState<boolean>(false);
  const [deleteOpen , setDeleteOpen] = useState<boolean>(false);
  const [videos, setVideos] = useState<any[]>([]);

  const [selectedId , setSelectedId] = useState<number | null>(null);

  const [editId , setEditId] = useState<number | null>(null);
  const [editData , setEditData] = useState({
    title: "",
    youtubeUrl: "",
    description: "",
    thumbnail: "",
    publishedAt: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [query , setQuery] = useState<string>('');

  const [filteredVideos, setFilteredVideos] = useState<any[]>([]);

  // Handle Query And Update the videos
  useEffect(()=>{
      setFilteredVideos(videos.filter((video) =>
      video.title.toLowerCase().includes(query.toLowerCase())
    ))
  },[query])

  const videosToRender = query ? filteredVideos : videos;

  // Add A Video
  const [form, setForm] = useState({
    title: "",
    youtubeUrl: "",
    description: "",
    thumbnail: "",
    publishedAt: "",
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle Edit Form Change
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
    console.log(editData);
  };
  
  // Handle Add Form Change
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    console.log('Submitting form data:', form);
    
    // Validate form data before sending
    if (!form.title || !form.youtubeUrl || !form.publishedAt) {
      alert("Please fill in all required fields");
      return;
    }

    const res = await fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    console.log('Response status:', res.status);
    
    if (res.ok) {
      const data = await res.json();
      console.log('Success response:', data);
      alert("Video added: " + data.title);
      window.location.reload();
    } else {
      const error = await res.json();
      console.error('Error response:', error);
      alert("Error: " + (error.error || 'Unknown error occurred'));
    }
  } catch (error) {
    console.error('Network or parsing error:', error);
    alert("Network error occurred. Please try again.");
  }
  };

  // Delete Function Api
  async function deleteVideo(id: number|null) {
    const res = await fetch(`/api/videos/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete user");

    return res.json();
  }

  async function editVideo(id: number|null) {
    try {
    const res = await fetch(`/api/videos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editData),
    });

    if (!res.ok) {
      throw new Error(`Failed to update video: ${res.statusText}`);
    }

    return await res.json();
      } catch (error) {
    console.error("Error updating video:", error);
      throw error;
    }
  }
  
  useEffect(() => {
    fetch("../api/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data));
  }, []);

  const courses = [
    { id: 1, title: 'Complete Web Development Bootcamp', lessons: 45, students: 12500, progress: 85, thumbnail: 'https://via.placeholder.com/300x200/3B82F6/white?text=Web+Dev' },
    { id: 2, title: 'React Native Mobile Development', lessons: 32, students: 8900, progress: 60, thumbnail: 'https://via.placeholder.com/300x200/10B981/white?text=React+Native' },
    { id: 3, title: 'Python for Data Science', lessons: 28, students: 15600, progress: 40, thumbnail: 'https://via.placeholder.com/300x200/F59E0B/white?text=Python' },
    { id: 4, title: 'Machine Learning Fundamentals', lessons: 36, students: 6700, progress: 25, thumbnail: 'https://via.placeholder.com/300x200/EF4444/white?text=ML' }
  ];

  const tabs = [
    { id: 'all-videos', label: 'All Videos', icon: Video },
    { id: 'add-videos', label: 'Add Videos', icon: Plus },
    { id: 'courses', label: 'Courses', icon: BookOpen }
  ];

  // Delete Handeler
  const deleteVideoHandeler = (id : number | null) => {
    setDeleteOpen(true);
    setSelectedId(id);
  }

  // Edit Handeler
  const editVideoHandler = (id: number | null) => {
    setEditId(id);
    setFormOpen(true);
};

  useEffect(() => {
  if (!editId) return; // Don't fetch if editId is null
  
  async function fetchVideo() {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching video with ID:', editId);
      
      const res = await fetch(`/api/videos/${editId}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch video: ${res.status}`);
      }
      
      const data = await res.json();
      setEditData(data);
      
      console.log('Successfully fetched data:', data);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching video:', errorMessage);
    } finally {
      setLoading(false);
    }
  }
  
    fetchVideo();
  }, [editId]);

  function formatDateForInput(dateString: string) {
    if (!dateString) return "";

    // Case 1: already in correct format for <input type="datetime-local">
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dateString)) {
      return dateString;
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      console.warn("Invalid date string:", dateString);
      return "";
    }

    // Convert to local time so the picker doesn't shift hours
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);

    return localDate.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
  }


  const renderContent = () => {
    switch (activeTab) {
      case 'all-videos':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">All Videos</h1>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="search" 
                  placeholder="Search videos..." 
                  className="px-5 py-2 bg-gray-800 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:border-transparent w-full sm:w-64"
                  style={{ focusRingColor: '#FFB400' }}
                  value={query}
                  onChange={(e)=>{setQuery(e.target.value)}}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
              {videosToRender.length > 0 ?(videosToRender.map((video) => {
                const commentCount = video.comments ? video.comments.length : 0;
                return(
                  <div key={video.id} className="relative bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="relative">
                      <a href={`/videos/${video.id}`}>
                        <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                      </a>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-white">{video.title}</h3>
                    </div>
                    <div className="p-4 flex items-center gap-4 text-gray-300 text-xs">
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
                    <div className='absolute bottom-2 right-2 flex gap-4'>
                      <MdEdit onClick={()=>{editVideoHandler(video.id)}} className='hover:text-red-500 cursor-pointer text-lg text-white'/>
                      <MdDelete onClick={()=>{deleteVideoHandeler(video.id)}} className='hover:text-red-500 cursor-pointer text-lg text-white'/>
                    </div>
                  </div>
              )})):(<p className='text-white text-xl'>No Videos Found...</p>)}

              <BodyPortal>                  
                {formOpen && (
                  <div className='absolute top-0 left-0 w-full h-full bg-black/50 overflow-hidden'>
                    <form action="" className='absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%]'>
                      <div className='w-[50vw] h-[68vh] p-5 rounded-3xl bg-gray-700 flex flex-col gap-4 text-white'>
                        {loading ? (<div className='w-full h-full flex justify-center items-center'><BouncingLoader/></div>) : (
                          <div className='flex flex-col gap-4'>
                          <h1 className='text-main font-bold text-2xl'>Edit</h1>
                          <MdClose onClick={()=>setFormOpen(false)} className='active:scale-90 text-2xl text-red-500 absolute top-4 right-5'/>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Video Title</label>
                            <input 
                              type="text"
                              placeholder="Enter video title..."
                              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:border-transparent"
                              style={{ '--tw-ring-color': '#FFB400' }}
                              required
                              name='title'
                              value={editData.title}
                              onChange={handleEditChange}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                            <textarea
                              rows="4"
                              placeholder="Enter video description..."
                              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:border-transparent resize-vertical"
                              style={{ '--tw-ring-color': '#FFB400' }}
                              value={editData.description}
                              name='description'
                              onChange={handleEditChange}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Youtube Video Url</label>
                            <input 
                              type="url"
                              placeholder="Enter Youtube Video URL"
                              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:border-transparent"
                              style={{ '--tw-ring-color': '#FFB400' }}
                              value={editData.youtubeUrl}
                              name='youtubeUrl'
                              onChange={handleEditChange}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Youtube Video Thumbnail Url</label>
                            <input 
                              type="text"
                              placeholder="Enter Youtube Video Thumbnail Url"
                              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:border-transparent"
                              style={{ '--tw-ring-color': '#FFB400' }}
                              value={editData.thumbnail}
                              name='thumbnail'
                              onChange={handleEditChange}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Enter Date</label>
                            <input 
                              type="datetime-local"
                              placeholder="Enter Youtube Video Thumbnail Url"
                              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:border-transparent"
                              style={{ '--tw-ring-color': '#FFB400' }}
                              name='publishedAt'
                              value={formatDateForInput(editData.publishedAt)}
                              onChange={handleEditChange}
                            />
                          </div>
                          
                          <div className='flex items-center justify-center gap-5'>
                            <button onClick={()=>{editVideo(editId)}} className='px-4 py-2 rounded-lg active:scale-90 text-white outline-none bg-green-600' type='submit'>Save Changes</button>
                            <button onClick={()=>setFormOpen(false)} className='px-4 py-2 rounded-lg active:scale-90 text-white outline-none bg-gray-500' type='button'>Discard Changes</button>
                          </div>
                          </div>
                        )}
                      </div>
                    </form>
                  </div>
                )}

                {deleteOpen && (
                  <div className='absolute top-0 left-0 w-full h-full bg-black/50 overflow-hidden'>
                    <form onSubmit={(e)=>{e.preventDefault(); window.location.reload();}} className='absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] overflow-hidden'>
                      <div className='p-5 bg-[#1A1A1A] rounded-2xl'>
                        <h1 className='text-main text-4xl font-bold'>Are You Sure ?</h1>
                        <div className='flex justify-between items-center mt-5'>
                          <button type="submit" onClick={()=>deleteVideo(selectedId)} className='bg-red-500 outline-none rounded-lg px-4 py-2 text-white active:scale-90'>Delete</button>
                          <button type="button" onClick={()=>setDeleteOpen(false)} className='bg-white outline-none rounded-lg px-4 py-2 active:scale-90'>Cancel</button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
                
              </BodyPortal>
            </div>
          </div>
        );

      case 'add-videos':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Add New Video</h1>
            
            <div className="bg-gray-800 rounded-lg shadow-md p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Video Title</label>
                        <input 
                          type="text"
                          name='title'
                          value={form.title}
                          onChange={handleChange}
                          placeholder="Enter video title..."
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:border-transparent"
                          style={{ '--tw-ring-color': '#FFB400' }}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                          name='description'
                          value={form.description}
                          onChange={handleChange}
                          rows="4"
                          placeholder="Enter video description..."
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:border-transparent resize-vertical"
                          style={{ '--tw-ring-color': '#FFB400' }}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Youtube Video Url</label>
                        <input 
                          type="url"
                          name='youtubeUrl'
                          value={form.youtubeUrl}
                          onChange={handleChange}
                          placeholder="Enter Youtube Video URL"
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:border-transparent"
                          style={{ '--tw-ring-color': '#FFB400' }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Youtube Video Thumbnail Url</label>
                        <input 
                          type="text"
                          name='thumbnail'
                          value={form.thumbnail}
                          onChange={handleChange}
                          placeholder="Enter Youtube Video Thumbnail Url"
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:border-transparent"
                          style={{ '--tw-ring-color': '#FFB400' }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Enter Date</label>
                        <input 
                          type="datetime-local"
                          name='publishedAt'
                          value={form.publishedAt}
                          onChange={handleChange}
                          placeholder="Enter Youtube Video Thumbnail Url"
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:border-transparent"
                          style={{ '--tw-ring-color': '#FFB400' }}
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button type="submit" className="px-6 py-2 text-black rounded-lg hover:opacity-90 transition-all font-semibold" style={{ backgroundColor: '#FFB400' }}>
                          Add Video
                        </button>
                      </div>
                      </div>
                    </form>
                </div>
              </div>
            </div>
          </div>
        );

      case 'courses':
        return (
          <div className="flex justify-center items-center h-[70vh]">
            <h1 className='text-4xl p-30 border-2 border-white text-main rounded-2xl'>This Feature Will Be Added Soon...</h1>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className='overflow-hidden'>
        <Navbar/>
      </div>
      <div className="min-h-screen bg-gray-900 relative mt-3 border-t-2 border-gray-400" style={{ backgroundColor: '#1A1A1A' }}>
        {/* Mobile menu overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`fixed top-0 left-0 z-50 h-full w-64 bg-black shadow-lg transform transition-transform duration-300 ease-in-out xl:translate-x-0 xl:static xl:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Dashboard</h2>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="xl:hidden p-2 rounded-lg hover:bg-gray-800 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="p-4">
            <ul className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => {
                        setActiveTab(tab.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'text-black font-semibold'
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                      style={activeTab === tab.id ? { backgroundColor: '#FFB400' } : {}}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Main content */}
        <div className="xl:ml-64 w-full">
          {/* Mobile header */}
          <div className="xl:hidden flex items-center justify-between p-4 bg-black shadow-sm">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-800 text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-white">Dashboard</h1>
            <div className="w-10"></div>
          </div>

          {/* Content area */}
          <main className="p-4 sm:p-6 xl:p- xl:absolute xl:top-0 w-[78%]">
            {renderContent()}
          </main>
        </div>
      </div>
    </>

  );
};

export default Dashboard;