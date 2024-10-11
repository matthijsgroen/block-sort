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

2. Special levels - These vary in layout, buffers and locked columns. They come around every 7 levels.

3. Hard levels - The same as Normal levels (including variant after level 160), but all blocks under the surface are hidden. Occur every 9 levels.

4. Easy levels - These can be hard, normal or special, but are always a few difficulty levels below your current difficulty level. They start occurring from level 150, and come around every 13 levels.

5. Scrambled levels - These are normal levels, but someone has already done some moves towards solving them! The start occurring from level 180, and Occur every 9 levels, mostly just after a hard level.

## Development setup

```
yarn install
yarn dev
```

> [!NOTE]
> This project uses _yarn pnp_. This means you need to install the
> [ZipFS](https://marketplace.visualstudio.com/items?itemName=arcanis.vscode-zipfs) extension, and you possibly need to run `yarn dlx @yarnpkg/sdks`

Running tests:

```
yarn test
```

Lint code:

```
yarn lint
```

The game will use pre-created seeds to generate levels in a fast way on mobile (reduces power usage and loading times).

To generate all the seeds, run:

```
bin/generate-level-seeds.ts
```

It will add 50 seeds to places where they are missing, and
removes outdated seeds for settings that are no longer available.

If you want to run the seeder multiple times,
in fish you can use:

```fish
for i in (seq 10)
  bin/generate-level-seeds.ts
end
```

This project uses the [CC BY-NC-SA 4.0](./LICENSE) license.
