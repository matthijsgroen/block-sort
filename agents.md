# Block Sort – Agent Guide

This file provides AI coding agents with the context needed to work effectively on this codebase.

## Project Overview

**Block Sort** is a mobile-first browser puzzle game distributed as a **Progressive Web App (PWA)**, live at `https://matthijsgroen.github.io/block-sort/`. Players sort stacked coloured blocks into columns so each column contains only one colour. A column is "locked" (completed) when it is full of a single colour.

Key features:

- **Normal Mode** – sequential levels with increasing difficulty
- **Zen Mode** – free-play with user-chosen level type and difficulty
- **7 level types**: Normal, Hard (hidden blocks), Special, Easy, Scrambled, Dungeon (locks & keys), Hot (multi-stage)
- **Seasonal themes** – Halloween, Winter, Spring, Summer activated by calendar date
- **Procedural level generation** with an AI solver that verifies every level is beatable
- **Pre-generated seed caches** (`src/data/levelSeeds.ts`) so mobile devices skip the solver at load time

---

## Tech Stack

| Concern            | Technology                                                                                    |
| ------------------ | --------------------------------------------------------------------------------------------- |
| UI Framework       | React (`use()` hook for context/promises)                                                     |
| Language           | TypeScript (strict mode)                                                                      |
| Build tool         | Vite                                                                                          |
| CSS                | Tailwind CSS + PostCSS + CSS Modules for animation-heavy components                           |
| State              | React `useState`/`useEffect` + custom `useOfflineStorage` backed by `localforage` (IndexedDB) |
| Immutability       | Immer (`produce`) for all game-state mutations                                                |
| PWA                | `vite-plugin-pwa` (Workbox service worker)                                                    |
| Testing            | Vitest + jsdom + @testing-library/react + @testing-library/jest-dom                           |
| Component Explorer | Storybook                                                                                     |
| Linting            | ESLint (TypeScript-ESLint, react-compiler, simple-import-sort, unused-imports, prettier)      |
| Formatting         | Prettier + `prettier-plugin-tailwindcss`                                                      |
| Package manager    | Yarn (PnP / Zero-installs)                                                                    |
| Persistence        | `localforage` abstracted behind `useOfflineStorage` pub/sub hook                              |
| PRNG               | Custom `mulberry32` seeded PRNG (`src/support/random.ts`)                                     |
| Data encoding      | BSON + pako (deflate) + AES-CTR (Web Crypto API) for game-save export/import                  |
| QR codes           | `qrcode` (generate) + `jsqr-es6` (scan) for sharing game saves                                |
| Worker threads     | Node.js `worker_threads` for parallel offline seed generation                                 |
| CLI tools          | `commander` + `tsx` for bin scripts                                                           |

---

## Directory Structure

