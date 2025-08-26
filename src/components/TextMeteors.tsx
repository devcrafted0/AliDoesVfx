"use client"

import { motion } from "framer-motion";
import Meteors from "./magicui/meteors";

export function TextMeteors({text}:{text : string}) {
  return (
    <div className="relative flex h-[400px] w-full flex-col items-center overflow-hidden rounded-lg">
      <Meteors number={30} />
      <motion.span className="text-[clamp(3rem,5vw,4rem)] mt-20 pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-[#FFB400] to-[#FFB400]-300/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:text-[#FFB400] dark:to-slate-900/10"

      initial={{ y: -50, filter: "blur(8px)", opacity: 0 }}
      animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}

      >
        {text}
      </motion.span>
    </div>
  );
}