import type { Meta, StoryObj } from "@storybook/react-vite";

import type { BlockTheme } from "@/game/themes";
import { BASE_SEED } from "@/modules/GameModi/constants";
import { generateNewSeed, mulberry32 } from "@/support/random";
import { stringUnionToArray } from "@/support/unionToArray";

import type { LevelMeta } from ".";
import { getLevelMeta } from ".";

const meta: Meta = {
  title: "BlockSort/LevelTypes",
  parameters: {
    layout: "fullscreen"
  },
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

type RangeRow = {
  from: number;
  to: number;
  meta: LevelMeta;
};

const mergeIntoRanges = (
  from: number,
  to: number,
  theme: BlockTheme
): RangeRow[] => {
  const rows: RangeRow[] = [];
  let current: RangeRow | null = null;

  for (let levelNr = from; levelNr <= to; levelNr++) {
    const random = mulberry32(generateNewSeed(BASE_SEED, levelNr));
    const m = getLevelMeta(levelNr, theme, random);
    const key = `${m.levelType.type}|${m.producerName ?? ""}|${m.producerDifficulty ?? ""}`;
    const prevKey = current
      ? `${current.meta.levelType.type}|${current.meta.producerName ?? ""}|${current.meta.producerDifficulty ?? ""}`
      : null;

    if (current && key === prevKey) {
      current.to = levelNr;
    } else {
      if (current) rows.push(current);
      current = { from: levelNr, to: levelNr, meta: m };
    }
  }
  if (current) rows.push(current);
  return rows;
};

const LevelTypeTable = ({
  from,
  to,
  theme
}: {
  from: number;
  to: number;
  theme: BlockTheme;
}) => {
  const rows = mergeIntoRanges(from, to, theme);

  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-bold text-white">
        Level Type Distribution (levels {from}–{to}, theme: {theme})
      </h1>
      <table className="w-full border-collapse text-sm text-white">
        <thead>
          <tr className="border-b border-gray-600 text-left">
            <th className="px-3 py-2">Level Range</th>
            <th className="px-3 py-2">Type</th>
            <th className="px-3 py-2">Producer</th>
            <th className="px-3 py-2">Difficulty</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const { levelType, producerName, producerDifficulty } = row.meta;
            const range =
              row.from === row.to ? `${row.from}` : `${row.from}–${row.to}`;
            return (
              <tr
                key={i}
                className="border-b border-gray-700 even:bg-white/5 hover:bg-white/10"
              >
                <td className="px-3 py-1 tabular-nums">{range}</td>
                <td className="px-3 py-1">
                  <span
                    className={`font-semibold ${levelType.textClassName ?? "text-white"}`}
                  >
                    {levelType.symbol ?? ""} {levelType.name}
                  </span>
                </td>
                <td className="px-3 py-1 text-gray-300">
                  {producerName ?? "—"}
                </td>
                <td className="px-3 py-1 tabular-nums text-gray-300">
                  {producerDifficulty ?? "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export const LevelTypeBreakdown: Story = {
  args: {
    from: 1,
    to: 300,
    theme: "default"
  },
  argTypes: {
    from: { control: { type: "number", min: 1, max: 2000, step: 1 } },
    to: { control: { type: "number", min: 1, max: 2000, step: 1 } },
    theme: {
      options: stringUnionToArray<BlockTheme>()(
        "default",
        "halloween",
        "winter",
        "spring",
        "summer"
      ),
      control: "select"
    }
  },
  render: ({ from, to, theme }) => (
    <LevelTypeTable
      from={from as number}
      to={to as number}
      theme={theme as BlockTheme}
    />
  )
};
