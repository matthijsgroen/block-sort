import { useState, useTransition } from "react";
import clsx from "clsx";
import jsQR from "jsqr-es6";
import QRCode from "qrcode";

import { TransparentButton } from "@/ui/TransparentButton/TransparentButton";

import { version } from "@/../package.json";
import { decryptData, encryptData } from "@/support/dataTransfer";
import { useWakeLock } from "@/support/useWakeLock";

import type { DataFormat } from "./gameData";
import { getGameData, setGameData } from "./gameData";

const DATA_VALIDITY_TIME = 10; // minutes

const getEncryptedData = async (): Promise<string> => {
  const data = await getGameData();
  const binaryData = await encryptData(data);
  const url = await QRCode.toDataURL([{ data: binaryData, mode: "byte" }], {
    type: "image/png"
  });
  return url;
};

const importImageData = async (
  file: File
): Promise<{ success: boolean; message: string }> =>
  new Promise((resolve) => {
    const image = new Image();
    image.onload = async () => {
      // Create a canvas element
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;

      // Get the 2D drawing context
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Draw the image onto the canvas
        ctx.drawImage(image, 0, 0);

        // Get the ImageData object
        const imageData = ctx.getImageData(0, 0, image.width, image.height);
        const code = jsQR(imageData.data, image.width, image.height);
        if (code) {
          try {
            const data = await decryptData<DataFormat>(
              new Uint8Array(code.binaryData)
            );

            const age = (new Date().getTime() - data.timestamp) / 60_000;

            if (data.version !== version) {
              return resolve({
                success: false,
                message: `Version mismatch: ${data.version} vs. ${version}`
              });
            }
            if (age < 0 || data.time !== data.timestamp) {
              return resolve({
                success: false,
                message: "Data is invalid"
              });
            }
            if (age > DATA_VALIDITY_TIME) {
              return resolve({
                success: false,
                message:
                  Math.ceil(age) > 90
                    ? `Data is too old: ${Math.floor(age / 60)} hours`
                    : `Data is too old: ${Math.ceil(age)} minutes`
              });
            }
            const importLevel = data.l;
            if (
              confirm(
                `You are about to import data\nat level ${importLevel + 1}. Continue?`
              )
            ) {
              await setGameData(data);
            } else {
              return resolve({ success: false, message: "Import canceled" });
            }

            return resolve({ success: true, message: "" });
          } catch (ignoreError) {
            return resolve({
              success: false,
              message: "Could not unpack data"
            });
          }
        } else {
          return resolve({ success: false, message: "Could not read QR code" });
        }
      } else {
        return resolve({
          success: false,
          message: "Could not load image data"
        });
      }
    };
    image.src = URL.createObjectURL(file);
  });

const DataTransfer: React.FC = () => {
  const [importErrors, setImportErrors] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<boolean>(false);
  const [fileInputKey, setFileInputKey] = useState(0);
  const { requestWakeLock, releaseWakeLock } = useWakeLock();

  const [isPending, startTransition] = useTransition();
  const [encryptedData, setEncryptedDataPromise] = useState<string | null>(
    null
  );

  const handleData = () =>
    startTransition(async () => {
      try {
        const data = await getEncryptedData();
        setEncryptedDataPromise(data);
      } catch (ignoreError) {
        setImportErrors("Could not pack data");
        releaseWakeLock();
      }
    });

  const supportsEncryption =
    window.crypto !== undefined && window.TextEncoder && window.crypto.subtle;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold">Transfer game data</h2>
      {supportsEncryption ? (
        <>
          {!isPending && encryptedData === null && (
            <>
              <p className="text-sm">
                You can transfer your game data to another instance of the game
                through an image. The export is valid for{" "}
                <strong>{DATA_VALIDITY_TIME} minutes</strong>, and needs to be
                imported into the same version ({version}) of the game.
              </p>
              <p className="text-sm">This is not meant to act as a backup.</p>
              <TransparentButton
                onClick={() => {
                  handleData();
                  requestWakeLock();
                }}
              >
                Export game data
              </TransparentButton>
            </>
          )}
          {isPending && <p>Packing data...</p>}
          {encryptedData && <ExportData data={encryptedData} />}

          {importErrors && (
            <p className="text-sm font-bold text-red-600">{importErrors}</p>
          )}
          {importSuccess && (
            <p className="text-sm font-bold text-green-900">
              Data successfully imported
            </p>
          )}
          <label
            htmlFor="dropzone-file"
            className={clsx(
              "inline-block rounded-full border border-black p-2 shadow-md",
              "text-black",
              "transition-transform active:scale-90",
              "px-4 text-center text-sm"
            )}
          >
            <p>Import game data</p>
            <input
              id="dropzone-file"
              type="file"
              key={fileInputKey}
              className="hidden"
              onChange={async (event) => {
                setImportSuccess(false);

                const file = event.target.files?.[0];
                if (file) {
                  const { success, message } = await importImageData(file);
                  setImportSuccess(success);
                  setImportErrors(message);
                } else {
                  setImportErrors("No file selected");
                }
                setFileInputKey((v) => (v + 1) % 5);
              }}
            />
          </label>
        </>
      ) : (
        <p className="text-sm font-bold text-red-600">
          Your browser does not support encryption, data transfer is disabled
        </p>
      )}
    </div>
  );
};

const ExportData: React.FC<{
  data: string;
}> = ({ data }) => {
  return (
    <div className="flex flex-col items-center">
      <img
        src={data}
        width={200}
        height={200}
        className="[-webkit-touch-callout:default]"
      ></img>
      <p className="pt-2 text-sm">
        This image contains all your game data. <strong>Long press</strong> to
        download it and upload it to your new game instance (on another device
        or this one). The image will be valid for{" "}
        <strong>{DATA_VALIDITY_TIME} minutes</strong>.
      </p>
    </div>
  );
};

export default DataTransfer;
