# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Version 0.6 - 2024-09-27

### Added

- Styling to PWA Update Toast message
- An auto move button to spend some moves towards a solve when you got blocked more than 10 times
- Extra verification if level is winnable
- Fix of random move (shadowed vars caused illegal moves)

## Version 0.5 - 2024-09-27

### Changed

- App logo
- Solver now has only one try per generated level, this speeds up level loading
- Colors only fade if going from hidden to revealed

## Version 0.4 - 2024-09-27

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

## Version 0.3 - 2024-09-26

### Added

- Extra colors! There are now 16 types of blocks!
- Updated special template that (with increasing difficulty) will leverage
  all 16 colors.
- Added a loading indicator animation.

### Changed

- Loading of levels should be a lot faster now.
