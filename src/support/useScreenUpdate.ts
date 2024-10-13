import { useEffect, useState } from "react";

export const useScreenUpdate = () => {
  // Wrap into custom hook
  const [, setRerender] = useState(0);
  useEffect(() => {
    const listener = () => {
      setRerender((r) => (r + 1) % 2);
    };
    window.addEventListener("orientationchange", listener);
    return () => {
      window.removeEventListener("orientationchange", listener);
    };
  }, []);
  useEffect(() => {
    const listener = () => {
      setRerender((r) => (r + 1) % 2);
    };
    window.addEventListener("resize", listener);
    return () => {
      window.removeEventListener("resize", listener);
    };
  }, []);
};
