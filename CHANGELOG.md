# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Version 1.39.2 - 2025-06-26

### Fixed

- A tricky bug where moving blocks between buffers could trigger a "Blocked" state.

## Version 1.39.1 - 2025-06-13

### Fixed

- Minor tweaks for summer theme

## Version 1.39.0 - 2025-04-13

### Changed

- Extended spring and summer themes!

## Version 1.38.0 - 2025-03-30

### Fixed

- Triggering text selection during play in iOS (Contributed by **Lennart Klein**, thanks!)

### Changed

- Changed how **Dungeon** levels work. They still have Enemies and Traps, but they are now also
  multiple stages. You need to decent to the bottom of the dungeon before you defeat a level.
- Tweaked difficulty of Dungeon levels, making them harder.
- Updated some help sections to contain visual game elements for clarification.

## Version 1.37.4 - 2025-03-20

### Fixed

- Dungeon levels were falsely reporting 'Blocked!' while a key could still be stored in a chest.

## Version 1.37.3 - 2025-03-19

### Fixed

- Fixed level 750, thanks for reporting Penny!

## Version 1.37.2 - 2025-03-19

### Fixed

- Fixed state of levels for people affected by issues of version rollback of 1.37.1

## Version 1.37.1 - 2025-03-18

### Fixed

- Fixed `Error message: Cannot read properties of undefined (reading 'endsWith')`

## Version 1.37.0 - 2025-03-18

### Added

- New level type, **"Dungeon"** levels! They start from level **200**, and occur every **50** levels. Defeat enemies and evade traps!
  You can unlock all difficulties in Zen mode after level 800.

## Version 1.36.0 - 2025-03-07

### Fixed

- Small code improvement

### Added

- Help content for summer theme

## Version 1.35.1 - 2025-01-20

### Fixed

- Fixed showing wide buttons while icon font was still loading
- Fixed particles for some themes

## Version 1.35.0 - 2025-01-11

### Added

- Build app using React Compiler, making game more power efficient

## Version 1.34.1 - 2025-01-04

### Fixed

- Keeping screen awake is more complex on iOS

## Version 1.34.0 - 2025-01-04

### Added

- Keep screen awake during level and share and data transfer QR code screen (Thanks Miloslav Nenadál for the suggestion!)

## Version 1.33.1 - 2024-12-15

### Fixed

- Showing proper level type background in zen mode

## Version 1.33.0 - 2024-12-05

### Changed

- Winter levels are now 6 levels apart instead of 8

## Version 1.32.0 - 2024-12-05

### Changed

- Added level layouts to special levels

### Fixed

- Loading indicator is now more fluent
- Split up content for faster startup time
- Improved loading times of levels

## Version 1.31.1 - 2024-12-02

### Fixed

