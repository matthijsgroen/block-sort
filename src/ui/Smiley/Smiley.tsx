import { useEffect, useState } from "react";

type States = "grin" | "smile" | "wink" | "yawn" | "sleep";

export const Smiley = () => {
  const [state, setState] = useState<States>("grin");
  const [winkCount, setWinkCount] = useState(0);

  const characters: Record<States, string> = {
    grin: "😀",
    smile: "🙂",
    sleep: "😴",
    yawn: "🥱",
    wink: "😉",
  };

  useEffect(() => {
    if (state === "grin") {
      const cleanup = setTimeout(() => {
        setState("wink");
        setWinkCount((c) => c + 1);
      }, 20_000);
      return () => {
        clearTimeout(cleanup);
      };
    }
    if (state === "wink") {
      const cleanup = setTimeout(() => {
        if (winkCount === 2) {
          setState("smile");
          setWinkCount(0);
        } else {
          setState("grin");
        }
      }, 500);
      return () => {
        clearTimeout(cleanup);
      };
    }
    if (state === "smile") {
      const cleanup = setTimeout(() => {
        setState("yawn");
        setWinkCount((c) => c + 1);
      }, 20_000);
      return () => {
        clearTimeout(cleanup);
      };
    }
    if (state === "yawn") {
      const cleanup = setTimeout(() => {
        if (winkCount === 2) {
          setState("sleep");
        } else {
          setState("smile");
        }
      }, 500);
      return () => {
        clearTimeout(cleanup);
      };
    }
  }, [state]);

  return <span className="inline-block scale-150">{characters[state]}</span>;
};
