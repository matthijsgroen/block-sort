import type { FC } from "react";
import { Suspense, use } from "react";
import QRCode from "qrcode";

import { TransparentButton } from "@/ui/TransparentButton/TransparentButton";

type Props = {
  onBack: VoidFunction;
};

const LazyQRCode: FC<{ url: Promise<string> }> = ({ url }) => {
  const dataUrl = use(url);
  return (
    <img
      className="h-48 w-48 rounded-3xl [-webkit-touch-callout:default]"
      src={dataUrl}
      alt="QR code for sharing the game"
    />
  );
};

const encoder = new TextEncoder();

export const ShareGame: FC<Props> = ({ onBack }) => {
  const url = QRCode.toDataURL(
    [
      {
        data: encoder.encode("https://matthijsgroen.github.io/block-sort/"),
        mode: "byte"
      }
    ],
    {
      type: "image/png",
      color: {
        dark: "#000000",
        light: "#ffffff80"
      }
    }
  );

  return (
    <div className="flex flex-col gap-3 pb-4">
      <TransparentButton onClick={onBack} icon="arrow_back">
        Back
      </TransparentButton>
      <p className="text-sm">Thank you for sharing the game with others!</p>
      {"share" in navigator && (
        <>
          <TransparentButton
            size="large"
            onClick={async () => {
              try {
                await navigator.share({
                  title: "Block Sort",
                  url: "https://matthijsgroen.github.io/block-sort/",
                  text: "A block sorting puzzle game, without ads or tracking. Becomes very challenging, with different level types and seasonal themes."
                });
              } catch (ignoreError) {
                // Nothing to do, user probably canceled the share
              }
            }}
            icon="group"
          >
            Share as message
          </TransparentButton>
          <p className="text-sm">or, let others scan this QR!</p>
        </>
      )}
      <div className="flex justify-center">
        <Suspense
          fallback={
            <div className="h-48 w-48 rounded-3xl bg-gray-300/50"></div>
          }
        >
          <LazyQRCode url={url} />
        </Suspense>
      </div>
    </div>
  );
};
