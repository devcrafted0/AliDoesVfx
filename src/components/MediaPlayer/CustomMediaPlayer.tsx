import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings } from 'lucide-react';
import { MdOutlineForward10, MdOutlineReplay10 } from "react-icons/md";

declare global {
  interface Window {
    YT: typeof YT; // this comes from @types/youtube
    onYouTubeIframeAPIReady: () => void;
  }
}

const CustomYouTubePlayer = ({ url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const iframeRef = useRef(null);

  // Extract video ID
  const getVideoId = (url : string) => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/
    );
    return match ? match[1] : null;
  };
  
  const videoId = getVideoId(url);

  // YouTube API Integration
  useEffect(() => {
    if (!videoId) return;

    const loadYouTubeAPI = (): Promise<typeof YT> => {
      return new Promise((resolve) => {
        if (window.YT && window.YT.Player) {
          resolve(window.YT);
          return;
        }

        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
          resolve(window.YT);
        };
      });
    };

    loadYouTubeAPI().then((YT) => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      playerRef.current = new YT.Player(iframeRef.current!, {
        videoId: videoId,
        playerVars: {
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            setDuration(event.target.getDuration());
            setIsLoading(false);
            setVideoReady(true);
          },
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.PLAYING) setIsPlaying(true);
            if (event.data === YT.PlayerState.PAUSED) setIsPlaying(false);
            if (event.data === YT.PlayerState.ENDED) setIsPlaying(false);
          },
        },
      });
    });

    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  // Update current time
  useEffect(() => {
    if (!videoReady || !playerRef.current) return;

    const interval = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        try {
          const currentT = playerRef.current.getCurrentTime();
          setCurrentTime(currentT);
        } catch (error) {
          console.log('Error getting current time:', error);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [videoReady, isPlaying]);

  // Fullscreen listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Format time as mm:ss
  const formatTime = (seconds:number|null|undefined):string => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Control handlers
  const handlePlayPause = () => {
    if (!playerRef.current) return;
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    } catch (error) {
      console.log('Play/Pause error:', error);
    }
  };

  const handleVolumeToggle = () => {
    if (!playerRef.current) return;
    try {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    } catch (error) {
      console.log('Volume toggle error:', error);
    }
  };

  const handleVolumeChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseInt(e.target.value);
    setVolume(newVol);
    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      try {
        playerRef.current.setVolume(newVol);
        setIsMuted(newVol === 0);
      } catch (error) {
        console.log('Volume change error:', error);
      }
    }
  };

  const handleSeek = (e : React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!playerRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    try {
      playerRef.current.seekTo(newTime, true);
      setCurrentTime(newTime);
    } catch (error) {
      console.log('Seek error:', error);
    }
  };

  const handleSkip = (seconds:number) => {
    if (!playerRef.current) return;
    const newTime = Math.max(0, Math.min(currentTime + seconds, duration));
    try {
      playerRef.current.seekTo(newTime, true);
      setCurrentTime(newTime);
    } catch (error) {
      console.log('Skip error:', error);
    }
  };

  const handlePlaybackRate = (rate:number) => {
    setPlaybackRate(rate);
    if (playerRef.current && typeof playerRef.current.setPlaybackRate === 'function') {
      try {
        playerRef.current.setPlaybackRate(rate);
      } catch (error) {
        console.log('Playback rate error:', error);
      }
    }
    setShowSettings(false);
  };

  const handleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!isFullscreen) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.log('Fullscreen error:', error);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div
        ref={containerRef}
        className={`relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800 transition-all duration-300 ${
          isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : ''
        }`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {/* YouTube Player Container */}
        <div className="relative w-full aspect-video">
          <div
            ref={iframeRef}
            className="w-full h-full"
          />
          
          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Center Play Button Overlay */}
          {!isPlaying && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={handlePlayPause}
                className="group bg-[#FFB400] hover:bg-[#e6a300] rounded-full p-4 sm:p-6 transition-all duration-300 transform hover:scale-110 shadow-2xl"
              >
                <Play className="w-8 h-8 sm:w-12 sm:h-12 text-white ml-0.5 sm:ml-1" fill="currentColor" />
              </button>
            </div>
          )}

          {/* Custom Controls Overlay */}
          <div
            className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 sm:p-6 transition-all duration-300 ${
              showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
            }`}
          >
            {/* Progress Bar */}
            <div className="mb-2 sm:mb-4">
              <div
                className="w-full h-1 sm:h-2 bg-gray-600 rounded-full cursor-pointer hover:h-2 sm:hover:h-3 transition-all duration-200"
                onClick={handleSeek}
              >
                <div
                  className="h-full bg-[#FFB400] rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Control Buttons Row */}
            <div className="flex items-center justify-between">
              {/* Left Controls */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Play/Pause */}
                <button
                  onClick={handlePlayPause}
                  className="bg-[#FFB400] hover:bg-[#e6a300] rounded-full p-2 sm:p-3 transition-all duration-200 transform hover:scale-110"
                  disabled={isLoading}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="currentColor" />
                  ) : (
                    <Play className="w-4 h-4 sm:w-6 sm:h-6 text-white ml-0.5" fill="currentColor" />
                  )}
                </button>

                {/* Skip Buttons */}
                <button
                  onClick={() => handleSkip(-10)}
                  className="bg-gray-700 hover:bg-gray-600 rounded-full p-1.5 sm:p-2 transition-all duration-200"
                >
                  <MdOutlineReplay10 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
                <button
                  onClick={() => handleSkip(10)}
                  className="bg-gray-700 hover:bg-gray-600 rounded-full p-1.5 sm:p-2 transition-all duration-200"
                >
                  <MdOutlineForward10 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>

                {/* Volume Controls */}
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <button
                    onClick={handleVolumeToggle}
                    className="bg-gray-700 hover:bg-gray-600 rounded-full p-1.5 sm:p-2 transition-all duration-200"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    ) : (
                      <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-12 sm:w-20 h-1 sm:h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Time Display */}
                <div className="text-white text-xs sm:text-sm font-mono hidden sm:block">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              {/* Right Controls */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                {/* Settings */}
                <div className="relative">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="bg-gray-700 hover:bg-gray-600 rounded-full p-1.5 sm:p-2 transition-all duration-200"
                  >
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </button>
                  
                  {showSettings && (
                    <div className="absolute bottom-12 right-0 bg-gray-800 rounded-lg p-2 sm:p-3 min-w-28 sm:min-w-32 shadow-lg">
                      <div className="text-white text-xs sm:text-sm font-medium mb-1 sm:mb-2">Speed</div>
                      {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => handlePlaybackRate(rate)}
                          className={`block w-full text-left px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm transition-colors ${
                            playbackRate === rate
                              ? 'bg-[#FFB400] text-white'
                              : 'text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          {rate === 1 ? 'Normal' : `${rate}x`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Fullscreen */}
                <button
                  onClick={handleFullscreen}
                  className="bg-gray-700 hover:bg-gray-600 rounded-full p-1.5 sm:p-2 transition-all duration-200"
                >
                  {isFullscreen ? (
                    <Minimize className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  ) : (
                    <Maximize className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Demo URL Input */}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #FFB400;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #FFB400;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }
        
        .slider::-moz-range-thumb:hover {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
};

export default CustomYouTubePlayer;