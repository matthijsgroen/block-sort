import { useEffect, useState } from "react";
import clsx from "clsx";

import { Block } from "../Block/Block";

import styles from "./Message.module.css";

type Props = {
  message: string;
  color: string;
  shape?: string;
  delay?: number;
  afterShow?: VoidFunction;
  onShow?: VoidFunction;
};

export const Message: React.FC<Props> = ({
  message,
  afterShow,
  onShow,
  delay = 0,
  shape = "❤️",
  color = "green",
}) => {
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setStarted(true);
      onShow?.();
    }, delay);
    return () => clearTimeout(timeOut);
  }, [delay]);

  useEffect(() => {
    if (started) {
      const timeOut = setTimeout(() => {
        afterShow?.();
      }, 3000);
      return () => clearTimeout(timeOut);
    }
  }, [started]);

  return (
    <div
      className="z-50 absolute w-full h-full"
      style={{ "--cube-color": color }}
    >
      {started && (
        <>
          <div className="absolute w-full h-full bg-gradient-to-b from-transparent to-transparent via-30% via-slate-700 opacity-0 animate-fadeIn"></div>
          <div className="absolute top-[46%] left-1/2 animate-flyTopLeft">
            <Block
              color={color}
              shape={shape}
              moved={false}
              revealed={true}
              shadow={false}
            />
          </div>
          <div className="absolute top-[46%] left-1/2 animate-flyTopRight">
            <Block
              color={color}
              shape={shape}
              moved={false}
              revealed={true}
              shadow={false}
            />
          </div>
          <div className="absolute top-[46%] left-1/2 animate-flyBottomRight">
            <Block
              color={color}
              shape={shape}
              moved={false}
              revealed={true}
              shadow={false}
            />
          </div>
          <div className="absolute top-[46%] left-1/2 animate-flyBottomLeft">
            <Block
              color={color}
              shape={shape}
              moved={false}
              revealed={true}
              shadow={false}
            />
          </div>
          <div className="absolute top-1/3 left-1/2 animate-popInOut">
            <span
              className={clsx(
                styles.shape,
                "block bg-block text-transparent bg-clip-text"
              )}
            >
              {shape}
            </span>
          </div>
          <div className="absolute top-[45%] w-full animate-popInOut">
            <div
              className={
                "bg-block px-6 py-3 rounded-full drop-shadow-xl w-1/2 max-w-[500px] mx-auto"
              }
            >
              <h1 className="font-bold text-2xl text-center text-white">
                {message}
              </h1>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
