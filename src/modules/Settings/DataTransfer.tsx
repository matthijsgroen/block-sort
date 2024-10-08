import { Suspense, use, useMemo, useState } from "react";
import clsx from "clsx";
import jsQR from "jsqr-es6";
import QRCode from "qrcode";

import { TransparentButton } from "@/ui/TransparentButton/TransparentButton";

import info from "@/../package.json";
import { decryptData, encryptData } from "@/support/dataTransfer";
import { getGameValue } from "@/support/useGameStorage";

import { DataFormat, getGameData, setGameData } from "./gameData";

const DATA_VALIDITY_TIME = 10; // minutes

const getEncryptedData = async (): Promise<string> => {
  const data = await getGameData();
  const binaryData = await encryptData(data);
  const url = await QRCode.toDataURL([{ data: binaryData, mode: "byte" }], {
    type: "image/png",
  });
  return url;
};

const importImageData = async (
  file: File
): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
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

            if (data.version !== info.version) {
              return {
                success: false,
                message: `Version mismatch: ${data.version} vs. ${info.version}`,
              };
            }
            if (age > DATA_VALIDITY_TIME) {
              resolve({
                success: false,
                message:
                  Math.ceil(age) > 90
                    ? `Data is too old: ${Math.floor(age / 60)} hours`
                    : `Data is too old: ${Math.ceil(age)} minutes`,
              });
              return;
            }
            const currentLevel = (await getGameValue<number>("levelNr")) ?? 0;
            const importLevel = data.levelNr;

            if (currentLevel > importLevel) {
              if (
                confirm("Import has less progress than current game. Continue?")
              ) {
                await setGameData(data);
              } else {
                resolve({ success: false, message: "Import canceled" });
                return;
              }
            } else {
              await setGameData(data);
            }

            resolve({ success: true, message: "" });
            return;
          } catch (ignoreError) {
            resolve({ success: false, message: "Could not unpack data" });
            return;
          }
        } else {
          resolve({ success: false, message: "Could not read QR code" });
          return;
        }
      } else {
        resolve({ success: false, message: "Could not load image data" });
        return;
      }
    };
    image.src = URL.createObjectURL(file);
  });
};

const DataTransfer: React.FC = () => {
  const [startDownload, setStartDownload] = useState(false);
  const [importErrors, setImportErrors] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<boolean>(false);

  const encryptedData = useMemo(async () => {
    if (startDownload) {
      try {
        return await getEncryptedData();
      } catch (ignoreError) {
        setImportErrors("Could not pack data");
        setStartDownload(false);
        return Promise.resolve("");
      }
    }
    return Promise.resolve("");
  }, [startDownload]);

  const supportsEncryption =
    window.crypto !== undefined && window.TextEncoder && window.crypto.subtle;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold text-lg">
        Data transfer <sup>beta</sup>
      </h2>
      {supportsEncryption ? (
        <>
          {!startDownload && (
            <>
              <p className="text-sm">
                You can export your game data as an image. This image can be
                used to import your game data into another instance of the game.
                The export is valid for{" "}
                <strong>{DATA_VALIDITY_TIME} minutes</strong>, and needs to be
                imported into the same version of the game.
              </p>
              <TransparentButton
                onClick={() => {
                  setStartDownload(true);
                }}
              >
                Export game data
              </TransparentButton>
            </>
          )}
          {startDownload && (
            <Suspense fallback={<div>Packing Data...</div>}>
              <ExportData data={encryptedData} />
            </Suspense>
          )}

          {importErrors && (
            <p className="text-sm text-red-600 font-bold">{importErrors}</p>
          )}
          {importSuccess && (
            <p className="text-sm text-green-900 font-bold">
              Data successfully imported
            </p>
          )}
          <label
            htmlFor="dropzone-file"
            className={clsx(
              "inline-block rounded-full border border-black p-2 shadow-md",
              "text-black",
              "active:scale-90 transition-transform",
              "text-sm px-4 text-center"
            )}
          >
            <p>Import game data</p>
            <input
              id="dropzone-file"
              type="file"
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
              }}
            />
          </label>
        </>
      ) : (
        <p className="text-sm text-red-600 font-bold">
          Your browser does not support encryption, data transfer is disabled
        </p>
      )}
    </div>
  );
};

const ExportData: React.FC<{
  data: Promise<string>;
}> = ({ data }) => {
  const resolved = use(data);

  if (resolved.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center">
      <img src={resolved} width={200} height={200}></img>
      <p className="text-sm pt-2">
        This image contains all your game data. <strong>Long press</strong> to
        download it and upload it to your new game instance (on another device
        or this one). The image will be valid for{" "}
        <strong>{DATA_VALIDITY_TIME} minutes</strong>.
      </p>
    </div>
  );
};

export default DataTransfer;
