"use client";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Meteors from "../magicui/meteors";

export default function TransitionOverlay() {
  const pathname = usePathname();
  const [displayOverlay, setDisplayOverlay] = useState(false);
  const [previousPath, setPreviousPath] = useState("/");
  const videoRef = useRef<HTMLVideoElement>(null);

  // Function to check if we should show transition
  const shouldShowTransition = (currentPath: string) => {
    // Split paths into segments
    const currentSegments = currentPath.split('/').filter(Boolean);
    // Show transition when navigating TO:
    // 1. Root route (/) - from any route
    // 2. Single nested routes (/about, /videos, etc.) - from any route
    // Don't show when navigating TO deeper nested routes (like /videos/1, /videos/2, etc.)
    return (
      currentSegments.length === 0 || // Going TO root (/)
      currentSegments.length === 1    // Going TO single nested route (/about, /videos, etc.)
    );
  };

  useEffect(() => {
    // Check if we should show the transition
    if (shouldShowTransition(pathname)) {
      setDisplayOverlay(true);
      const timer = setTimeout(() => setDisplayOverlay(false), 2000);
      
      // Update previous path after checking
      setPreviousPath(pathname);
      
      return () => clearTimeout(timer);
    } else {
      // Just update the previous path without showing overlay
      setPreviousPath(pathname);
    }
  }, [pathname,previousPath]);

  useEffect(() => {
    if (videoRef.current && displayOverlay) {
      // Reset video to beginning and play
      videoRef.current.currentTime = 0;
      videoRef.current.load();
      
      const playTimer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(err => {
            console.log("Autoplay blocked:", err);
          });
        }
      }, 100);

      return () => clearTimeout(playTimer);
    }
  }, [displayOverlay]);

  return (
    <>
      <style jsx>{`
        @keyframes glow {
          0% {
            filter: drop-shadow(0 0 0px #FFB400);
          }
          
          50%{
            filter: drop-shadow(0 0 10px #FFB400);
          }
          
          100% {
            filter: drop-shadow(0 0 30px #FFB400);
          }
        }
      `}</style>

      <AnimatePresence mode="wait">
        {displayOverlay && (
          <motion.div
            key={pathname}
            initial={{ y: ["100%","50%","100%"] }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-50 bg-[#201701]"
          >
            <Meteors number={20} angle={224} minDuration={0.2}/>
            <video 
              key={pathname}
              ref={videoRef} 
              muted 
              autoPlay 
              playsInline
              preload="auto"
              className="absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] z-40 animate-[glow_1s_forwards]"
            >
              <source src="logo.webm" type="video/webm"/>
              <source src="logo.mp4" type="video/mp4"/>
            </video>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}