# js-chessboard

js-chessboard is a  simple JavaScript library that allows you to create chessboards on websites.

### Chess Alpha

This library uses [alpha pieces](https://www.enpassant.dk/chess/fonteng.htm#CALPHA) and it is "free for personal non commercial use".

### Bugs ands suggestions

You can report bugs or make suggestions in [this](https://github.com/Emirhanyld/js-chessboard/issues) site.

### What can it do?

- Move pieces by dragging and dropping with both the mouse and touch

- Set position with FEN

- Right-click to highlight squares

- Right-click and drag to add arrows

- Move pieces with click

- Resize board with mouse

- Transition between moves

### What cannot it do?

- Play with legal moves

- Change themes

- Read PGN

More features will be added from time to time.

### Install

```
npm install js-chessboard
```

### Import JavaScript

#### Via CDN

``` javascript
import { initChessboard } from "https://cdn.jsdelivr.net/npm/js-chessboard@2.0.0/src/chessboard.min.js"
```

#### In Local

``` javascript
import { initChessboard } from "./path/to/chessboard.js"
```

### Import Css

#### Via CDN

``` html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/js-chessboard@2.0.0/css/chessboard.min.css">
```

#### In Local
``` html
<link rel="stylesheet" href="./path/to/style.css">
```

#### With JavaScript
``` javascript
import { addCss } from "./path/to/chessboard.js"
addCss();
```

## API

### initChessboard(element, config = {})

The initChessboard function creates a div and creates the chessboard with the given configuration inside that div and then puts this div into the given element and returns chessboard as an object.

``` javascript
let elem = document.querySelector("#div");
let board = initChessboard(elem, config);
```

### Config

#### size

Sets the size of the chessboard. Must be a number. The default value is 400.

#### orientation

Sets the orientation of the chessboard. Must be a string. Can be either white or black. The default is white.

#### position

Sets the position of the chessboard. Can be a FEN string, a position object or a predefined position string. Predefined positions are "start" and "empty". The default position is the start position.

#### takeSameColor

Sets if the user can take same color pieces or not. Must be a boolean. Default value is false.

#### showGhostPiece

Sets if the ghost piece will be visible or not while dragging a piece. Default value is true,

#### enableHighlights

Sets if the user can highlight squares with right clicking. Default value is true.

#### enableArrows

Sets if the user can add arrows with right click drag. Default value is true.

#### resizable

Adds resize arrow to the bottom right corner if true. Default value is false.

#### minSize

Sets the minimum possible value for the board size. Default is null.

#### maxSize

Sets the maximum possible value for the board size. Default is null.

#### autoPromoteTo

Auto promotes to that piece instead of showing promotion window if set. Can be "q" (queen), "r" (rook), "n" (knight), "b" (bishop) or false for disable auto promotion. Default is false.

### Default config

``` javascript
config = {
    size: 400,
    orientation: "white",
    position: "start",
    takeSameColor: false,
    showGhostPiece: true,
    enableHighlights: true,
    enableArrows: true,
    resizable: false,
    minSize: null,
    maxSize: null,
    autoPromoteTo: false
}
```

### .element()

Returns element

``` javascript
board.element(); // element
```

### .size()

Returns size

``` javascript
board.size(); // 400
```

### .orientation()

Returns current orientation

``` javascript
board.orientation(); // "white"
```

### .position()

Returns the current position as an object

### .fen()

Returns the current position as a fen string

``` javascript
board.fen(); // "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
```

### .lastMove()

Returns the last played move as a string. This property's format is "x1 x2 x3 x4". x1 and x2 are from and to squares. x3 is taken piece if a piece is taken. Otherwise it is "-". x4 is the promoted piece if there was a promotion. Otherwise it is "-".

``` javascript
board.lastMove(); // "e2 e4 - -" -> e2 to e5 no piece is taken and no promotion
board.lastMove(); // "d4 e5 bp -" d4 to e5 and black pawn is taken no promotion
board.lastMove(); // "f7 g8 - wr" f7 to g8 no piece is taken and promoted to white rook
```

### .lastMovedPiece()

Returns the last moved piece as HTMLElement

### .arrows()

Returns arrows as an array of HTMLElements

### .showGhostPiece(showGhostPiece)

Returns the current showGhostPiece value if no parameter is passed or the passed parameter is not boolean. Otherwise it sets the showGhostPiece value and returns the new value.

### .enableHighlights(enableHighlight)

Returns the current enableHighlight value if no parameter is passed or the passed parameter is not boolean. Otherwise it sets the enableHighlight value and returns the new value.

### .enableArrows(enableArrows)

Returns the current enableArrows value if no parameter is passed or the passed parameter is not boolean. Otherwise it sets the enableArrows value and returns the new value.

### .minSize(newMinSize)

Returns the current minSize value if no parameter is passed or the passed parameter is not boolean. Otherwise it sets the minSize value and returns the new value.

### .maxSize(newMaxSize)

Returns the current maxSize value if no parameter is passed or the passed parameter is not boolean. Otherwise it sets the maxSize value and returns the new value.

### .autoPromoteTo(autoPromoteTo)

Returns the current autoPromoteTo value if no parameter is passed or the passed parameter is not a valid value. Otherwise it sets the autoPromoteTo value and returns the new value.

### .moves()

Returns move history as a string array. Moves format is same as lastMove. Move history and move counts changes if user goes back to another move and then makes a different move. .setPosition() clears move history and move counts.

### .totalMoveCount()

Returns total number of moves.

### .currentMoveCount()

Returns current move count.

### .flipBoard()

Flips board and returns new orientation.

### .setOrientation(orientation)

Sets the orientation of the chessboard to the given orientation and returns the new orientation if the given orientation is valid, otherwise undefined. 

``` javascript
board.setOrientation("black"); // "black"
board.setOrientation("example"); // undefined
```

### .setPosition(position)

Sets the position of the board with the given position. The position parameter can be a position object or a fen string. Returns the fen of the new position if the position is valid, otherwise undefined. Clears move history and move counts.

``` javascript
board.setOrientation("empty"); // "8/8/8/8/8/8/8/8"
```

### .setPiece(pieceName, square)

Places the piece with the given name in the given square. Returns undefined if pieceName or square is invalid or there is already a piece in the given square, otherwise returns piece as a HTMLElement.

``` javascript
// Places white rook to f4 square
board.setPiece("wr", "f4"); // img.piece
```

### .getPiece(square)

Returns the piece if there is a piece on the given square, null if there is not, undefined if the given square is invalid.

``` javascript
board.getPiece("g5"); // img.piece
board.getPiece("h9"); // undefined
```

### .getSquare(square)

Returns the square as an HTMLElement if there is a square on the given square, null if there is not, undefined if the given square is invalid. Square parameter must be string.

``` javascript
board.getSquare("g5"); // div.square
board.getSquare("h9"); // undefined
```

### .movePiece(fromSquare, toSquare, {animation = false, takeSameColor = false, promoteTo = null} = {})

Moves a piece from fromSquare to toSquare. Returns undefined if the one of the squares invalid or there is no piece, otherwise returns the moved piece. If animation is true then the last animation will be cut and the piece will move with animation. If takeSameColor is true then the piece will take same colored piece in the toSquare, if false then the piece won't move if there is a piece with the same color in the toSquare. If promoteTo is set to a piece ("q","r","n","b") then it automatically promotes to that piece instead of showing promotion window if there is a promotion.

``` javascript
board.movePiece("e2", "e4"); // img.piece
```

### .addArrow(fromSquare, toSquare)

Adds arrow from fromSquare to toSquare or removes arrow if there is already an arrow with the same squares. Returns the created arrow as a HTMLElement, or undefined if one of the squares is invalid.

``` javascript
board.addArrow("b5", "c3"); // line
```

### .resize(size)

Resizes the board. Returns new size or undefined if size is not a number.

``` javascript
board.resize(600); // 600
```

### .resizable(resizable)

Returns the current resizable value if no parameter is passed or the passed parameter is not boolean. Otherwise it sets the resizable value and returns the new value.

### .previousMove(animation = true)

Goes back one move and decreases the currentMoveCount by 1. If animation is true it animates the move. Returns currentMoveCount if it can goes back. Otherwise returns undefined.

### .nextMove(animation = true)

Goes forward one move and increases the currentMoveCount by 1. If animation is true it animates the move. Returns currentMoveCount if it can goes forward. Otherwise returns undefined.

### .toFirstMove()

Goes back to first move.

### .toLastMove()

Goes forward to last move.

### .clearPieces()

Removes all pieces from board.

``` javascript
board.clearPieces();
```

### .clearHighlights()

Clears all highlights from higlighted squares.

``` javascript
board.clearHighlights();
```

### .clearArrows()

Clears all arrows from board.

``` javascript
board.clearArrows();
```

### .destroy()

Destroys board and removes the element from html.

``` javascript
board.destroy();
```

### addCss()

Adds css file to the html document

``` javascript
import { addCss } from "./path/to/chessboard.js"
addCss();
```

### Position object

You can use a JavaScript object to define a position. Property names must be squares and values must be piece name.

``` javascript
let position = {
    e8 = "bk",
    h7 = "wr",
    d5 = "wk",
    e5 = "wp",
    f5 = "br"
}

 =>     +------------------------+
      8 | .  .  .  .  k  .  .  . |
      7 | .  .  .  .  .  .  .  R |
      6 | .  .  .  .  .  .  .  . |
      5 | .  .  .  K  P  r  .  . |
      4 | .  .  .  .  .  .  .  . |
      3 | .  .  .  .  .  .  .  . |
      2 | .  .  .  .  .  .  .  . |
      1 | .  .  .  .  .  .  .  . |
        +------------------------+
          a  b  c  d  e  f  g  h'
```

## Custom events

### pieceClick

Dispatched when the user clicks on a piece. The event has the piece property, which is the clicked piece as an HTMLElement.

``` javascript
board.addEventListener("pieceClick", (e) => {
  console.log(e.piece);
});
```

### pieceDragStart

Dispatched when the user starts dragging a piece. The event has piece property, which is the piece being dragged as an HTMLElement.

``` javascript
board.addEventListener("pieceDragStart", (e) => {
  console.log(e.piece);
});
```

### pieceDrag

Dispatched when the user drags a piece. The event has piece property, which is the piece being dragged as an HTMLElement.

``` javascript
board.addEventListener("pieceDrag", (e) => {
  console.log(e.piece);
});
```

### pieceDragEnd

Dispatched when the user finishes dragging a piece. The event has piece property, which is the piece being dragged as an HTMLElement.

``` javascript
board.addEventListener("pieceDragEnd", (e) => {
  console.log(e.piece);
});
```

### pieceMove

Dispatched when a piece is moved. The event has piece property, which is the moved piece as an HTMLElement, from property, which is the old square of the piece as a string, to property, which is the new square of the piece as a string. 

``` javascript
board.addEventListener("pieceMove", (e) => {
  console.log(e.piece);
  console.log(e.from);
  console.log(e.to);
});
```

### positionChange

Dispatched when the position is changes. The event has oldPos property which is the old position as a FEN string and newPos property which is the new position as a FEN string.

``` javascript
board.addEventListener("positionChange", (e) => {
  console.log(e.oldPos);
  console.log(e.newPos);
});
```

### overSquare

Dispatched when the user drags a piece over a square. The event has piece property, which is the piece being dragged as an HTMLElement and square property as a string.

``` javascript
board.addEventListener("overSquare", (e) => {
  console.log(e.piece);
  console.log(e.square);
});
```

### dropOverSquare

Dispatched when the user drops a piece over a square. The event has piece property, which is the dropped piece as an HTMLElement and square property as a string.

``` javascript
board.addEventListener("dropOverSquare", (e) => {
  console.log(e.piece);
  console.log(e.square);
});
```

### promotionAttempt

Dispatched when the user opens the promotion window. The event has piece property, which is the piece that is being promoted as an HTMLElement.

``` javascript
board.addEventListener("promotionAttempt", (e) => {
  console.log(e.piece);
});
```

### promotion

Dispatched when the user promotes a piece. The event has piece property, which is the promoted piece as an HTMLElement, from property, which is the old square of the piece as a string, to property, which is the new square of the piece as a string, and promoteTo property, which is the new piece as a string.

``` javascript
board.addEventListener("promotion", (e) => {
  console.log(e.piece);
  console.log(e.from);
  console.log(e.to);
  console.log(e.promoteTo);
});
```

### promotionCancel

Dispatched when the user cancels a promotion. The event has piece property, which is the piece that the user attempted to promote as an HTMLElement.

``` javascript
board.addEventListener("promotionCancel", (e) => {
  console.log(e.piece);
});
```

### sizeChange

Dispatched when the size of the board changes. There is a property named newSize in the event.

``` javascript
board.addEventListener("sizeChange", (e) => {
  console.log(e.newSize);
});
```

## License
[MIT](https://github.com/Emirhanyld/js-chessboard/blob/master/LICENSE)