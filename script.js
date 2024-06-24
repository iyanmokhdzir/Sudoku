let tileIds = [];
let arrGridIdTileId = [];

window.onload = function () {
  setupGrid();

  const submitButton = document.getElementById("submit");
  submitButton.addEventListener("click", validateEmptyTiles);
};

function setupGrid() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const tile = document.createElement("input");
      tile.id = `${i}${j}`;
      tile.row = `${i}`;
      tile.col = `${j}`;
      tile.type = "text";
      tile.maxLength = 1;
      tile.min = 1;
      tile.max = 9;
      document.getElementById("board-wrapper").appendChild(tile);
      tileIds.push(tile.id);

      tile.addEventListener("input", function (e) {
        // Remove non-digit characters and 0
        this.value = this.value.replace(/[^1-9]/, "");
      });
    }
  }

  setGridIdOnTiles();

  for (let i = 0; i < 30; i++) {
    setRandomNumOnTiles();
  }
}

//console.log(tileIds);

function setGridIdOnTiles() {
  let a = 0;
  for (let h = 0; h <= 54; h += 27) {
    for (let i = h; i <= h + 6; i += 3) {
      for (let j = i; j <= i + 18; j += 9) {
        for (let k = j; k <= j + 2; k++) {
          let tileId = tileIds[k];
          const tile = document.getElementById(`${tileId}`);
          tile.setAttribute("gridid", a);
          arrGridIdTileId.push([a, tileId]);
          // console.log(`Index: ${k} - Tile ID: ${tileId} - Grid ID: ${a}`)
        }
      }
      a++;
    }
  }

  /*
  let test = document.getElementById("04");
  let test2 = test.getAttribute("gridid"); 
  console.log(test2); //should return 1
  */
}

console.log(arrGridIdTileId);

function setRandomNumOnTiles() {
  const randomTileIndex = generateRandomTileIndex();
  const tileId = tileIds[randomTileIndex];
  const tileIdSplit = tileId.split("");
  const tileRow = tileIdSplit[0];
  const tileCol = tileIdSplit[1];
  const tile = document.getElementById(tileId);
  const gridId = tile.getAttribute("gridid");
  const randomNum = generateRandomNumber();
  const gridValues = [],
    colValues = [],
    rowValues = [];

  const inputs = document.querySelectorAll(`input[gridid="${gridId}"]`);
  inputs.forEach((input) => {
    gridValues.push(input.value);
  });

  for (let i = 0; i < 9; i++) {
    const tileCheck = document.getElementById(`${tileRow}${i}`);
    colValues.push(tileCheck.value);
  }

  for (let i = 0; i < 9; i++) {
    const tileCheck = document.getElementById(`${i}${tileCol}`);
    rowValues.push(tileCheck.value);
  }

  console.log(`tile Id: ${tileId}`);
  console.log(`random num: ${randomNum}`);
  console.log(`grid Id: ${gridId}`);
  console.log(`row: ${tileRow}`);
  console.log(`col: ${tileCol}`);
  console.log(gridValues);
  console.log(rowValues);
  console.log(colValues);
  console.log(`is tile empty ?: ${(tile.value == "")}`);
  console.log(`random num included in grid ?: ${gridValues.includes(randomNum.toString())}`);
  console.log(`random num included in col ?: ${colValues.includes(randomNum.toString())}`);
  console.log(`random num included in row ?: ${rowValues.includes(randomNum.toString())}`);

  if (tile.value == "" && !(gridValues.includes(randomNum.toString())) && !(colValues.includes(randomNum.toString())) && !(rowValues.includes(randomNum.toString()))) {
    tile.value = randomNum;
    tile.readOnly = true;
    tile.style.color = "rgb(207, 102, 23)";
  } else {
    setRandomNumOnTiles();
  }
}

function generateRandomNumber() {
  return Math.floor(Math.random() * 9) + 1;
}

function generateRandomTileIndex() {
  return Math.floor(Math.random() * tileIds.length);
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
}