- Fixed level track message for unlocking Wizard mode at level 268. (Thanks Katie O'Connell for reporting!)

## Version 1.31.0 - 2024-12-02

### Added

- Added error boundary around entire app, to catch errors for (manual) reporting

## Version 1.30.0 - 2024-12-01

### Added

- Added help about refreshing installation

### Changed

- Reduced side spacing from buttons at bottom, to get some spacing on Samsung devices
- Made winter levels less frequent

### Fixed

- Revealed packages should stay revealed until manual restart
- Level type is now remembered if new level types are introduced or removed

## Version 1.29.0 - 2024-11-30

### Fixed

- Used own implementation of 'findLastIndex' to stay on older version of Ecmascript

### Changed

- Changed to display mode 'fullscreen' for PWA (hopefully hide nav bar on Samsung phones) **Requires reinstall**

## Version 1.28.3 - 2024-11-30

### Fixed

- Make max with bit wider so that we keep gaps between columns
- Fix missing level title in hint mode 'off' sometimes
- Improved color gradient of start level animation for wide screens

## Version 1.28.2 - 2024-11-30

### Fixed

- Fixed scale of block moving animations if content is scaled down due to height restrictions

## Version 1.28.1 - 2024-11-29

### Fixed

- Fix displaying unlockable zen mode levels that are not available

## Version 1.28.0 - 2024-11-29

### Added

- Special seasonal level types will also be available in Zen mode during that period
- Ability to scale level content for smaller displays (Thanks MichaelGoulding for reporting!)

### Changed

- Updated the Help dialog, with multiple pages about multiple subjects

### Fixed

- Made the 'blocked!' detection a bit less eager, also fixed some cases where he couldn't detect if you were stuck.
- Improved the moves of the solver, removing a lot of useless moves, making the automoves a lot more efficient.

## Version 1.27.0 - 2024-11-27

### Fixed

- Fixed stuck detection with buffer columns

### Added

- Zen mode rewards are now also visible on level track

## Version 1.26.0 - 2024-11-24

### Added

- Auto update theme on activation date
- More preparations for spring theme

### Changed

- Improved indication of difficulty increase on level track
- Updated Share mechanic, added share through QR

### Fixed

- Fixed stuttering on start of level animation

## Version 1.25.1 - 2024-11-19

### Fixed

- Render performance improvements
- Updated level start animation to be more responsive to screen size

## Version 1.25.0 - 2024-11-17

### Added

- Intro animation for non-normal levels

## Version 1.24.0 - 2024-11-16

### Added

- Counter to show amount of last levels completed without hints.

### Fixed

- The Hint mode button now also responds to slides.

## Version 1.23.0 - 2024-11-16

### Added

- Toggle to switch from hint mode

## Version 1.22.0 - 2024-11-14

### Added

- Tutorial on level 1 for new players
- New 'normal' level template for players at level 300 and higher

## Version 1.21.0 - 2024-11-13

### Changes

- Update styling behind status bar on mobile

### Fixes

- Removed visible ring around button

## Version 1.20.1 - 2024-11-11

### Fixes

- Some general improvements

## Version 1.20.0 - 2024-11-10

### Changed

- Automoves now will assist till 95% of the solve instead of 50%

## Version 1.19.1 - 2024-11-10

### Fixed

- There was a mismatch in level settings in relation to proven seeds, causing level generation errors.
  Thanks to Federico for reporting!

## Version 1.19.0 - 2024-11-10

### Added

- Ability to design more level layouts
- New Level Type for Spring Season
- Extra metadata for SEO

### Changed

- Level solver logic, making solves more efficient,
  this caused recreated levels though.
- Add new icons in the app to align items

### Fixed

- Sound should be playing on earlier interaction

## Version 1.18.0 - 2024-11-03

### Added

- New sound for level restart

### Changed

- Updated duration for halloween and christmas theme

### Fixed

- Level track sliding down is now starting from the correct level nr.

## Version 1.17.0 - 2024-11-01

### Changed

- Updated difficulty curve to increase sooner, but in smaller steps (instead of the large hike at 166)

## Version 1.16.2 - 2024-10-31

### Fixed

- Fine-tuned animation

## Version 1.16.1 - 2024-10-31

### Fixed

- Start of block animation

## Version 1.16.0 - 2024-10-30

### Changed

- Using different animation strategy, removing animation through path, and start using translate

## Version 1.15.1 - 2024-10-27

### Added

- More effort to smoothen animation of blocks

## Version 1.15.0 - 2024-10-27

### Added

- Additional level template for normal levels above 230.

### Changed

- Changed visual style to reduce rendering complexity
- Updated view alignment to center content for larger screens

## Version 1.14.3 - 2024-10-26

### Fixed

- Speed improvements for block animation

## Version 1.14.2 - 2024-10-26

### Fixed

- Improve responsiveness of touch controls

## Version 1.14.1 - 2024-10-25

### Fixed

- Tapping (touch) one column and releasing on another now also moves blocks (did not work before)

## Version 1.14.0 - 2024-10-25

### Added

- Clicking on one column and releasing on another now also moves blocks (same with touch)

### Known issues

- The cool new block moving animation has bad performance in iOS stand-alone mode, and is therefor
  disabled for now. I hope to enable them for iOS soon.

## Version 1.13.6 - 2024-10-25

### Fixed

- Levels sometimes displaying a different state and resulting in weird results

### Known issues

- The cool new block moving animation has bad performance in iOS stand-alone mode, and is therefor
  disabled for now. I hope to enable them for iOS soon.

## Version 1.13.5 - 2024-10-24

### Removed

- Removed block motion on iOS. Apple is gimping the performance so badly, that the move animation is disabled.

## Version 1.13.4 - 2024-10-24

### Fixed

- Sync of level state and render state when restarting due blocked

## Version 1.13.3 - 2024-10-24

### Fixed

- Sync of level state and render state

## Version 1.13.2 - 2024-10-24

### Fixed

- Tweak animation timing for better display on iPhone

## Version 1.13.1 - 2024-10-24

### Fixed

- Remove blur of animation, to make rendering lighter

## Version 1.13.0 - 2024-10-24

### Added

- Animation of blocks moving from column to column

## Version 1.12.2 - 2024-10-22

### Fixed

- Removed reference to non existing asset that could slow down loading when offline

## Version 1.12.1 - 2024-10-22

### Fixed

- Removed asset reference that could prevent quick loading in offline mode

## Version 1.12.0 - 2024-10-22

### Added

- In game help screen explaining game mechanics

## Version 1.11.0 - 2024-10-18

### Changed

- Reduced lightning effect in fall theme
- Detection of being stuck while having a free buffer column
- Updated internal tooling for content management

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

### Changed

- Set screen orientation to portrait (Only Android supports this) **Requires reinstall**

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

- App logo - **Requires reinstall**
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
