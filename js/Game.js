// Game is the class that handles rules of chess
class Game {
    constructor() {
        this.boardData = new BoardData();
        this.currentPlayer = WHITE_PLAYER;
        this.checkStatus = false; // If there is a "check" status ingame
    }

    /* Clicking on any cell/piece will result in calling this function
    The cell wil be 'selected' with a unique color. Also: cells that
    the Chess piece can move towards/are enemies - will be given another color*/
    showMovesForPiece(row, col) {
        // Clear all previous possible moves, selected and enemy
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
        console.log("tryMove()\nplayer: " + this.currentPlayer);
        const possibleMoves = this.getPossibleMoves(piece);
        // possibleMoves looks like this: [[1,2], [3,2]]
        for (const possibleMove of possibleMoves) {
            // possibleMove looks like this: [1,2]

            if (possibleMove[0] === row && possibleMove[1] === col) {
                // There is a legal move
                // If new (row,col) cell had enemy, enemy piece is removed 
                const removedPiece = this.boardData.getPiece(row, col);
                this.boardData.removePiece(row, col);
                if (removedPiece !== undefined && removedPiece.type === KING) {
                    this.winnerAnnounce(removedPiece);
                }
                piece.row = row;
                piece.col = col;
                if(this.checkKingDanger()) {
                    gameStatus.innerHTML = "Game Status: Check";
                    currentStatus = "Check";
                       
                }
                else {
                    gameStatus.innerHTML = "Game Status: Playing";
                    currentStatus = "Playing";  
                }
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
            return []; // No possible moves
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

    /* Goes through every piece in board data, check if any 
    of the pieces holds danger upon the opponent's king - CHECK*/
    checkKingDanger() {
        let tempPieces = this.boardData.pieces;
        for (let tempPiece of tempPieces) {
            let possibleMoves = tempPiece.getPossibleMoves(this.boardData);
            for (let possibleMove of possibleMoves) {
                let tempPossibleMove = this.boardData.getPiece(possibleMove[0], possibleMove[1]);
                if (tempPossibleMove !== undefined) {
                    if (tempPossibleMove.type === KING) {
                        // alert("CHECK, test\n"
                        // + tempPossibleMove.player
                        // + " team is threatned");
                        // dangerText = toString(tempPossibleMove.player)
                        return true;
                    }
                }
            }
        }
        return false;
    }
}