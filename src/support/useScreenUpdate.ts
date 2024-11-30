import { useEffect, useState } from "react";

export const useScreenUpdate = () => {
  // Wrap into custom hook
  const [, setRerender] = useState(0);
  useEffect(() => {
    const listener = () => {
      setRerender((r) => (r + 1) % 4);
    };
    window.addEventListener("orientationchange", listener);
    window.addEventListener("resize", listener);
    return () => {
      window.removeEventListener("orientationchange", listener);
      window.removeEventListener("resize", listener);
    };
  }, []);
};
