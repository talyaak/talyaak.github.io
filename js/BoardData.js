const PIECES = [ROOK, KNIGHT, BISHOP, KING, QUEEN, BISHOP, KNIGHT, ROOK];

// BoardData - our local JS database

class BoardData {
  /* The constructor receives the board pieces
  We can use board data to access the pieces, and
  info regarding them */

  constructor(pieces) {
    this.getInitialPieces();
  }

  // list of 32 pieces
  getInitialPieces() {
      this.pieces = [];
      for (let i = 0; i < BOARD_SIZE; i++) {
        this.pieces.push(new Piece(0, i, PIECES[i], WHITE_PLAYER));
        this.pieces.push(new Piece(1, i, PAWN, WHITE_PLAYER));
        this.pieces.push(new Piece(6, i, PAWN, BLACK_PLAYER));
        this.pieces.push(new Piece(7, i, PIECES[i], BLACK_PLAYER));
      }
  }
  // Returns piece in row, col, or undefined if not exists.
  getPiece(row, col) {
    for (let piece of this.pieces) {
        if (piece.row === row && piece.col === col) {
          return piece;
        }
      }
  }

  /* Checks if given parameters appoint to undefined
  cell (no piece in cell) */
  isEmpty(row, col) {
    return this.getPiece(row,col) === undefined;
  }

  // Checks if given parameters appoint to a 
  // piece which is of type 'player'
  isPlayer(row, col, player) {
    return !this.isEmpty(row, col) && this.getPiece(row, col).player === player;
  }

  removePiece(row, col) {
    for (let i = 0; i < this.pieces.length; i++) {
      const piece = this.pieces[i];
      if (piece.row === row && piece.col === col) {
        // Remove piece at index i
        this.pieces.splice(i, 1);
      }
    }
  }
}