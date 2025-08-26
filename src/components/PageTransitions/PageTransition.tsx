"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{
          opacity: 0,
          y: 50,
          scale: 0.95,
          filter: "blur(12px)",
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        }}
        exit={{
          opacity: 0,
          y: -50,
          scale: 0.95,
          filter: "blur(12px)",
        }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1], // smooth cubic-bezier
        }}
        className="min-h-screen w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
