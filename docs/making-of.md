# Why I made Block Sort

I like small puzzle games to play on my mobile, (because you can put them away easily as well). But I got really annoyed that a lot of them **force feed you advertisements**.

To counter this I made my own puzzle game, as a progressive web app. This means you can install it on your mobile or desktop as an application, and play offline.

After the game is offline ready, no requests should be outgoing except checking for updates of the game. So there is no tracking/reporting going on.

_This also means I rely on old fashion email to get feedback, and that I have no idea how many people are playing!_

### Source code

The game is build in React + Typescript + Vite, and is open-source at: [https://github.com/matthijsgroen/block-sort](https://github.com/matthijsgroen/block-sort)

### Development challenges

- I wanted to make the game using open web standards such as HTML + CSS. The game actually features one image, the rest is done in pure CSS (the cubes, buffers and placement stacks);
- All animation is done through CSS animations;
- All levels are randomly generated, and then proven playable by a solver before a player gets the level on screen. To remove loading times for the high difficulty levels, a process was made to generate these levels offline, and the game only contains the random seeds to reproduce them (and then they are still solved by the game first before offering)
- The entire game is statically hosted, so there is no backend involved (this also means no operational costs for me!). This proved challenging for data transfer capabilities. The game now generates a QR Code image containing all encrypted/compressed game data, that can be loaded into another instance of the game.

# About Matthijs Groen

Hi, I'm [Matthijs Groen](https://www.linkedin.com/in/matthijs-groen/), Front-end Developer at [Kabisa](https://kabisa.nl), in the Netherlands.

In my spare time I like to develop as well, (this game is a result of that!) and have already a nice collection of tools and games on my [Github](https://github.com/matthijsgroen).

You can follow me on [BlueSky 🦋](https://bsky.app/profile/matthijsgroen.bsky.social)