```
/
├── src/
│   ├── App.tsx                    # Root component; wires all top-level providers and modes
│   ├── main.tsx                   # ReactDOM entry point
│   ├── featureFlags.ts            # Boolean feature flags (ZEN_MODE, THEMES)
│   ├── audio.ts                   # Audio system wiring (sound items + streams)
│   │
│   ├── game/                      # Pure game logic — NO React dependencies
│   │   ├── types.ts               # ALL domain types; single source of truth
│   │   ├── blocks.ts              # BLOCK_COLORS (16 colors) + BlockColor/BlockType types
│   │   ├── actions.ts             # Immutable state transitions (selectFromColumn, moveBlocks)
│   │   ├── state.ts               # State queries (hasWon, isStuck, canPlace, lock/key matching)
│   │   ├── factories.ts           # createBlock, createPlacementColumn, createLevelState, …
│   │   ├── level-settings/        # Fibonacci difficulty ladder; getDifficultyLevel(levelNr)
│   │   ├── level-types/           # One file per level type; index.ts is the registry
│   │   ├── level-creation/        # Random level generator, AI solver, tactics, move optimiser
│   │   └── themes/                # Colour/shape maps per BlockTheme + seasonal schedule
│   │
│   ├── modules/                   # Feature containers (React, consume game logic)
│   │   ├── GameModi/              # NormalMode.tsx, ZenMode.tsx – top-level mode screens
│   │   ├── Level/                 # LevelLoader.tsx (async init), Level.tsx (game loop)
│   │   ├── LevelTrack/            # Level selection track UI
│   │   ├── Layout/                # ThemeContext, BackgroundContext, BetaContext, ErrorBoundary
│   │   ├── Settings/              # Settings panel, encrypted save export/import (QR + clipboard)
│   │   ├── SeedGenerator/         # CLI-only: produces/generates/verifies seeds
│   │   ├── ScheduledActions/      # Calendar-triggered events (e.g., April Fools)
│   │   ├── Help/                  # In-app manual/help content
│   │   ├── InstallPrompt/         # PWA install prompt
│   │   └── ZenSelection/          # Zen mode level type + difficulty picker UI
│   │
│   ├── ui/                        # Dumb/presentational React components
│   │   ├── Block/                 # Single block cell; CSS animations
│   │   ├── BlockColumn/           # Column of blocks with pointer events
│   │   ├── LevelLayout/           # Grid of columns; useBlockAnimation.ts
│   │   ├── Background/            # Animated background (particles, seasonal)
│   │   └── … (Dialog, Tray, Loading, Message, TopButton, etc.)
│   │
│   ├── support/                   # Cross-cutting utilities and hooks
│   │   ├── useGameStorage.ts      # Game-specific wrapper over useOfflineStorage + migrations
│   │   ├── useOfflineStorage.ts   # Generic localforage reactive store with pub/sub
│   │   ├── random.ts              # mulberry32 PRNG, shuffle, pick, between, generateNewSeed
│   │   ├── hash.ts                # settingsHash (LevelSettings → stable string key)
│   │   ├── dataTransfer.ts        # BSON + pako + AES-CTR encrypt/decrypt for save export
│   │   └── migration/             # Versioned migration handlers (levelV1.ts)
│   │
│   ├── services/
│   │   └── audio.ts               # Web Audio API system (streams, gain, lazy loading)
│   │
│   ├── data/
│   │   └── levelSeeds.ts          # Auto-generated; NEVER edit manually — pre-computed seed cache
│   │
│   ├── workers/
│   │   └── generateSeedWorker.ts  # Node.js worker_threads worker for parallel seed generation
│   │
│   └── assets/                    # Audio files (.mp3/.aac) and images
│
├── bin/
│   └── level-seeds.ts             # CLI for generating/verifying/testing the seed database
│
├── public/                        # Static assets (PWA icons, manifest helpers)
├── vite.config.ts                 # Vite config (PWA, MDX, path alias @/, base /block-sort/)
├── vitest.config.ts               # Vitest config (merges vite config, jsdom environment)
├── tsconfig.json                  # TypeScript strict config (ESNext, paths alias @/)
├── tsconfig.node.json             # TypeScript config for Node.js tooling (bin/, rollup)
├── eslint.config.js               # ESLint flat config (TS, React, import-sort, prettier)
├── prettier.config.cjs            # Prettier config (tailwindcss plugin, no trailing commas)
├── tailwind.config.js             # Tailwind config (custom tokens, animations)
└── rollup.worker.config.js        # Rollup config for building dist/worker.js
```

---

## Core Architecture

### Layered Design

```
src/game/      ← Pure domain logic (zero React)
src/modules/   ← Feature containers (React + game logic integration)
src/ui/        ← Presentational components (React, no game logic)
src/support/   ← Cross-cutting utilities and hooks
src/services/  ← External API wrappers (Web Audio)
src/data/      ← Generated static data (never edit manually)
```

This separation is a strict rule: **`src/game/` must never import from React or any React-specific module.**

### State Management

- No Redux/Zustand. State lives in React local state (`useState`) + `useOfflineStorage`.
- `useOfflineStorage` is a hand-rolled reactive store: reads from `localforage` on mount, writes back on update, and keeps multiple components with the same key in sync via in-memory pub/sub.
- **Immer** (`produce`) is used universally for all game-state mutations — always produce a new object, never mutate in place.

