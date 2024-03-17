export function initChessboard(element, { size = 400, orientation = "white", position = "start" } = {}) {
    let _element = element;
    let _size = typeof size == "number" ? size : 400;
    let _orientation = isValidOrientation(orientation) ? orientation : "white";
    let _position = null;
    let _fen = null;
    if (isValidFen(position)) {
        _position = fenToObject(position);
        _fen = position;
    }
    else if (isValidPosObj(position)) {
        _position = position;
        _fen = objectToFen(position);
    }
    else {
        _position = fenToObject("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
        _fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
    }
    let _lastMove = null;
    let _lastMovedPiece = null;
    let _arrowLayer = null;
    let _pieceLayer = null;
    let _arrows = [];
    let _from = null;
    let _dragging = false;

    let chessboard = {
        element: getElement,
        size: getSize,
        orientation: getOrientation,
        position: getPosition,
        fen: getFen,
        lastMove: getLastMove,
        lastMovedPiece: getLastMovedPiece,
        arrows: getArrows,

        flipBoard() {
            if (_orientation == "white") {
                return this.setOrientation("black");
            }
            else if (_orientation == "black") {
                return this.setOrientation("white");
            }
        },
    
        setOrientation(orientation) {
            if (!isValidOrientation(orientation)) {
                return;
            }
            if ((orientation = orientation.toLowerCase()) == _orientation) {
                return orientation;
            }
    
            if (orientation == "white") {
                let numbers = _element.querySelectorAll(".square-number");
                let letters = _element.querySelectorAll(".square-letter");
                let rows = _element.querySelectorAll(".chess-row");
                for (let i = 0; i < 8; i++) {
                    numbers[i].textContent = 8 - i;
                    letters[i].textContent = String.fromCharCode(97 + i);
                    let squares = rows[i].children;
                    for (let j = 0; j < 8; j++) {
                        squares[j].dataset["square"] = String.fromCharCode(97 + j) + (8 - i);
                    }
                }
                _orientation = "white";
            }
            else if (orientation == "black") {
                let numbers = _element.querySelectorAll(".square-number");
                let letters = _element.querySelectorAll(".square-letter");
                let rows = _element.querySelectorAll(".chess-row");
                for (let i = 0; i < 8; i++) {
                    numbers[i].textContent = i + 1;
                    letters[i].textContent = String.fromCharCode(104 - i);
                    let squares = rows[i].children;
                    for (let j = 0; j < 8; j++) {
                        squares[j].dataset["square"] = String.fromCharCode(104 - j) + (i + 1);
                    }
                }
                _orientation = "black";
            }
            this.setPosition(_position);
    
            if (_lastMove) {
                let lastSquares = _lastMove.split(" ");
                _element.querySelector(`div[data-square="${lastSquares[0]}"]`).classList.add("last-move");
                _element.querySelector(`div[data-square="${lastSquares[1]}"]`).classList.add("last-move");
            }
    
            return orientation;
        },
    
        setPosition(position) {
            if (!isValidPosition(position)) {
                return;
            }
            if (typeof position == "string") {
                position = position.toLowerCase();
                if (position == "start") {
                    let startFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
                    position = fenToObject(startFen);
                    _position = position;
                    _fen = startFen;

                    return _fen;
                }
                else if (position == "empty") {
                    this.clearPieces();
                    this.clearHighlights();
                    this.clearArrows();
                    let lastMoveSquares = _element.querySelectorAll("div.last-move");
                    if (lastMoveSquares) {
                        lastMoveSquares.forEach(square => {
                            square.classList.remove("last-move");
                        });
                    }

                    return _fen;
                }
                else {
                    _position = fenToObject(position);
                    _fen = position;
                    position = _position;
                }
            }
    
            this.clearPieces();
            this.clearHighlights();
            this.clearArrows();
            let lastMoveSquares = _element.querySelectorAll("div.last-move");
            if (lastMoveSquares) {
                lastMoveSquares.forEach(square => {
                    square.classList.remove("last-move");
                });
            }
    
    
    
            for (const square in position) {
                this.setPiece(position[square], square);
            }
    
            _position = position;
            _fen = objectToFen(position);

            return _fen;
        },
    
        setPiece(pieceName, square) {
            if (!isValidPiece(pieceName) || !isValidSquare(square))
                return;
    
            square = square.toLowerCase();
    
            if (this.getPiece(square))
                return;
    
            let piece = document.createElement("img");
            piece.draggable = false;
            piece.classList.add("piece");
            const folderPath = new URL('.', new URL(import.meta.url)).pathname.slice(0, -4);
            piece.src = `${folderPath}alpha/${pieceName}.svg`;
    
            if (_orientation == "black") {
                piece.style.translate = (104 - square.charCodeAt(0)) * 100 + "% " + (parseInt(square.charAt(1)) - 1) * 100 + "%";
            }
            else {
                piece.style.translate = (square.charCodeAt(0) - 97) * 100 + "% " + (8 - parseInt(square.charAt(1))) * 100 + "%";
    
            }
            piece.dataset["square"] = square;
            piece.dataset["piece"] = pieceName;
    
            let shift = _size / 16;
            function moveAt(x, y) {
                piece.setAttribute("style", `width: ${shift * 2}px; height: ${shift * 2}px; left: ${x - shift}px; top: ${y - shift}px; position: fixed;`);
            }
    
            piece.addEventListener("mousedown", (e) => {
                if (e.button == 2) {
                    e.preventDefault();
                    _element.querySelector(`div[data-square="${piece.dataset["square"]}"]`).dispatchEvent(new MouseEvent('mousedown', { 'bubbles': true, cancelable: true, button: 2 }));
                    return;
                }
                if (e.button != 0 || _dragging) {
                    return;
                }
    
                let board = this;
                e.target.classList.add("dragging", "no-transition");
                _element.querySelector(`div[data-square=${e.target.dataset["square"]}]`).classList.add("last-move");
    
                let ghostPiece = document.createElement("img");
                ghostPiece.src = piece.src;
                ghostPiece.classList.add("ghost-piece");
                ghostPiece.style.translate = piece.style.translate;
                _pieceLayer.appendChild(ghostPiece);
    
                let currentSquare = null;
                shift = _size / 16;
                function moveHandler(e) {
                    moveAt(e.clientX, e.clientY);
                    _dragging = true;
    
    
                    e.target.hidden = true;
                    let overElem = document.elementFromPoint(e.clientX, e.clientY);
                    e.target.hidden = false;
                    if (!_element.contains(overElem)) {
                        return;
                    }
                    if (overElem.classList.contains("piece")) {
                        overElem = _element.querySelector(`div[data-square=${overElem.dataset["square"]}]`);
                    }
                    if (currentSquare != overElem) {
                        if (currentSquare) {
                            currentSquare.classList.remove("hover");
                        }
                        currentSquare = overElem;
                        currentSquare.classList.add("hover");
                    }
                }
    
                document.addEventListener("mousemove", moveHandler);
                e.target.addEventListener("mouseup", function listener(e) {
                    document.removeEventListener("mousemove", moveHandler);
                    e.target.removeEventListener("mouseup", listener);
    
                    e.target.hidden = true;
                    let overElem = document.elementFromPoint(e.clientX, e.clientY);
                    e.target.hidden = false;
                    if (!_element.contains(overElem)) {
                        piece.setAttribute("style", "translate: " + ghostPiece.style.translate);
                        if (!_lastMove || _lastMove.split(" ")[1] != piece.dataset["square"]) {
                            _element.querySelector(`div[data-square="${piece.dataset["square"]}"]`).classList.remove("last-move");
                        }
                        piece.classList.remove("dragging", "no-transition");
                        ghostPiece.remove();
                        return;
                    }
    
                    if (overElem.classList.contains("piece")) {
                        overElem = _element.querySelector(`div[data-square=${overElem.dataset["square"]}]`);
                    }

                    if (overElem.classList.contains("square")) {
                        overElem.classList.remove("hover");
                        board.movePiece(e.target.dataset["square"], overElem.dataset["square"], false);
                    }
                    else {
                        piece.setAttribute("style", "translate: " + ghostPiece.style.translate);
                        if (!_lastMove || _lastMove.split(" ")[1] != piece.dataset["square"]) {
                            _element.querySelector(`div[data-square="${piece.dataset["square"]}"]`).classList.remove("last-move");
                        }
                    }
                    ghostPiece.remove();
                    piece.classList.remove("dragging", "no-transition");
                });
            });
    
            piece.addEventListener("click", () => {
                if (_dragging) {
                    _dragging = false;
                    return;
                }
                this.clearHighlights();
                this.clearArrows();
            });
    
            piece.addEventListener("touchstart", (e) => {
                let board = this;
                e.target.classList.add("dragging", "no-transition");
                _element.querySelector(`div[data-square=${e.target.dataset["square"]}]`).classList.add("last-move");
    
                let ghostPiece = document.createElement("img");
                ghostPiece.src = piece.src;
                ghostPiece.classList.add("ghost-piece");
                ghostPiece.style.translate = piece.style.translate;
                _pieceLayer.appendChild(ghostPiece);
    
                let currentSquare = null;

                function moveHandler(e) {
                    if (e.touches[0].clientX != 0 || e.touches[0].clientY != 0) {
                        moveAt(e.touches[0].clientX, e.touches[0].clientY);
                    }
                    _dragging = true;
    
    
                    e.target.hidden = true;
                    let elemBelow = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
                    e.target.hidden = false;
                    if (elemBelow.classList.contains("piece")) {
                        elemBelow = _element.querySelector(`div[data-square=${elemBelow.dataset["square"]}]`);
                    }
                    if (currentSquare != elemBelow) {
                        if (currentSquare) {
                            currentSquare.classList.remove("hover");
                        }
                        currentSquare = elemBelow;
                        currentSquare.classList.add("hover");
                    }
                }
    
                document.addEventListener("touchmove", moveHandler, { passive: false });
                e.target.addEventListener("touchend", function listener(e) {
                    document.removeEventListener("touchmove", moveHandler);
                    e.target.removeEventListener("touchend", listener);
    
                    ghostPiece.remove();
                    e.target.hidden = true;
                    let overElem = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
                    e.target.hidden = false;
                    if (overElem.classList.contains("piece")) {
                        overElem = _element.querySelector(`div[data-square=${overElem.dataset["square"]}]`);
                    }
                    if (overElem.classList.contains("square")) {
                        overElem.classList.remove("hover");
                        board.movePiece(e.target.dataset["square"], overElem.dataset["square"], false);
                        if (!_lastMove || _lastMove.split(" ")[1] != piece.dataset["square"]) {
                            _element.querySelector(`div[data-square="${piece.dataset["square"]}"]`).classList.remove("last-move");
                        }
                    }
                    else {
                        piece.setAttribute("style", "translate: " + ghostPiece.style.translate);
                        if (!_lastMove || _lastMove.split(" ")[1] != piece.dataset["square"]) {
                            _element.querySelector(`div[data-square="${piece.dataset["square"]}"]`).classList.remove("last-move");
                        }
                    }
                    piece.classList.remove("dragging", "no-transition");
                });
            }, { passive: true });
    
            piece.addEventListener("mouseup", (e) => {
                if (e.button == 2) {
                    e.preventDefault();
                    _element.querySelector(`div[data-square="${piece.dataset["square"]}"]`).dispatchEvent(new MouseEvent('mouseup', { 'bubbles': true, cancelable: true, button: 2 }));
                }
            });

            piece.addEventListener("contextmenu", (e) => {
                e.preventDefault();
            });
    
            _pieceLayer.appendChild(piece);
            return piece;
        },

        getPiece(square) {
            if(!isValidSquare(square))
                return;
            square = square.toLowerCase();
            let piece = _element.querySelector(`img[data-square=${square}]`);
            return piece;
        },
    
        movePiece(fromSquare, toSquare, animation = false) {
            let board = this;
            fromSquare = fromSquare.toLowerCase();
            toSquare = toSquare.toLowerCase();
    
            let piece = _element.querySelector(`img[data-square=${fromSquare}]`);
            if (!isValidSquare(fromSquare) || !isValidSquare(toSquare) || !piece) {
                return;
            }
    
            if (_lastMovedPiece) {
                _lastMovedPiece.style.transition = "none";
            }
    
            if (!animation) {
                piece.classList.add("no-transition");
            }
            else {
                piece.classList.remove("no-transition");
            }
    
            if (piece.dataset["piece"] == "wp" && toSquare.charAt(1) == "8") {
                openPromotionWindow(fromSquare, toSquare, "white");
                piece.style.display = "none";
                return;
            }
            else if (piece.dataset["piece"] == "bp" && toSquare.charAt(1) == "1") {
                openPromotionWindow(fromSquare, toSquare, "black");
                piece.style.display = "none";
                return;
            }
    
            if (_orientation == "white") {
                piece.setAttribute("style", `translate: ${(toSquare.charCodeAt(0) - 97) * 100}% ${(8 - parseInt(toSquare.charAt(1))) * 100}%`);
            }
            else if (_orientation == "black") {
                piece.setAttribute("style", `translate: ${(104 - toSquare.charCodeAt(0)) * 100}% ${(parseInt(toSquare.charAt(1)) - 1) * 100}%`);
            }
    
            if (_element.querySelector(`img[data-square=${toSquare}]`) && fromSquare != toSquare) {
                _element.querySelector(`img[data-square=${toSquare}]`).remove();
            }
            if (fromSquare != toSquare) {
                let squares = _element.querySelectorAll("div.last-move");
                if (squares) {
                    squares.forEach(square => {
                        square.classList.remove("last-move");
                    });
                }
                _lastMove = fromSquare + " " + toSquare;
                _element.querySelector(`div[data-square=${fromSquare}]`).classList.add("last-move");
                _element.querySelector(`div[data-square=${toSquare}]`).classList.add("last-move");
            }
    
            piece.dataset["square"] = toSquare;
    
            delete _position[fromSquare];
            _position[toSquare] = piece.dataset["piece"];
    
            _lastMovedPiece = piece;

            function openPromotionWindow(fromSquare, toSquare, color) {
                let piece = board.getPiece(fromSquare);
                if (!piece || !isValidSquare(fromSquare) || !isValidSquare(toSquare))
                    return;
                
                fromSquare = fromSquare.toLowerCase();
                toSquare = toSquare.toLowerCase();
                let promotionWindow = document.createElement("div");
                promotionWindow.classList.add("promotion-window", _orientation == color ? "top" : "bottom");
                promotionWindow.tabIndex = 0;
                promotionWindow.onblur = () => {
                    board.movePiece(fromSquare, fromSquare);
                    piece.style.display = "";
                    promotionWindow.remove();
                };
                if (_orientation == "white") {
                    if (color == "white") {
                        promotionWindow.style.top = 0;
                        promotionWindow.style.left = ((toSquare.charCodeAt(0) - 97) * 12.5) + "%";
                    }
                    else {
                        promotionWindow.style.bottom = 0;
                        promotionWindow.style.right = ((104 - toSquare.charCodeAt(0)) * 12.5) + "%";
                    }
                }
                else {
                    if (color == "white") {
                        promotionWindow.style.bottom = 0;
                        promotionWindow.style.left = ((104 - toSquare.charCodeAt(0)) * 12.5) + "%";
                    }
                    else {
                        promotionWindow.style.top = 0;
                        promotionWindow.style.right = ((toSquare.charCodeAt(0) - 97) * 12.5) + "%";
                    }
                }
        
                let queen = document.createElement("img");
                queen.classList.add("promotion-piece", "no-select");
                queen.src = "alpha/" + (color == "white" ? "wq" : "bq") + ".svg";
                queen.onclick = () => {
                    promotionWindow.onblur = () => { };
                    piece.dataset["piece"] = color == "white" ? "wq" : "bq";
                    piece.src = queen.src;
                    board.movePiece(fromSquare, toSquare);
                    piece.style.display = "";
                    promotionWindow.remove();
                };
        
                let knight = document.createElement("img");
                knight.classList.add("promotion-piece", "no-select");
                knight.src = "alpha/" + (color == "white" ? "wn" : "bn") + ".svg";
                knight.onclick = () => {
                    promotionWindow.onblur = () => { };
                    piece.dataset["piece"] = color == "white" ? "wn" : "bn";
                    piece.src = knight.src;
                    board.movePiece(fromSquare, toSquare);
                    piece.style.display = "";
                    promotionWindow.remove();
                };
        
                let rook = document.createElement("img");
                rook.classList.add("promotion-piece", "no-select");
                rook.src = "alpha/" + (color == "white" ? "wr" : "br") + ".svg";
                rook.onclick = () => {
                    promotionWindow.onblur = () => { };
                    piece.dataset["piece"] = color == "white" ? "wr" : "br";
                    piece.src = rook.src;
                    board.movePiece(fromSquare, toSquare);
                    piece.style.display = "";
                    promotionWindow.remove();
                };
        
                let bishop = document.createElement("img");
                bishop.classList.add("promotion-piece", "no-select");
                bishop.src = "alpha/" + (color == "white" ? "wb" : "bb") + ".svg";
                bishop.onclick = () => {
                    promotionWindow.onblur = () => { };
                    piece.dataset["piece"] = color == "white" ? "wb" : "bb";
                    piece.src = bishop.src;
                    board.movePiece(fromSquare, toSquare);
                    piece.style.display = "";
                    promotionWindow.remove();
                };
        
                let close = document.createElement("i");
                close.classList.add("close-btn");
                close.onclick = () => {
                    promotionWindow.onblur = () => { };
                    piece.style.display = "";
                    board.movePiece(fromSquare, fromSquare);
                    promotionWindow.remove();
                };
        
                promotionWindow.appendChild(queen);
                promotionWindow.appendChild(knight);
                promotionWindow.appendChild(rook);
                promotionWindow.appendChild(bishop);
                promotionWindow.appendChild(close);
                _element.appendChild(promotionWindow);
                promotionWindow.focus();
            }

            return piece;
        },
    
        clearPieces() {
            let pieces = _element.querySelectorAll("img[data-piece]");
            pieces.forEach(piece => {
                piece.remove();
            });
            _position = {};
            _fen = "8/8/8/8/8/8/8/8";
        },
    
        clearHighlights() {
            let highlightedSquares = _element.querySelectorAll("div.highlight");
            highlightedSquares.forEach(square => {
                square.classList.remove("highlight");
            });
        },
    
        addArrow(fromSquare, toSquare) {
            if(!isValidSquare(fromSquare) || !isValidSquare(toSquare))
                return;

            for (let i = 0; i < _arrows.length; i++) {
                let arrow = _arrows[i];
                if (fromSquare == arrow.dataset["from"] && toSquare == arrow.dataset["to"]) {
                    arrow.remove();
                    _arrows.splice(i, 1);
                    return;
                }
            }
            let arrow = document.createElementNS("http://www.w3.org/2000/svg", "line");
            let x1, y1, x2, y2;
            if (_orientation == "white") {
                x1 = (fromSquare.charCodeAt(0) - 97) * 12.5 + 6.25;
                y1 = (8 - parseInt(fromSquare.charAt(1))) * 12.5 + 6.25;
                x2 = (toSquare.charCodeAt(0) - 97) * 12.5 + 6.25;
                y2 = (8 - parseInt(toSquare.charAt(1))) * 12.5 + 6.25;
            }
            else {
                x1 = (104 - fromSquare.charCodeAt(0)) * 12.5 + 6.25;
                y1 = (parseInt(fromSquare.charAt(1)) - 1) * 12.5 + 6.25;
                x2 = (104 - toSquare.charCodeAt(0)) * 12.5 + 6.25;
                y2 = (parseInt(toSquare.charAt(1)) - 1) * 12.5 + 6.25;
            }
            arrow.setAttribute("x1", `${x1}%`);
            arrow.setAttribute("y1", `${y1}%`);
            arrow.setAttribute("x2", `${x2}%`);
            arrow.setAttribute("y2", `${y2}%`);
            arrow.style.strokeWidth = "1.3%";
            arrow.dataset["from"] = fromSquare;
            arrow.dataset["to"] = toSquare;
    
            arrow.classList.add("arrow");
            _arrows.push(arrow);
            _arrowLayer.appendChild(arrow);

            return arrow;
        },
    
        clearArrows() {
            _arrows.forEach(arrow => {
                arrow.remove();
            });
            _arrows = [];
        },

        resize(size) {
            if(typeof size != "number")
                return;

            _size = size
            _element.setAttribute("style", `width: ${_size}px; height: ${_size}px; position: relative;`);
            return _size;
        },

        destroy() {
            _element.remove();
        }
    };


    
    function getElement() {
        return _element;
    }
    function getSize() {
        return _size;
    }
    function getOrientation() {
        return _orientation;
    }
    function getPosition() {
        return _position;
    }
    function getFen() {
        return _fen;
    }
    function getLastMove() {
        return _lastMove;
    }
    function getLastMovedPiece() {
        return _lastMovedPiece;
    }
    function getArrows() {
        return _arrows;
    }

    _element.classList.add("no-select");
    _element.setAttribute("style", `width: ${_size}px; height: ${_size}px; position: relative;`);
    /* Add Squares */
    for (let i = 0; i < 8; i++) {
        let row = document.createElement("div");
        for (let j = 0; j < 8; j++) {
            let square = document.createElement("div");
            square.classList.add("square");
            if ((i % 2 == 0 && j % 2 == 0) || (i % 2 == 1 && j % 2 == 1)) {
                square.classList.add("white-square");
            }
            else {
                square.classList.add("black-square");
            }
            if (j == 0) {
                let number = document.createElement("span");
                number.classList.add("square-text", "square-number");
                if (_orientation == "black") {
                    number.textContent = i + 1;
                }
                else {
                    number.textContent = 8 - i;
                }
                square.appendChild(number);
            }
            if (i == 7) {
                let letter = document.createElement("span");
                letter.classList.add("square-text", "square-letter");
                if (_orientation == "black") {
                    letter.textContent = String.fromCharCode(104 - j);
                }
                else {
                    letter.textContent = String.fromCharCode(97 + j);
                }
                square.appendChild(letter);
            }
            if (_orientation == "black") {
                square.dataset["square"] = String.fromCharCode(104 - j) + (i + 1);
            }
            else {
                square.dataset["square"] = String.fromCharCode(97 + j) + (8 - i);
            }

            square.addEventListener("click", () => {
                chessboard.clearHighlights();
                chessboard.clearArrows();
            });

            square.addEventListener("mousedown", (e) => {
                if (e.button == 2) {
                    _from = e.target;
                }
            });

            square.addEventListener("mouseup", (e) => {
                if (e.button == 2) {
                    if (_from == e.target) {
                        _from.classList.toggle("highlight");
                    }
                    else {
                        chessboard.addArrow(_from.dataset["square"], e.target.dataset["square"]);
                    }
                    _from = null;
                }
            });

            square.addEventListener("contextmenu", (e) => {
                e.preventDefault();
            });

            row.appendChild(square);
        }
        row.classList.add("chess-row");
        _element.appendChild(row);
    }

    _pieceLayer = document.createElement("div");
    _pieceLayer.classList.add("piece-layer");
    _element.appendChild(_pieceLayer);

    _arrowLayer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    _arrowLayer.classList.add("arrow-layer");
    let defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    let marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.id = "markerArrow";
    marker.setAttribute("markerWidth", "13");
    marker.setAttribute("markerHeight", "13");
    marker.setAttribute("refX", "5.9");
    marker.setAttribute("refY", "6.5");
    marker.setAttribute("orient", "auto");
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M2,4 L2,9 L7,6.5 L6,6");
    path.setAttribute("style", "fill: green");

    marker.appendChild(path);
    defs.appendChild(marker);
    _arrowLayer.appendChild(defs);
    _element.appendChild(_arrowLayer);

    chessboard.setOrientation(_orientation);
    chessboard.setPosition(_position);

    return chessboard;
}

function fenToObject(fen) {
    if (!isValidFen(fen))
        return;
    let rows = fen.split(" ")[0].split("/");
    let position = {};
    for (let i = 0; i < 8; i++) {
        let row = rows[i];
        let rank = 1;
        for (let j = 0; j < row.length; j++) {
            switch (row.charAt(j)) {
                case "p":
                    position[String.fromCharCode(96 + rank) + (8 - i)] = "bp";
                    break;
                case "r":
                    position[String.fromCharCode(96 + rank) + (8 - i)] = "br";
                    break;
                case "b":
                    position[String.fromCharCode(96 + rank) + (8 - i)] = "bb";
                    break;
                case "n":
                    position[String.fromCharCode(96 + rank) + (8 - i)] = "bn";
                    break;
                case "q":
                    position[String.fromCharCode(96 + rank) + (8 - i)] = "bq";
                    break;
                case "k":
                    position[String.fromCharCode(96 + rank) + (8 - i)] = "bk";
                    break;
                case "P":
                    position[String.fromCharCode(96 + rank) + (8 - i)] = "wp";
                    break;
                case "R":
                    position[String.fromCharCode(96 + rank) + (8 - i)] = "wr";
                    break;
                case "B":
                    position[String.fromCharCode(96 + rank) + (8 - i)] = "wb";
                    break;
                case "N":
                    position[String.fromCharCode(96 + rank) + (8 - i)] = "wn";
                    break;
                case "Q":
                    position[String.fromCharCode(96 + rank) + (8 - i)] = "wq";
                    break;
                case "K":
                    position[String.fromCharCode(96 + rank) + (8 - i)] = "wk";
                    break;
                default:
                    rank += parseInt(row.charAt(j)) - 1;
                    break;
            }
            rank += 1;
        }
    }

    return position;
}

function objectToFen(object) {
    if (!isValidPosObj(object))
        return;

    let fen;
    let rows = ["", "", "", "", "", "", "", ""];
    let squares = [
        ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"],
        ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"],
        ["a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3"],
        ["a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4"],
        ["a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5"],
        ["a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6"],
        ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"],
        ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"]
    ];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const square = squares[i][j];
            const piece = object[square];
            switch (piece) {
                case "bp":
                    rows[i] += "p";
                    break;
                case "br":
                    rows[i] += "r";
                    break;
                case "bb":
                    rows[i] += "b";
                    break;
                case "bn":
                    rows[i] += "n";
                    break;
                case "bq":
                    rows[i] += "q";
                    break;
                case "bk":
                    rows[i] += "k";
                    break;
                case "wp":
                    rows[i] += "P";
                    break;
                case "wr":
                    rows[i] += "R";
                    break;
                case "wb":
                    rows[i] += "B";
                    break;
                case "wn":
                    rows[i] += "N";
                    break;
                case "wq":
                    rows[i] += "Q";
                    break;
                case "wk":
                    rows[i] += "K";
                    break;
                default:
                    if (parseInt(rows[i].slice(-1))) {
                        rows[i] = rows[i].slice(0, -1) + (parseInt(rows[i].slice(-1)) + 1);
                    }
                    else {
                        rows[i] += "1";
                    }
                    break;
            }
        }
    }

    fen = `${rows[7]}/${rows[6]}/${rows[5]}/${rows[4]}/${rows[3]}/${rows[2]}/${rows[1]}/${rows[0]}`;
    return fen;
}

