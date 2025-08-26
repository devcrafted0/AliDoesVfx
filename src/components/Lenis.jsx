"use client";
import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";

export default function SmoothScroll({ children }) {
  // Optional: hook into Lenis instance
  const lenis = useLenis((lenis) => {
    // Called on every scroll event
    // console.log(lenis.scroll);
  });

  useEffect(() => {
    if (lenis) {
      // You can control Lenis programmatically
      // lenis.scrollTo(500); // example: scroll to 500px
    }
  }, [lenis]);

  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth ease-out
        smoothWheel: true,
        smoothTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
