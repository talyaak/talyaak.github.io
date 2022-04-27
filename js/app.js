// Global variables - constants
const BOARD_SIZE = 8;
const WHITE_PLAYER = 'white';
const BLACK_PLAYER = 'black';
const PAWN = 'pawn';
const ROOK = 'rook';
const KNIGHT = 'knight';
const BISHOP = 'bishop';
const KING = 'king';
const QUEEN = 'queen';

const CHESS_BOARD_ID = 'chess-board';

let tableContainer, header, playingNow, winnerText="";

//Global variables - non-constants
let game;
let table;
let selectedPiece;

/* Creates an img element according to the parameters
it received, appends it to the cell */
function addImage(cell, player, name) {
  const image = document.createElement('img');
  image.src = 'images/' + player + '/' + name + '.png';
  cell.appendChild(image);
}



// When cells are clicked - this function starts
function onCellClick(row, col) {
    // first case click scenario (for first move)
    if (selectedPiece === undefined) {
      game.showMovesForPiece(row, col);
    } else {
      if (game.tryMove(selectedPiece, row, col)) { // this represents MOVEMENT of piece
        selectedPiece = undefined; // going back to first case scenario
        createChessBoard(game.boardData); // Recreate board - doesn't affect UX
      } else { // this represents clicking on non-'possible-move' cell
        game.showMovesForPiece(row, col);
      }
    }
    // TODO: Checkmate tester
    game.checkTest();

}


/* Called upon after the HTML 'load' event
Kickstarts creation of the Chess board*/
function _init() {
  // HTML manipulation - written text
  header = document.createElement('h1');
  header.innerHTML = "Chess Game";
  document.body.appendChild(header);
  tableContainer = document.createElement('div');
  document.body.appendChild(tableContainer);
  playingNow = document.createElement('div');
  document.body.appendChild(playingNow);
  playingNow.classList.add("playing-now"); 
  
  /* boardData is a data storing object, BoardData() will
   receive the initial chess pieces as an array */
  game = new Game();
  createChessBoard(game.boardData);
}

// Creates table, configures it as Chess board
function createChessBoard(boardData) {
  table = document.getElementById(CHESS_BOARD_ID);
  if (table !== null) {
    table.remove();
  }

  // Create empty chess board inside the HTML file:
  table = document.createElement('table');
  table.id = CHESS_BOARD_ID;
  tableContainer.appendChild(table);
  playingNow.innerHTML = "Currently playing: " + game.currentPlayer.toUpperCase();

  for (let row = 0; row < BOARD_SIZE; row++) {
    const rowElement = table.insertRow();
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = rowElement.insertCell();
      if ((row + col) % 2 === 0) {
        cell.className = 'light-cell';
      } else {
        cell.className = 'dark-cell';
      }
      // eventListener that calls onCellClick() after clicking on each cell
      cell.addEventListener('click', () => onCellClick(row, col));
    }
  }
  
  // Add pieces images to board
  for (let piece of boardData.pieces) {
    const cell = table.rows[piece.row].cells[piece.col];
    addImage(cell, piece.player, piece.type);
  }

  const winnerMsg = document.createElement('div');
  winnerMsg.textContent = winnerText;
  table.appendChild(winnerMsg);
  // When a winner is announced, this block is executed
  if (winnerMsg.textContent !== "") {
    winnerMsg.classList.add('winner-msg');
    playingNow.innerHTML="";
    /* After winner is declared, no need for onCellClick
    It's now redefined as an empty function*/
    onCellClick = function(){}
    
    // Refresh button - new game
    let button = document.createElement('button');
    button.setAttribute('onClick','location.reload()');
    button.innerHTML = "Start a new game"
    playingNow.appendChild(button);
  }
}

// After the HTML is loaded, createChessBoard() is called
window.addEventListener('load', _init);