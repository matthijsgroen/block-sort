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
  symbol: "🧛🏻‍♂️",
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

export const lockNKey = [ghost, flashlight, vampire, garlic] as const;
export const lockNKeyPairs = lockNKey.reduce<string[]>(
  (result, { pairName }) =>
    result.includes(pairName) ? result : result.concat(pairName),
  []
);

export type LockNKeyBlocks = (typeof lockNKey)[number]["name"];
