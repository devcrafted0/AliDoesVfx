"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Meteors from "../magicui/meteors";

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
              <video ref={videoRef} muted autoPlay className="absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] z-40 animate-[glow_1s_forwards]">
                <source src="logo.webm" type="video/webm"/>
              </video>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}