### Seeded Determinism

All random operations go through `mulberry32(seed)`. This guarantees:

- Reproducible level generation from a seed number.
- Pre-computed seed caches that let mobile devices skip the solver.
- `colorHustle` remaps visual colors from a fixed puzzle structure for variety.

### Level Type Registration

`src/game/level-types/index.ts` holds an ordered array of `LevelType` objects. `getLevelType(levelNr, theme)` scans it linearly using each type's `occurrence()` predicate. **Order matters** — `normal` is last as a catch-all. To add a new level type:

1. Create a file in `level-types/`
2. Import it in `index.ts` and insert it **before** `normal` in the array

### Block Animation

Movement is handled by the Web Animations API, **not** CSS transitions on React state. `useBlockAnimation` (in `src/ui/LevelLayout/`) captures DOM rects before state update, then creates temporary `div`s at `document.body` and animates them along an arc path via `createFrames`. This avoids layout thrashing with React re-renders.

---

## Key Domain Types (`src/game/types.ts`)

```typescript
// Running state of a level
type LevelState = {
  blockTypes: BlockType[]; // all block types in play
  columns: Column[];
  moves: Move[]; // solver's solution path
  solver?: keyof typeof solvers;
  generationInformation?: { cost; attempts; seed };
};

// A column in the puzzle
type Column = {
  type: "placement" | "buffer" | "inventory";
  locked: boolean;
  columnSize: number; // max capacity
  blocks: Block[]; // index 0 = TOP (pickable) block
  limitColor?: LimitColor;
  paddingTop?: number;
};

// A single block
type Block = {
  blockType: BlockType; // BlockColor | Lock | Key
  revealed?: boolean; // false = hidden (hard/hot mode)
  spawned?: boolean; // true = animated in (auto-complete)
};

type Move = { from: number; to: number; tactic?: string };

// Level generation parameters
type LevelSettings = {
  amountColors?;
  stackSize?;
  extraPlacementStacks?;
  extraPlacementLimits?;
  buffers?;
  bufferSizes?;
  bufferPlacementLimits?;
  extraBuffers?;
  hideBlockTypes?: "none" | "all" | "checker";
  stacksPerColor?;
  blockColorPick?: "start" | "end";
  amountLockTypes?;
  amountLocks?;
  lockOffset?;
  playMoves?;
  layoutMap?;
  solver?;
};

// Multi-stage level (Hot / Dungeon variants)
type MultiStageLevelSettings = {
  stages: { settings; levelModifiers?; backgroundClassname?; name? }[];
};

// Runtime visual modifiers
type LevelModifiers = {
  theme?;
  particles?;
  ghostMode?;
  hideMode?: HideFormat;
  keepRevealed?;
  hideEvery?;
};
```

**Block taxonomy:**

- **`BlockColor`** – 16 named colors (white, red, yellow, blue, purple, black, green, aqua, darkgreen, darkblue, brown, pink, turquoise, orange, lightyellow, gray)
- **`Lock`** – 7 types (e.g., `ghost-lock`, `fire-lock`)
- **`Key`** – 7 matching types (e.g., `flashlight`, `water`). A key placed on its matching lock removes both
- **`LimitColor`** – `BlockColor | "rainbow"` (rainbow allows any colour)
- **Indexing convention**: `blocks[0]` is always the **top** (visible, pickable) block

---

## Important Files (Read These First)

