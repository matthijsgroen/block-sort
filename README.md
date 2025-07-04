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

```
yarn install
yarn dev
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
