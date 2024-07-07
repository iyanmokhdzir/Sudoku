let tileIds = [];
let solution = [];
let soundWin = new Audio("./sound-success.mp3");
let soundAlert = new Audio("./sound-alert.wav");
let soundGameStart = new Audio("./sound-gamestart.mp3");

window.onload = initializeGame;

function initializeGame() {
  const endPopup = document.getElementById("endPopup");
  endPopup.style.display = "none";

  const startGameButton = document.getElementById("startGame");
  startGameButton.addEventListener("click", startGame);
}

function startGame() {
  const startPopup = document.getElementById("startPopup");
  startPopup.style.display = "none";

  const mainWrapper = document.getElementById("main-wrapper");
  mainWrapper.style.display = "block";

  setupGrid();

  const submitNewGameButton = document.getElementById("submit-newGame");
  submitNewGameButton.addEventListener("click", validateEmptyTiles);

  const resetButton = document.getElementById("reset");
  resetButton.addEventListener("click", resetTiles);
}

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

  soundGameStart.play();
  soundGameStart.loop = false;

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
  getDifficultyLevel();
  hideNumOnTiles();
}

function getDifficultyLevel() {
  const radioButton = document.getElementsByName("difficulty");
  let difficultyLevel = "";

  for (i = 0; i < radioButton.length; i++) {
    if (radioButton[i].checked) difficultyLevel = radioButton[i].value;
  }

  return difficultyLevel;
}

function hideNumOnTiles() {
  const difficultyLevel = getDifficultyLevel();
  let randomDifficultyLevel;

  console.log(`the difficulty level is: ${difficultyLevel}`);

  if (difficultyLevel == 1) {
    randomDifficultyLevel = Math.floor(Math.random() * 21) + 5; //for easy, 5 to 25 tiles will be hidden ((upperLimit=25)-(startingLimit=5)+1, startingLimit=5)
  } else if (difficultyLevel == 2) {
    randomDifficultyLevel = Math.floor(Math.random() * 25) + 26; //for medium, 26 to 50 tiles will be hidden ((upperLimit=50)-(startingLimit=26)+1, startingLimit=26)
  } else {
    randomDifficultyLevel = Math.floor(Math.random() * 28) + 51; //for hard, 51 to 78 tiles will be hidden ((upperLimit=78)-(startingLimit=51)+1, startingLimit=51)
  }

  let count = 0;
  console.log(`num of tile values to be hidden: ${randomDifficultyLevel}`);

  while (count < randomDifficultyLevel) {
    const randomIndex = Math.floor(Math.random() * tileIds.length);
    const tileId = tileIds[randomIndex];
    const tile = document.getElementById(`${tileId}`);

    //console.log(`tile id with hidden value: ${tileId}`);

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
      soundGameStart.play();
      soundGameStart.loop = false;
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
    soundAlert.play();
    soundAlert.loop = false;

    const endPopup = document.getElementById("endPopup");
    endPopup.style.display = "flex";

    const endMessage = document.getElementById("endMessage");
    endMessage.innerHTML = "Please complete the puzzle before submitting.";

    const newGame = document.getElementById("close-newGame");
    newGame.innerHTML = "Close";
    newGame.addEventListener("click", function () {
      endPopup.style.display = "none";
    });
  } else {
    validateAnswer();
  }
}

function validateAnswer() {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const tile = document.getElementById(`${row}${col}`);
      if (tile.value != solution[row][col]) {
        const endPopup = document.getElementById("endPopup");
        endPopup.style.display = "flex";

        const endMessage = document.getElementById("endMessage");
        endMessage.innerHTML = "Please re-check your solution.";

        soundAlert.play();
        soundAlert.loop = false;

        const newGame = document.getElementById("close-newGame");
        newGame.innerHTML = "Close";
        newGame.addEventListener("click", function () {
          endPopup.style.display = "none";
        });

        return;
      }
    }
  }
  soundWin.play();
  soundWin.loop = false;

  const endPopup = document.getElementById("endPopup");
  endPopup.style.display = "flex";

  const endMessage = document.getElementById("endMessage");
  endMessage.innerHTML = "Congratulations!<br><br>You solved the puzzle!";

  const newGame = document.getElementById("close-newGame");
  newGame.innerHTML = "New Game";
  newGame.addEventListener("click", function () {
    location.reload();
  });
}
