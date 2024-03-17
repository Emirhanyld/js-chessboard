# js-chessboard

js-chessboard is a  simple JavaScript library that allows you to create chessboards on websites.

### What can it do?

- Move pieces by dragging and dropping with both the mouse and touch
- Set position with FEN


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

## License
[MIT](https://github.com/Emirhanyld/js-chessboard/blob/master/LICENSE)