function isValidPiece(piece) {
    let chars = ['r', 'n', 'b', 'q', 'k', 'p'];
    if (typeof piece != "string" || piece.length !== 2)
        return;

    piece = piece.toLowerCase();
    if ((piece.charAt(0) != "w" && piece.charAt(0) != "b") || !chars.includes(piece.charAt(1))) {
        return;
    }

    return true;
}

function isValidSquare(square) {
    if (typeof square != "string" || square.length !== 2)
        return;

    let column = square.toLowerCase().charCodeAt(0);
    let row = parseInt(square.charAt(1));
    if (!row || column < 97 || column > 104 || row < 1 || row > 8)
        return;

    return true;
}

function isValidOrientation(orientation) {
    if (typeof orientation != "string")
        return;

    orientation = orientation.toLowerCase();
    if (orientation == "white" || orientation == "black")
        return true;

    return;
}

function isValidFen(fen) {
    if (typeof fen != "string")
        return;

    fen = fen.trim().replaceAll(/\s+/g, " ");
    let rows = fen.split(/\s/)[0].split("/");
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i], cols = 0;
        for (let j = 0; j < row.length; j++) {
            let x = parseInt(row.charAt(j));
            if (x) {
                cols += x;
                continue;
            }
            cols++;
        }
        if (cols != 8) {
            return;
        }
    }

    const regex = /\s*([rnbqkpRNBQKP1-8]+\/){7}([rnbqkpRNBQKP1-8]+)[\s\S]*/;
    return regex.test(fen);
}

function isValidPosObj(object) {
    if (typeof object != "object")
        return;

    for (const square in object) {
        if (Object.hasOwnProperty.call(object, square)) {
            const piece = object[square];
            if (!isValidPiece(piece) || !isValidSquare(square)) {
                return;
            }
        }
    }

    return true;
}

function isValidPosition(position) {
    if (typeof position == "string") {
        if (position.toLowerCase() == "empty" || position.toLowerCase() == "start")
            return true;

        return isValidFen(position);
    }

    if (typeof position == "object")
        return isValidPosObj(position);

    return;
}