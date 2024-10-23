import { useEffect, useState } from "react";

type States = "grin" | "smile" | "think" | "yawn" | "sleep";

export const SmileyDefault = () => {
  const [state, setState] = useState<States>("grin");
  const [winkCount, setWinkCount] = useState(0);

  const characters: Record<States, string> = {
    grin: "😀",
    smile: "🙂",
    sleep: "😴",
    yawn: "🥱",
    think: "🤔"
  };

  useEffect(() => {
    if (state === "grin") {
      const cleanup = setTimeout(() => {
        setState("think");
        setWinkCount((c) => c + 1);
      }, 15_000);
      return () => {
        clearTimeout(cleanup);
      };
    }
    if (state === "think") {
      const cleanup = setTimeout(() => {
        if (winkCount > 2) {
          setState("smile");
          setWinkCount(0);
        } else {
          setState("grin");
        }
      }, 1_000);
      return () => {
        clearTimeout(cleanup);
      };
    }
    if (state === "smile") {
      const cleanup = setTimeout(() => {
        setState("yawn");
        setWinkCount((c) => c + 1);
      }, 15_000);
      return () => {
        clearTimeout(cleanup);
      };
    }
    if (state === "yawn") {
      const cleanup = setTimeout(() => {
        if (winkCount > 2) {
          setState("sleep");
        } else {
          setState("smile");
        }
      }, 1_000);
      return () => {
        clearTimeout(cleanup);
      };
    }
  }, [state]);

  return (
    <span
      className="inline-block scale-150"
      onClick={() => {
        setState("grin");
        setWinkCount(0);
      }}
    >
      {characters[state]}
    </span>
  );
};