| File                                             | Why It Matters                                                           |
| ------------------------------------------------ | ------------------------------------------------------------------------ |
| `src/game/types.ts`                              | Authoritative domain model — all game logic flows through these types    |
| `src/game/actions.ts`                            | The two core state-mutation primitives: `moveBlocks`, `selectFromColumn` |
| `src/game/state.ts`                              | Win/lose/stuck detection and lock-key matching — the rules engine        |
| `src/game/level-types/index.ts`                  | Registry controlling what level type appears at each level number        |
| `src/game/level-creation/tactics.ts`             | `generatePlayableLevel` — entry point for level generation               |
| `src/game/level-creation/configurable-solver.ts` | AI solver engine with look-ahead tactic evaluation                       |
| `src/modules/Level/LevelLoader.tsx`              | Async level loading, seed lookup, storage caching, multi-stage handling  |
| `src/modules/Level/Level.tsx`                    | Main gameplay component; input handling and play-state machine           |
| `src/support/useOfflineStorage.ts`               | Storage backbone — essential for any persistence work                    |
| `src/data/levelSeeds.ts`                         | Auto-generated seed cache — **never edit manually**                      |
| `vite.config.ts`                                 | Configures PWA, MDX, `@/` alias, base path `/block-sort/`                |
| `bin/level-seeds.ts`                             | Primary CLI for seed database maintenance                                |

---

## Development Commands

```bash
# Setup
yarn install          # Install dependencies (Yarn PnP)

# Development
yarn dev              # Start Vite dev server (hot reload)
yarn storybook        # Storybook component explorer on port 6007

# Quality
yarn test             # Run all tests with Vitest (watch mode)
yarn lint             # ESLint — zero warnings allowed
yarn check-types      # tsc --noEmit type check

# Production
yarn build            # tsc type-check + vite build → dist/
yarn preview          # Build then serve dist/ locally

# Seed management (run after changing level generation logic)
yarn generate-level-seeds   # Generate missing seeds
yarn verify-level-seeds     # Verify existing seeds still produce valid levels
# Or use the full CLI for more options:
npx tsx bin/level-seeds.ts --help
npx tsx bin/level-seeds.ts test           # Remove invalid seeds
npx tsx bin/level-seeds.ts generate --all # Generate all missing seeds

# Worker bundle
yarn build:worker     # Rollup: build dist/worker.js for Node.js seed generation
```

