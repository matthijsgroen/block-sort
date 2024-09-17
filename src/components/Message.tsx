import { useEffect, useState } from "react";

type Props = {
  message: string;
  color: string;
  afterShow?: VoidFunction;
};

export const Message: React.FC<Props> = ({ message, afterShow }) => {
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setStarted(true);
    }, 2000);
    return () => clearTimeout(timeOut);
  }, []);

  useEffect(() => {
    if (started) {
      const timeOut = setTimeout(() => {
        afterShow?.();
      }, 4000);
      return () => clearTimeout(timeOut);
    }
  }, [started]);

  return (
    <div className="z-50 absolute w-full h-full">
      {started && (
        <>
          <div className="absolute w-full h-full bg-slate-700/60 opacity-0 animate-fadeIn"></div>
          <div className="absolute top-1/3 w-full animate-popInOut">
            <div className="bg-green-700 px-6 py-3 rounded-full drop-shadow-xl w-1/2 mx-auto">
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