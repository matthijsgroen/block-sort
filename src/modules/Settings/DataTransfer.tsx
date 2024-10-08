import { Suspense, use, useMemo, useState } from "react";
import clsx from "clsx";
import jsQR from "jsqr-es6";
import QRCode from "qrcode";

import { TransparentButton } from "@/ui/TransparentButton/TransparentButton";

import info from "@/../package.json";
import { decryptData, encryptData } from "@/support/dataTransfer";

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

const DataTransfer: React.FC = () => {
  const [startDownload, setStartDownload] = useState(false);
  const [importErrors, setImportErrors] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<boolean>(false);

  const encryptedData = useMemo(() => {
    if (startDownload) {
      try {
        return getEncryptedData();
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
      <h2 className="font-bold text-lg">Data transfer</h2>
      {supportsEncryption ? (
        <>
          <p className="text-xs text-red-600 font-bold">
            Warning: This feature is experimental and may not work as expected.
            Please only import data into a blank new game.
          </p>
          {!startDownload && (
            <>
              <p className="text-xs">
                You can export your game data as an image. This image can be
                used to import your game data into another instance of the game.
                The export is valid for {DATA_VALIDITY_TIME} minutes, and needs
                to be imported into the same version of the game.
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
              onChange={(event) => {
                const file = event.target.files?.[0];
                setImportSuccess(false);
                if (file) {
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
                      const imageData = ctx.getImageData(
                        0,
                        0,
                        image.width,
                        image.height
                      );
                      const code = jsQR(
                        imageData.data,
                        image.width,
                        image.height
                      );
                      if (code) {
                        try {
                          const data = await decryptData<DataFormat>(
                            new Uint8Array(code.binaryData)
                          );

                          const age =
                            (new Date().getTime() - data.timestamp) / 60_000;

                          if (data.version !== info.version) {
                            setImportErrors(
                              `Version mismatch: ${data.version} vs. ${info.version}`
                            );
                            return;
                          }
                          if (age > DATA_VALIDITY_TIME) {
                            setImportErrors(
                              `Data is too old: ${Math.ceil(age)} minutes`
                            );
                            return;
                          }

                          await setGameData(data);
                          setImportSuccess(true);
                        } catch (ignoreError) {
                          setImportErrors("Could not unpack data");
                        }
                      } else {
                        setImportErrors("Could not read QR code");
                      }
                    } else {
                      setImportErrors("Could not load image data");
                    }
                  };
                  image.src = URL.createObjectURL(file);
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
        or this one). The image will be valid for {DATA_VALIDITY_TIME} minutes.
      </p>
    </div>
  );
};

export default DataTransfer;
