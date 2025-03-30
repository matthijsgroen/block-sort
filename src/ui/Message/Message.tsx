import clsx from "clsx";

import { Block } from "../Block/Block";

import { useDelay } from "./useDelay";

import styles from "./Message.module.css";

type InvisibleMessageProps = {
  delay?: number;
  afterShow?: VoidFunction;
  onShow?: VoidFunction;
};

type MessageProps = {
  message: string;
  color: string;
  shape?: string;
} & InvisibleMessageProps;

export const InvisibleMessage: React.FC<InvisibleMessageProps> = ({
  afterShow,
  onShow,
  delay = 0
}) => {
  useDelay(delay, 3000, onShow, afterShow);

  return null;
};

export const Message: React.FC<MessageProps> = ({
  message,
  afterShow,
  onShow,
  delay = 0,
  shape = "❤️",
  color = "green"
}) => {
  const started = useDelay(delay, 3000, onShow, afterShow);

  return started ? (
    <div
      className="absolute z-50 h-full w-full"
      style={{ "--cube-color": color }}
    >
      <div className="absolute h-full w-full animate-fadeIn bg-gradient-to-b from-transparent via-slate-700 via-30% to-transparent opacity-0"></div>
      <div className="absolute left-1/2 top-[46%] animate-flyTopLeft">
        <Block
          color={color}
          shape={shape}
          moved={false}
          revealed={true}
          shadow={false}
        />
      </div>
      <div className="absolute left-1/2 top-[46%] animate-flyTopRight">
        <Block
          color={color}
          shape={shape}
          moved={false}
          revealed={true}
          shadow={false}
        />
      </div>
      <div className="absolute left-1/2 top-[46%] animate-flyBottomRight">
        <Block
          color={color}
          shape={shape}
          moved={false}
          revealed={true}
          shadow={false}
        />
      </div>
      <div className="absolute left-1/2 top-[46%] animate-flyBottomLeft">
        <Block
          color={color}
          shape={shape}
          moved={false}
          revealed={true}
          shadow={false}
        />
      </div>
      <div className="absolute left-1/2 top-1/3 animate-popInOut">
        <span
          className={clsx(
            styles.shape,
            "block bg-block bg-clip-text text-transparent"
          )}
        >
          {shape}
        </span>
      </div>
      <div className="absolute top-[45%] w-full animate-popInOut">
        <div
          className={
            "mx-auto w-1/2 max-w-[500px] rounded-full bg-block px-6 py-3 drop-shadow-xl"
          }
        >
          <h1 className="text-center text-2xl font-bold text-white">
            {message}
          </h1>
        </div>
      </div>
    </div>
  ) : null;
};
