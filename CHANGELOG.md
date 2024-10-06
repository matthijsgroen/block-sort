# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Version 1.3.0 - 2024-10-06

### Added

- Pumpkin will move to other side of the screen to prevent being behind a button

### Changed

- Built own mini CSS particle engine for the ghosts / snow. Hopefully smoother!

## Version 1.2.0 - 2024-10-06

### Changed

- Updated the ramp up of difficulty

### Known issues

- The flying ghosts are not fully rendered on android, an investigation is ongoing

## Version 1.1.0 - 2024-10-05

### Added

- Option to disable particles

### Changed

- Updated some colors to make them more distinguishable

### Known issues

- The flying ghosts are not fully rendered on android, an investigation is ongoing

## Version 1.0.3 - 2024-10-04

### Fixes

- Background recoloring on start to a wrong state

### Known issues

- The flying ghosts are not fully rendered on android, an investigation is ongoing

## Version 1.0.2 - 2024-10-04

### Fixes

- Removed scrollbar caused by pumpkin
- Updated some build specs in hope to improve performance

### Known issues

- The flying ghosts are not fully rendered on android, an investigation is ongoing

## Version 1.0.1 - 2024-10-04

### Fixes

- Updates color of one of the orange halloween blocks to be more distinguishable
- Set frames per second of particles to 30fps, to prevent stutter
- Added explicit control variant to emoji's to prevent coffin outline on android phones

## Version 1.0.0 - 2024-10-04

The introduction of themes! Themes change block colors and symbols, music and backgrounds.

### Added

- Fall/Halloween theme, runs from 1 oct till 8 nov
- Winter/Christmas theme, runs from 1 dec till 8 jan
- Setting to switch back form themed content
- Lazy loading audio to prevent pre-loading themed music that is not used

### Changed

- Block types picked for special levels start at the end of color range
- Converted mp3 music to aac, to have smaller files

## Version 0.9.0 - 2024-10-03

### Added

- Visibility of Changelog in the game settings
- Visibility of asset attribution in the game settings

### Changed

- Icon of 'zen' mode is updated, for better contrast

## Version 0.8.0 - 2024-10-01

### Added

- Zen mode, to play one-off levels of desired type and difficulty

### Changed

- Level nr is now shown between buttons (when no automoves available)

## Version 0.7.1 - 2024-10-01

### Fixed

- Misspelled button label in level track

## Version 0.7.0 - 2024-09-30

### Added

- Pressed state for play button
- Hard levels are now either fully hidden, or hidden in checkerboard going from level 102 and up
- Special levels can now contain checkerboard hidden blocks from level 200 going up
- Level number visible in level, by request from users
- More win sentences

### Changed

- Rebalanced AutoMove

## Version 0.6.1 - 2024-09-27

### Added

- List proper version number in settings

### Fixed

- Auto moves was wrongly initialized, and shown to early

## Version 0.6.0 - 2024-09-27

### Added

- Styling to PWA Update Toast message
- An auto move button to spend some moves towards a solve when you got blocked more than 10 times
- Extra verification if level is winnable
- Fix of random move (shadowed vars caused illegal moves)

## Version 0.5.0 - 2024-09-27

### Changed

- App logo
- Solver now has only one try per generated level, this speeds up level loading
- Colors only fade if going from hidden to revealed

## Version 0.4.0 - 2024-09-27

### Added

- Updated styling of hidden block, to offset them better against normal blocks.
- Added fade animation when block gets revealed.
- Max width for column distribution, for desktop play.

### Changed

- Colors are now added in batches of 4.
  If a level has 4 colors, it always picks from the first 4 colors.
  If it has 6 colors, it picks from the first 8.
- Changed lose message to "Blocked!".
- Changed win message to a random positive word.

### Fixed

- Audio started playing when disabled.

## Version 0.3.0 - 2024-09-26

### Added

- Extra colors! There are now 16 types of blocks!
- Updated special template that (with increasing difficulty) will leverage
  all 16 colors.
- Added a loading indicator animation.

### Changed

- Loading of levels should be a lot faster now.
