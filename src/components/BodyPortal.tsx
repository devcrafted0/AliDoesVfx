import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface BodyPortalProps {
  children: ReactNode;
}

const BodyPortal: React.FC<BodyPortalProps> = ({ children }) => {
  const elRef = useRef<HTMLDivElement | null>(null);

  if (!elRef.current) {
    elRef.current = document.createElement("div"); // create a container div
  }

  useEffect(() => {
    const el = elRef.current!;
    document.body.appendChild(el);
    return () => {
      document.body.removeChild(el);
    };
  }, []);

  return createPortal(children, elRef.current);
};

export default BodyPortal;
