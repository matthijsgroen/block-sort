export type LockOrKey<TPairName extends string, TRole = "lock" | "Key"> = {
  name: `${TPairName}-${TRole & string}`;
  pairName: TPairName;
  symbol: string;
  color: string;
  role: TRole;
};

const createLockAndKey = <TPairName extends string>(
  pairName: TPairName,
  color: string,
  lock: string,
  key: string
): [LockOrKey<TPairName, "lock">, LockOrKey<TPairName, "key">] => {
  return [
    {
      name: `${pairName}-lock`,
      pairName,
      symbol: lock,
      color,
      role: "lock"
    },
    {
      name: `${pairName}-key`,
      pairName,
      symbol: key,
      color,
      role: "key"
    }
  ];
};

const [ghost, flashlight] = createLockAndKey("ghost", "#333333", "👻", "🔦");
const [vampire, garlic] = createLockAndKey("vampire", "#666699", "🧛", "🧄");
const [dragon, sword] = createLockAndKey("dragon", "#ff0000", "🐉", "️🗡️");
const [fire, water] = createLockAndKey("fire", "#800080", "🔥", "💧");
const [dinosaur, comet] = createLockAndKey("dinosaur", "#008000", "🦖", "☄️");

export const locks = [ghost, vampire, dragon, fire, dinosaur] as const;
export const keys = [flashlight, garlic, sword, water, comet] as const;

export const lockNKeyPairs = [...locks, ...keys].reduce<string[]>(
  (result, { pairName }) =>
    result.includes(pairName) ? result : result.concat(pairName),
  []
);

export type Lock = (typeof locks)[number]["name"];
export type Key = (typeof keys)[number]["name"];
