let tileIds = [];
let solution = [];

window.onload = function () {
  setupGrid();

  const submitNewGameButton = document.getElementById("submit-newGame");
  submitNewGameButton.addEventListener("click", validateEmptyTiles);

  const resetButton = document.getElementById("reset");
  resetButton.addEventListener("click", resetTiles);
};

function setupGrid() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const tile = document.createElement("input");
      tile.id = `${i}${j}`;
      tile.setAttribute("data-row", i);
      tile.setAttribute("data-col", j);
      tile.type = "text";
      tile.maxLength = 1;
      tile.min = 1;
      tile.max = 9;
      tile.autocomplete = "off";
      document.getElementById("board-wrapper").appendChild(tile);
      tileIds.push(tile.id);

      tile.addEventListener("input", function (e) {
        // Remove non-digit characters and 0
        this.value = this.value.replace(/[^1-9]/, "");
      });
    }
  }
  setGridIdOnTiles();
  generateSolution();
}

function setGridIdOnTiles() {
  let a = 0;
  for (let h = 0; h <= 54; h += 27) {
    for (let i = h; i <= h + 6; i += 3) {
      for (let j = i; j <= i + 18; j += 9) {
        for (let k = j; k <= j + 2; k++) {
          let tileId = tileIds[k];
          const tile = document.getElementById(`${tileId}`);
          tile.setAttribute("data-gridid", a);
        }
      }
      a++;
    }
  }
}

function generateSolution() {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillBoard(board);
  solution = board.map((row) => [...row]);
  renderBoard(board);
}

function fillBoard(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        const numbers = shuffle(Array.from({ length: 9 }, (_, i) => i + 1));
        for (let num of numbers) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (fillBoard(board)) {
              return true;
            }
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function isValid(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) {
      return false;
    }
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (board[i][j] === num) {
        return false;
      }
    }
  }

  return true;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function renderBoard(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const tile = document.getElementById(`${row}${col}`);
      tile.value = board[row][col];
      tile.readOnly = true;
      tile.style.color = "rgb(31, 20, 92)";
      tile.setAttribute("data-isprefilled", true);
    }
  }

  hideNumOnTiles();
}

function hideNumOnTiles() {
  const randomDifficultyLevel = Math.floor(Math.random() * 60) + 1;
  let count = 0;
  console.log(`num of tile values to be hidden: ${randomDifficultyLevel}`);

  while (count < randomDifficultyLevel) {
    const randomIndex = Math.floor(Math.random() * tileIds.length);
    const tileId = tileIds[randomIndex];
    const tile = document.getElementById(`${tileId}`);

    console.log(`tile id with hidden value: ${tileId}`);

    if (tile.value !== "") {
      tile.value = "";
      tile.readOnly = false;
      tile.style.color = "rgb(204, 37, 171)";
      tile.setAttribute("data-isprefilled", false);
    }

    count++;
  }
}

function resetTiles() {
  let tile = document.querySelectorAll(`input[data-isprefilled="false"]`);

  tile.forEach((input) => {
    if (input.value !== "") {
      input.value = "";
      console.log("board is reset");
    }
  });
}

function validateEmptyTiles() {
  const inputs = document.querySelectorAll(`input[type="text"]`);
  let inputValues = [];

  inputs.forEach((i) => {
    inputValues.push(i.value);
  });

  if (inputValues.includes("")) {
    alert("Please complete the game before submitting");
  } else {
    validateAnswer();
  }
}

function validateAnswer() {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const tile = document.getElementById(`${row}${col}`);
      if (tile.value != solution[row][col]) {
        alert("Incorrect solution. Please try again.");
        return;
      }
    }
  }
  alert("Congratulations! You have solved the Sudoku.");
}
