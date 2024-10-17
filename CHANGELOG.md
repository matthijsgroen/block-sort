# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Version 1.10.4 - 2024-10-17

### Fixed

- Detection of landscape of older browsers

## Version 1.10.3 - 2024-10-17

### Fixed

- Improved error information on error screen

## Version 1.10.2 - 2024-10-16

### Fixed

- Fixed getting stuck in zen mode if data somehow got incomplete

## Version 1.10.1 - 2024-10-15

### Fixed

- Fixed click target of columns, preventing overlap on vertical stacks

## Version 1.10.0 - 2024-10-15

### Added

- Added 'ghost' mode for replay hints halfway during halloween theme
- Added 'package' mode for revealing blocks halfway during winter theme
- Basic spring theme (WIP) to run in march/april

### Changed

- Enabled zen mode at level 30, instead of 50
- Reduced size of storage format

## Version 1.9.0 - 2024-10-13

### Added

- Improve responsiveness for columns and zen screen
- Feedback and donate buttons, per request of users 😊

### Changed

- Restructured settings screen to have more options in an advanced section

## Version 1.8.0 - 2024-10-11

### Added

- Sound effect for jumping smiley
- Pre-seeded list for each level setting, to eliminate loading times

### Fixed

- Clicking close in settings will not propagate to play button
- When transfer image is from different version, the conflict will now be shown
- Improved definition of being 'blocked'

## Version 1.7.0 - 2024-10-10

### Added

- Labels to options in 'zen mode' screen
- New special level type, with steps buffer
- Animation on main track to let player jump to next level
- Always ask for confirmation before import
- Reveal block if not earlier revealed when column is completed with same colors

### Changed

- Updated the difficulty of some of the special templates

### Removed

- The beta label on the data transfer

## Version 1.6.2 - 2024-10-10

### Fixed

- Fixed loading of level 360

### Added

- Decent error screen if level generation fails with email and back option

## Version 1.6.1 - 2024-10-08

### Fixed

- Reduced data in export, to succeed for most complex levels

## Version 1.6.0 - 2024-10-08

### Added

- Data transfer option through the settings screen, to move progress from one instance to another

## Version 1.5.1 - 2024-10-08

### Fixed

- Some padding issues

## Version 1.5.0 - 2024-10-08

### Added

- Event calendar button to display current or upcoming theme

### Removed

- Removed Option to disable particles. The performance issues have been resolved. (simplifies settings screen)

## Version 1.4.0 - 2024-10-06

### Added

- Installation prompt

## Version 1.3.2 - 2024-10-06

### Fixed

- Pumpkin being stubborn

## Version 1.3.1 - 2024-10-06

### Fixed

- Pumpkin was rolling out of screen!
- Reduced movement speed of ghosts

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
