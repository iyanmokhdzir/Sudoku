let tileIds = [];

window.onload = function () {
  setupGrid();

  const submitButton = document.getElementById("submit");
  submitButton.addEventListener("click", validateEmptyTiles);
};

function setupGrid() {
  for (let i = 0; i < 9; i++) {
    const grid = document.createElement("div");
    grid.id = i.toString();
    document.getElementById("board-wrapper").appendChild(grid);

    for (let j = 0; j < 9; j++) {
      const tile = document.createElement("input");
      tile.id = `${i}${j}`;
      tile.type = "text";
      tile.maxLength = 1;
      tile.min = 1;
      tile.max = 9;
      document.getElementById(i).appendChild(tile);
      tileIds.push(tile.id);

      tile.addEventListener("input", function (e) {
        // Remove non-digit characters and 0
        this.value = this.value.replace(/[^1-9]/, "");
      });
    }
  }

  for (let i = 0; i < 20; i++) {
    generateRandomNumbersOnTiles();
  }
}

console.log(tileIds);

function generateRandomNumbersOnTiles() {
  const randomIndex = Math.round(Math.random() * 81);
  const randomNum = Math.floor(Math.random() * 9) + 1;
  const tileId = tileIds[randomIndex];
  const tile = document.getElementById(tileId);

  if (tile.value == "") {
    tile.value = randomNum;
    tile.readOnly = true;
    tile.style.color = "rgb(132, 55, 204)";
    
  } else {
    generateRandomNumbersOnTiles();
  }

  /*
  console.log(randomIndex);
  console.log(randomNum);
  console.log(tileId);
  */
}

function validateEmptyTiles() {
  const tiles = document.querySelectorAll("input");
  let arrEmptyOrNot = [];

  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].value == "") {
      arrEmptyOrNot.push(false);
      alert("Please complete the game before submitting");
      break;
    }
  }

  if (!arrEmptyOrNot.includes(false)) {
    validateAnswer();
  }
}

function validateAnswer() {
  console.log("tiles are not empty");

  let arrCol = [];
  let arrRow = [];

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const tileRow = document.getElementById(`${i}${j}`);
      const tileCol = document.getElementById(`${j}${i}`);

      if (!arrRow.includes(tileRow.value)) {
        arrRow.push(tileRow.value);
      } else {
        tileRow.style.backgroundColor = "rgb(232, 176, 155)";
      }

      if (!arrCol.includes(tileCol.value)) {
        arrCol.push(tileCol.value);
      } else {
        tileCol.style.backgroundColor = "rgb(232, 176, 155)";
      }
    }

    arrCol = [];
    arrRow = [];
  }
}
