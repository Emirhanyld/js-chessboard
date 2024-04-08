# Change Log

## 2.0.0

### Added

- promoteTo parameter to .movePiece() function

- Auto Promotion

- Move History

    - .moves()

- Move between moves

    - .previousMove()

    - .nextMove()

    - .toFirstMove()

    - .toLastMove()

- Move count

    - totalMoveCount

    - currentMoveCount

### Changed

- Now initChessboard creates the chessboard inside a new div and puts it inside the passed element, instead of creating it directly inside the passed element.

- lastMove format.

- .movePiece() additional parameters are now object properties.

- Css file name is now chessboard.css instead of style.css

### Fixed

- .setposition() function not working when used with "start".

## 1.3.0

### Added

- New config options

    - showGhostPiece

    - enableHighlights

    - enableArrows

    - resizable

    - minSize

    - maxSize

- Resize board with arrow on the bottom right

- sizeChange event

- overSquare event now works for click move too

- New functions for chessboard

    - .showGhostPiece()

    - .enableHighlights()

    - .enableArrows()

    - .resizable()

    - .minSize()

    - .maxSize()

### Fixed

- Hover effect is no longer visible while dragging the piece outside of the board.

## 1.2.3

### Added

- Added CDN support

## 1.2.1

### Fixed

- Fixed the bug that occurs when user tries to promote with click

## 1.2.0

### Added

- Move pieces with click

- .getSquare() function

## 1.1.0

### Added

- Custom events

- addCss() function

### Fixed

- Promotion window images

- setPosition function all pieces black problem

## 1.0.1

### Fixed

- Fixed image sources

## 1.0.0

First version