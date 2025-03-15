export type LockOrKey<TPairName extends string, TRole = "lock" | "Key"> = {
  name: `${TPairName}-${TRole & string}`;
  pairName: TPairName;
  symbol: string;
  color: string;
  role: TRole;
};

const ghost: LockOrKey<"ghost", "lock"> = {
  name: "ghost-lock",
  pairName: "ghost",
  symbol: "👻",
  color: "#333333",
  role: "lock"
};

const flashlight: LockOrKey<"ghost", "key"> = {
  name: "ghost-key",
  pairName: "ghost",
  symbol: "🔦",
  color: "#333333",
  role: "key"
};

const vampire: LockOrKey<"vampire", "lock"> = {
  name: "vampire-lock",
  pairName: "vampire",
  symbol: "🧛",
  color: "#666699",
  role: "lock"
};

const garlic: LockOrKey<"vampire", "key"> = {
  name: "vampire-key",
  pairName: "vampire",
  symbol: "🧄",
  color: "#666699",
  role: "key"
};

const dragon: LockOrKey<"dragon", "lock"> = {
  name: "dragon-lock",
  pairName: "dragon",
  symbol: "🐉",
  color: "#ff0000",
  role: "lock"
};

const sword: LockOrKey<"dragon", "key"> = {
  name: "dragon-key",
  pairName: "dragon",
  symbol: "️🗡️",
  color: "#ff0000",
  role: "key"
};

const fire: LockOrKey<"fire", "lock"> = {
  name: "fire-lock",
  pairName: "fire",
  symbol: "🔥",
  color: "#800080",
  role: "lock"
};

const water: LockOrKey<"fire", "key"> = {
  name: "fire-key",
  pairName: "fire",
  symbol: "💧",
  color: "#800080",
  role: "key"
};

const dinosaur: LockOrKey<"dinosaur", "lock"> = {
  name: "dinosaur-lock",
  pairName: "dinosaur",
  symbol: "🦖",
  color: "#008000",
  role: "lock"
};

const comet: LockOrKey<"dinosaur", "key"> = {
  name: "dinosaur-key",
  pairName: "dinosaur",
  symbol: "☄️",
  color: "#008000",
  role: "key"
};

export const locks = [ghost, vampire, dragon, fire, dinosaur] as const;
export const keys = [flashlight, garlic, sword, water, comet] as const;

export const lockNKeyPairs = [...locks, ...keys].reduce<string[]>(
  (result, { pairName }) =>
    result.includes(pairName) ? result : result.concat(pairName),
  []
);

export type Lock = (typeof locks)[number]["name"];
export type Key = (typeof keys)[number]["name"];
