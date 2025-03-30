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
const [lock, key] = createLockAndKey("locked", "#2a2627", "🔒", "️🗝️");
const [robot, lightning] = createLockAndKey("robot", "#a684ff", "🤖", "️️⚡️");

export const locks = [
  lock,
  fire,
  ghost,
  vampire,
  robot,
  dinosaur,
  dragon
] as const;

export const keys = [
  key,
  water,
  flashlight,
  garlic,
  lightning,
  comet,
  sword
] as const;

export const lockNKeyPairs = [...locks, ...keys].reduce<string[]>(
  (result, { pairName }) =>
    result.includes(pairName) ? result : result.concat(pairName),
  []
);

export type Lock = (typeof locks)[number]["name"];
export type Key = (typeof keys)[number]["name"];
