// ----- State -----
const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

let board = Array(9).fill("");
let currentPlayer = "X";
let gameOver = false;
let startingPlayer = "X";
const scores = { X: 0, O: 0, draw: 0 };

// ----- DOM -----
const cells = document.querySelectorAll(".cell");
const statusEl = document.getElementById("status");
const scoreEls = {
  X: document.getElementById("score-x"),
  O: document.getElementById("score-o"),
  draw: document.getElementById("score-draw")
};

// ----- Game logic -----
function findWinningLine() {
  return WIN_LINES.find(([a, b, c]) =>
    board[a] && board[a] === board[b] && board[a] === board[c]
  );
}

function handleMove(index) {
  if (gameOver || board[index]) return;

  board[index] = currentPlayer;
  const cell = cells[index];
  cell.textContent = currentPlayer;
  cell.classList.add("filled", currentPlayer.toLowerCase());
  cell.setAttribute("aria-label", `${cell.getAttribute("aria-label")}, ${currentPlayer}`);

  const winLine = findWinningLine();
  if (winLine) {
    endGame(currentPlayer, winLine);
  } else if (board.every(Boolean)) {
    endGame("draw");
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusEl.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function endGame(result, winLine) {
  gameOver = true;
  scores[result]++;
  scoreEls[result].textContent = scores[result];

  if (result === "draw") {
    statusEl.textContent = "It's a draw!";
  } else {
    statusEl.textContent = `Player ${result} wins!`;
    winLine.forEach(i => cells[i].classList.add("win"));
  }
  cells.forEach(c => (c.disabled = true));
}

function newRound() {
  board = Array(9).fill("");
  gameOver = false;
  startingPlayer = startingPlayer === "X" ? "O" : "X"; // alternate who starts
  currentPlayer = startingPlayer;

  cells.forEach((cell, i) => {
    cell.textContent = "";
    cell.className = "cell";
    cell.disabled = false;
    const row = Math.floor(i / 3) + 1;
    const col = (i % 3) + 1;
    cell.setAttribute("aria-label", `Row ${row}, column ${col}`);
  });
  statusEl.textContent = `Player ${currentPlayer}'s turn`;
}

function resetScores() {
  scores.X = scores.O = scores.draw = 0;
  Object.values(scoreEls).forEach(el => (el.textContent = "0"));
  startingPlayer = "O"; // newRound flips it back to X
  newRound();
}

// ----- Events -----
cells.forEach((cell, i) => cell.addEventListener("click", () => handleMove(i)));
document.getElementById("new-round").addEventListener("click", newRound);
document.getElementById("reset-scores").addEventListener("click", resetScores);
