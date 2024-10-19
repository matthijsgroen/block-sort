import { BSON } from "bson";
import pako from "pako";

export const base64encode = (data: ArrayBuffer): string =>
  btoa(String.fromCharCode(...new Uint8Array(data)));

const SALT = new Uint8Array([
  201, 65, 78, 16, 206, 35, 68, 235, 32, 50, 197, 104, 172, 225, 144, 45
]);

const makeKey = async (password: string): Promise<CryptoKey> => {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );
  return await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: SALT,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-CTR", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
};

export const encryptData = async <T>(data: T): Promise<Uint8Array> => {
  const now = new Date().getTime();
  const bytes = BSON.serialize({ ...data, time: now });
  const compressed = pako.deflate(bytes);

  const password = `${now}`;
  const key = await makeKey(password);
  const cipherText = await crypto.subtle.encrypt(
    { name: "AES-CTR", counter: SALT, length: 64 },
    key,
    compressed
  );
  return BSON.serialize({ now, data: new Uint8Array(cipherText) });
};

export const decodeData = (data: string): Uint8Array => {
  const binString = atob(data);
  return Uint8Array.from(binString, (m) => m.codePointAt(0)!);
};

export const decryptData = async <T>(
  input: Uint8Array
): Promise<T & { timestamp: number; time: number }> => {
  const { now, data } = BSON.deserialize(input);

  const key = await makeKey(`${now}`);

  const binaryData = await crypto.subtle.decrypt(
    { name: "AES-CTR", counter: SALT, length: 64 },
    key,
    data.buffer
  );

  const inflate = pako.inflate(binaryData);
  const result = BSON.deserialize(new Uint8Array(inflate));
  return { ...result, timestamp: now } as unknown as T & {
    timestamp: number;
    time: number;
  };
};