> **Yarn PnP note:** This project uses Yarn PnP (Zero-installs). For IDE support, install the [ZipFS](https://marketplace.visualstudio.com/items?itemName=arcanis.vscode-zipfs) extension and run `yarn dlx @yarnpkg/sdks`.

---

## Testing

- **Framework**: Vitest (jsdom) + @testing-library/react + @testing-library/jest-dom
- **Location**: Tests are **co-located** alongside source files using the `.spec.ts` / `.spec.tsx` suffix
- **Coverage**: Heavily concentrated in `src/game/` (pure logic) — UI component tests are sparse
- **Key test areas**:
  - `src/game/actions.spec.ts` – core move mechanics
  - `src/game/state.spec.ts` – win/lose/stuck detection
  - `src/game/level-creation/*.spec.ts` – level generator and solver
  - `src/game/level-types/*.spec.ts` – one spec per level type
  - `src/support/*.spec.ts` – utilities (random, schedule, migration, etc.)

Run a single test file: `yarn test src/game/actions.spec.ts`

---

## Code Conventions

### File Naming

- `PascalCase.tsx` for React components
- `camelCase.ts` for utilities and hooks
- `camelCase.spec.ts` / `.spec.tsx` for tests
- `ComponentName.stories.tsx` for Storybook stories

### Imports

- Use the `@/` alias (resolves to `src/`) for all internal imports — never use relative `../../` paths across module boundaries
- Import order enforced by `eslint-plugin-simple-import-sort`: `react/*` → `@/ui/*` → other `@/*` → side-effects → relative
- Use `import type` for type-only imports (`@typescript-eslint/consistent-type-imports` is enforced)

### TypeScript

- Strict mode; `noUnusedLocals` and `noUnusedParameters` are active
- `type` keyword preferred over `interface`
- `SCREAMING_SNAKE_CASE` for top-level constants (`BLOCK_COLORS`, `LEVEL_SCALE`, `BASE_SEED`)
- Prefix intentionally unused variables with `_`

### React

- Functional components only
- React 19 `use()` hook used for consuming Contexts and unwrapping Promises
- `useCallback` used extensively in game components to avoid stale closures
- The **React Compiler** is active — follow its rules (enforced by `eslint-plugin-react-compiler`)

### CSS / Tailwind

- Tailwind utility classes for almost all styling
- **CSS Modules** (`.module.css`) for complex animation-heavy styles (Block, BlockColumn)
- CSS custom properties (`--cube-color`, `--levelScale`) set inline via React `style` prop
- `clsx` for conditional class composition
- Prettier auto-sorts Tailwind classes — run `yarn lint` to normalise

### Game Logic

- All state mutations must produce **new objects** via Immer `produce` — never mutate in place
- `selectFromColumn` and `moveBlocks` are the canonical interaction primitives; prefer them over ad-hoc state changes
- `blocks[0]` is always the **top** (pickable) block in a column
- Level settings are keyed by `settingsHash` — it excludes `layoutMap` and `playMoves` (cosmetic/runtime-only fields)
- Lock/key block types follow the naming convention `"${pairName}-lock"` / `"${pairName}-key"`

---

## Common Tasks & Where to Look

| Task                                | Where to start                                                                 |
| ----------------------------------- | ------------------------------------------------------------------------------ |
| Add a new level type                | `src/game/level-types/` — create a new file, add to `index.ts` before `normal` |
| Change difficulty scaling           | `src/game/level-settings/levelSettings.ts`                                     |
| Add a new lock/key pair             | `src/game/level-creation/lock-n-key.ts`                                        |
| Add a new seasonal theme            | `src/game/themes/index.ts` + `themeSchedule`                                   |
| Add a solver tactic                 | `src/game/level-creation/solver-tactics/`                                      |
| Change block colors/shapes          | `src/game/blocks.ts`                                                           |
| Change game UI layout               | `src/ui/LevelLayout/LevelLayout.tsx`                                           |
| Change game loop / input            | `src/modules/Level/Level.tsx`                                                  |
| Change level loading logic          | `src/modules/Level/LevelLoader.tsx`                                            |
| Change persistent storage           | `src/support/useOfflineStorage.ts` + `src/support/useGameStorage.ts`           |
| Add a new storage migration         | `src/support/migration/` + `src/support/migrateLevelState.ts`                  |
| Regenerate seeds after logic change | `npx tsx bin/level-seeds.ts generate --all`                                    |
| Add a new UI component              | `src/ui/` — keep it dumb (no game logic), use Tailwind                         |
| Add a new settings option           | `src/modules/Settings/` + `src/support/useGameStorage.ts`                      |

---

## Gotchas & Important Notes

1. **`src/data/levelSeeds.ts` is auto-generated.** Never edit it manually. After changing level generation logic, run `npx tsx bin/level-seeds.ts test` to remove invalid seeds and `npx tsx bin/level-seeds.ts generate --all` to regenerate.

2. **`src/game/` must be React-free.** No React imports, no hooks, no JSX in this folder. It is pure TypeScript domain logic.

3. **Blocks are indexed top-first.** `column.blocks[0]` is always the top block — the one visible and pickable. Keep this in mind when reading or writing block array logic.

4. **Level type `occurrence()` order matters.** In `src/game/level-types/index.ts`, `normal` must remain last (it's the catch-all). New types go before it.

5. **`settingsHash` excludes runtime/cosmetic fields.** `layoutMap` and `playMoves` are intentionally excluded from the hash. This means two `LevelSettings` objects that differ only in those fields will share a seed cache entry.

6. **Immer everywhere.** Any function that modifies a `LevelState` or `Column` must do so inside an Immer `produce` call. Never mutate the state directly.

7. **Block animation is imperative.** `useBlockAnimation` creates temporary `div` elements at `document.body` to animate moves. Don't try to replicate this with CSS transitions on React state.

8. **Yarn PnP.** Running `node` scripts directly may fail. Use `yarn node` or `npx tsx` for TypeScript scripts. The bin CLI uses `tsx` under the hood.

9. **React Compiler is active.** ESLint will flag violations of React Compiler rules. Don't add manual `useMemo`/`useCallback` where the compiler already handles memoisation.

10. **`localforage` is async.** `useOfflineStorage` handles optimistic updates (React state is updated immediately; persistence is async). Don't assume storage reads are synchronous.
