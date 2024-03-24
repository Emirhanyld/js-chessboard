# js-chessboard

js-chessboard is a  simple JavaScript library that allows you to create chessboards on websites.

### What can it do?

- Move pieces by dragging and dropping with both the mouse and touch

- Set position with FEN

- Right-click to highlight squares

- Right-click and drag to add arrows

### What cannot it do?

- Move pieces with click

- Play with legal moves

- Change themes

- Read PGN

- Moving between moves

More features will be added from time to time.

### Install

```
npm install js-chessboard
```

### Import

``` javascript
import { initChesboard } from "./path/to/chessboard.js"
```

### Import Css

You can import css file with 2 ways.

With HTML
``` html
<link rel="stylesheet" href="./path/to/style.css">
```

Or with javascript
``` javascript
import { addCss } from "./path/to/chessboard.js"
addCss();
```

## API

### initChessboard(element, config = {})

The initChessboard function converts the given element into a chessboard with the given configuration and returns chessboard as an object.

``` javascript
let board = initChessboard();
```

Default config

``` javascript
config = {
    size = 400,
    orientation = "white",
    position = "start"
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

Returns the last played move as a string like

``` javascript
board.lastMove(); // "e2 e4"
```

### .lastMovedPiece()

Returns the last moved piece as HTMLElement

### .arrows()

Returns arrows as an array of HTMLElements

### .flipBoard()

Flips board and returns new orientation

### .setOrientation(orientation)

Sets the orientation of the chessboard to the given orientation and returns the new orientation if the given orientation is valid, otherwise undefined. 

``` javascript
board.setOrientation("black"); // "black"
board.setOrientation("example"); // undefined
```

### .setPosition(position)

Sets the position of the board with the given position. The position parameter can be a position object or a fen string. Returns the fen of the new position if the position is valid, otherwise undefined.

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

### .movePiece(fromSquare, toSquare, animation = false)

Moves a piece from fromSquare to toSquare with choice of animation. Returns undefined if the one of the squares invalid or there is no piece, otherwise returns the moved piece.

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

## License
[MIT](https://github.com/Emirhanyld/js-chessboard/blob/master/LICENSE)