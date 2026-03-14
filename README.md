# Block Sort

A small mobile game where you need to sort blocks

## Where to play

[https://matthijsgroen.github.io/block-sort/](https://matthijsgroen.github.io/block-sort/)

To install on an iOS device:

1. Open the link in Safari
2. Open the share menu
3. Select 'Add to Home Screen'
4. Confirm installation

### Level Types

1. Normal levels - Will increase in amount of colors, and from level 160 will add a random variant that has 2 small buffers instead of a free column.

2. ⭐️ Special levels - These vary in layout, buffers and locked columns. They come around every 7 levels.

3. 🔥 Hard levels - The same as Normal levels (including variant after level 160), but all blocks under the surface are hidden. Occur every 9 levels.

4. 🍀 Easy levels - These can be hard, normal or special, but are always a few difficulty levels below your current difficulty level. They start occurring from level 150, and come around every 13 levels.

5. 🧩 Scrambled levels - These are normal levels, but someone has already done some moves towards solving them! The start occurring from level 180, and Occur every 9 levels, mostly just after a hard level.

6. 🐉 Dungeon levels - These levels have enemies and traps. Use the proper items to remove them to continue your sorting journey!

7. 🌶️ Hot levels - Multi stage hard levels, but a lot spicier!

## Development setup

### Run locally

This repository uses `packageManager: "yarn@4.10.3"` and Vite 7. Before starting, ensure your Node.js version is compatible with Vite 7 (`20.19+` or `22.12+`).

```bash
node -v
corepack enable
yarn install
yarn dev
```

To verify a production build locally:

```bash
node -v
corepack enable
yarn install
yarn build
yarn preview
```

If you use `nvm` and need a newer Node version:

```bash
nvm install 22
nvm use 22
corepack enable
yarn install
yarn build
yarn preview
```

If install/build state is corrupted, do a clean reinstall:

```bash
rm -rf node_modules .yarn/install-state.gz .pnp.cjs .pnp.loader.mjs
corepack enable
yarn install
yarn build
```

> [!NOTE]
> This project uses _yarn pnp_. This means you need to install the
> [ZipFS](https://marketplace.visualstudio.com/items?itemName=arcanis.vscode-zipfs) extension, and you possibly need to run `yarn dlx @yarnpkg/sdks`

- Running tests: `yarn test`
- Lint code: `yarn lint`

The game will use pre-created seeds to generate levels in a fast way on mobile (reduces power usage and loading times).

For all management around these seeds, check out:

```
bin/level-seeds.ts --help
```

To test all the seeds, and remove the invalid ones:

```
bin/level-seeds.ts test
```

To generate missing seeds, run:

```
bin/level-seeds.ts generate --all
```

Reading output of generation process:

```
Seeding 198 more for "Dungeon" - 9... [██▀▀▀▀▀▀▀▀▀▀------------] 461/847 (54.43%) - 10/198 10 workers ⠸ (233)
         |            |          |     |  |                      |                  |      |          |  |
         1.           2.         3.    4. 5.                     6.                 7.     8.         9. 10.

1. Amount to seed for this level type / difficulty level combination
2. Name of the template producer (level type)
3. Difficulty level (1 - 11)
4. Bottom progressbar, current template / level combination progress
5. Top progressbar, overall progress entire command
6. Amount generated of total amount to generate (top progress)
7. Amount generated current difficulty (bottom progress) 
8. Amount of work in parallel
9. Alive animation
10. Current solver attempts to get a new seed
```

This project uses the [CC BY-NC-SA 4.0](./LICENSE) license.

## Study Lock + Logging migration

### Added features

- Study lock overlay that blocks gameplay until a valid study prompt answer is entered.
- Unlock timer flow with randomized session duration and a post-expiry cooldown before re-unlock.
- Progress persistence API integration (`load-progress` / `save-progress`) with retry + fallback behavior.
- Session and gameplay telemetry logging (`log-session` / `log-event`) including study/user metadata and gameplay context.
- User-key normalization and automatic `X-Study-User` request header injection.
- Logger status/debug panel to inspect endpoint config, enablement, persisted queue state, and last request status.

### Local development

```bash
yarn install
yarn dev
```

Optional API override:

```bash
VITE_API_BASE="http://localhost:8787/api" yarn dev
```

### Base path and API resolution

- Vite base path is configured for deployment at `/StudyGameLock/`.
- API base resolution order in the client service:
  1. `VITE_API_BASE` (if set)
  2. `/api` in development
  3. `${BASE_URL}api` in production (subpath-safe, so `/StudyGameLock/api` on target hosting)

### Backend contract summary

Client service expects:

- `POST /api/save-progress` body: `{ "progress": { "levelNr": number, "inLevel": boolean, "inZenMode": boolean } }`
- `GET /api/load-progress` response: `{ "progress": { "levelNr": number, "inLevel": boolean, "inZenMode": boolean } }`
- `POST /api/log-session` body includes at least:
  - `session_id`
  - `event_type` (`session_start` / `session_end`)
  - `timestamp`
  - `user_key`
  - additional study-session analytics fields:
    - `username`, `study_entry`
    - `session_started_at`, `session_ended_at`, `duration_seconds`
    - `session_start_level`, `session_end_level`
    - `session_start_in_level`, `session_end_in_level`
    - `session_start_in_zen_mode`, `session_end_in_zen_mode`
  - optional `result`
- `POST /api/log-event` body includes gameplay/session JSONL event records.

When a user key exists, requests include `X-Study-User: <normalized-user-key>`.

### Event schema summary

Event payload fields emitted by the study logger include:

- `event_type`
- `timestamp`
- `session_id`
- `user_key`
- `elapsed_seconds`
- `app_version`
- optional context when available:
  - `username`
  - `study_entry`
  - `session_start_level`
  - `session_start_in_level`
  - `current_level`
  - `current_in_level`
  - `current_in_zen_mode`
  - `level_id`
  - `level_type`
  - `difficulty`
  - `seed`
  - `move_count`
  - `board_signature`
  - `action_source`
  - `result`

Events instrumented:

- `session_start`, `resume`, `pause`, `session_end`
- `level_start`, `level_complete`, `level_fail`
- `move`, `invalid_move`, `hint`, `restart`

> Note: this repository does not currently expose a dedicated in-game undo action, so no native `undo` trigger point was available without introducing new gameplay behavior.

### Manual verification checklist

- [ ] Initial load starts locked (overlay shown before gameplay)
- [ ] Unlock requires study text length >= 3
- [ ] Unlock starts randomized timer (60–180s)
- [ ] Timer expiry relocks game and starts 45s cooldown
- [ ] Cooldown blocks unlock submit until countdown reaches 0
- [ ] `session_end` with `result: unload` emits on tab close/unload (beacon path)
- [ ] Username persists and normalized user key is reused
- [ ] Progress load/save calls retry and backup fallback is written when save fails
- [ ] Logger status panel shows endpoint, enabled state, persisted count, last success/error
- [ ] Gameplay/session payloads contain required fields and context where available
