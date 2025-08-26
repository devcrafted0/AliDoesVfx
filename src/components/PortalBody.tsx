"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function BodyPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // ensure document is available on client
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
}