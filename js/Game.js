class Game {
    constructor() {
      this.boardData = new BoardData();
      this.currentPlayer = WHITE_PLAYER;
    }

    /* Clicking on any cell/piece will result in calling this function
    The cell wil be 'selected' with a unique color. Also: cells that
    the Chess piece can move towards/are enemies - will be given another color*/
    showMovesForPiece(row, col) {
        // Clear all previous possible moves and selected
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                table.rows[i].cells[j].classList.remove('possible-move');
                table.rows[i].cells[j].classList.remove('selected');
                table.rows[i].cells[j].classList.remove('enemy');
            }
        }
        
        // Using boardData to gain information
        const piece = this.boardData.getPiece(row, col);
        // Acquiring possible moves and giving them a color
        if (piece !== undefined) {
            let possibleMoves = piece.getPossibleMoves(this.boardData);
            for (let possibleMove of possibleMoves) {
                const cell = table.rows[possibleMove[0]].cells[possibleMove[1]];
                // Giving a 'eatable' enemy a color
                if (this.boardData.isPlayer(possibleMove[0], possibleMove[1], piece.getOpponent())) {
                    cell.classList.add('enemy');
                }
                // Giving cells in our path a color
                cell.classList.add('possible-move');
            }
        }
        
        // Giving the selected piece's cell a color
        table.rows[row].cells[col].classList.add('selected');
        selectedPiece = piece;
    }

    // Tries to actually make a move, returns true if successful.
    tryMove(piece, row, col) {
        console.log("player: " + this.currentPlayer);
        const possibleMoves = this.getPossibleMoves(piece);
        // possibleMoves looks like this: [[1,2], [3,2]]
        for (const possibleMove of possibleMoves) {
        // possibleMove looks like this: [1,2]
            
            if (possibleMove[0] === row && possibleMove[1] === col) {
                // There is a legal move
                // If new (row,col) cell had enemy, enemy piece is removed 
                const removedPiece = this.boardData.getPiece(row, col);
                this.boardData.removePiece(row, col);
                if (removedPiece !== undefined && removedPiece.type === KING){
                    this.winnerAnnounce(removedPiece);
                } 
                piece.row = row;
                piece.col = col;
                this.currentPlayer = piece.getOpponent();
                return true;
            }
        }
        return false;
    }

    getPossibleMoves(piece) {
        /* 'if' block executed only when selected piece isn't current
        player's piece, or when a winner has been chosen*/
        if (this.currentPlayer !== piece.player) {
            return [];
        }
        return piece.getPossibleMoves(this.boardData);
    }
    
    winnerAnnounce(removedPiece) {
        let winnerStr = removedPiece.getOpponent();
        winnerStr = winnerStr.charAt(0).toUpperCase() + winnerStr.slice(1);
        //winnerText - global from app.js
        winnerText = "Checkmate.\n" + winnerStr + " team won!";
        /* The above action will start an 'if' statement in
        app.js's createChessBoard(), adding a 'You Win!' popup
        Also will delete onCellClick's further actions */
    }

    checkTest() {
        // TODO: create an algorithm that calculates if any player's king is within reach
        // tl;dr - CHECKMATE

    }

}