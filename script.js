const X_CLASS = "x";
const O_CLASS = "o";

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const cellElements = document.querySelectorAll("[data-cell]");
const board = document.querySelector(".board");
const winningMessageElement = document.getElementById("winningMessage");
const winningMessageTextElement = document.querySelector(
  "[data-winning-message-text]"
);
const restartButton = document.getElementById("restartButton");
const statusElements = document.querySelectorAll(".status p span");
const playerOption = document.getElementById("playerOption");
const startSound = new Audio("ready.wav");
const clickSound = new Audio("start.wav");
const endSound = new Audio("end.wav");
let circleTurn;
let isComputerPlayer;
let scores = {
  player1: 0,
  tie: 0,
  player2: 0,
};

startGame();

restartButton.addEventListener("click", startGame);

playerOption.addEventListener("change", () => {
  startGame();
});

function startGame() {
  startSound.play();
  circleTurn = true;
  isComputerPlayer = playerOption.value === "computer";
  cellElements.forEach((cell) => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(O_CLASS);
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
  setBoardHoverClass();
  winningMessageElement.classList.remove("show");

  if (isComputerPlayer && circleTurn) {
    return;
  }

  if (isComputerPlayer && !circleTurn) {
    setTimeout(() => {
      computerMove();
    }, 1000);
  }
}

function handleClick(e) {
  clickSound.play();
  const cell = e.target;
  const currentClass = circleTurn ? X_CLASS : O_CLASS;
  placeMark(cell, currentClass);
  if (checkWin(currentClass)) {
    endGame(false);
  } else if (checkDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();

    if (isComputerPlayer && !circleTurn) {
      setTimeout(() => {
        computerMove();
      }, 1000);
    }
  }
}

function computerMove() {
  clickSound.play();
  const emptyCells = [...cellElements].filter((cell) => {
    return (
      !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)
    );
  });
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const cell = emptyCells[randomIndex];
  const currentClass = circleTurn ? X_CLASS : O_CLASS;
  placeMark(cell, currentClass);
  if (checkWin(currentClass)) {
    endGame(false);
  } else if (checkDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
  }
}

function endGame(draw) {
  endSound.play();
  if (draw) {
    winningMessageTextElement.innerText = "Draw!";
    scores.tie++;
  } else {
    winningMessageTextElement.innerText = `Player (${
      circleTurn ? "X" : "O"
    }) Wins!`;
    circleTurn ? scores.player1++ : scores.player2++;
  }
  updateStatus();
  winningMessageElement.classList.add("show");
  cellElements.forEach((cell) => {
    cell.removeEventListener("click", handleClick);
  });
}

function checkDraw() {
  return [...cellElements].every((cell) => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
  });
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function swapTurns() {
  circleTurn = !circleTurn;
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(O_CLASS);
  board.classList.add(circleTurn ? X_CLASS : O_CLASS);
}

function checkWin(currentClass) {
  return winningCombinations.some((combination) => {
    return combination.every((index) => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}

function updateStatus() {
  statusElements[0].innerText = scores.player1;
  statusElements[1].innerText = scores.tie;
  statusElements[2].innerText = scores.player2;
}
