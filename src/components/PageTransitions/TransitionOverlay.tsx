"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function TransitionOverlay() {
  const pathname = usePathname();
  const [displayOverlay, setDisplayOverlay] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Trigger overlay each time pathname changes
    setDisplayOverlay(true);
    const timer = setTimeout(() => setDisplayOverlay(false), 2000); // match duration
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.log("Autoplay blocked:", err);
      });
    }
  }, []);

  return (
    <>
      <style jsx>{`
        @keyframes glow {
          0% {
            filter: drop-shadow(0 0 2px #FFB400);
          }
          100% {
            filter: drop-shadow(0 0 20px #FFB400);
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
            className="fixed inset-0 z-50 bg-[#201701] flex justify-center items-center"
          >
          <video ref={videoRef} muted autoPlay className="animate-[glow_1s_forwards]" >
            <source src="logo.webm" type="video/webm"/> 
            <source src="logo.mov" type="video/quicktime"/> 
          </video>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}