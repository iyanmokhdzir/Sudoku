let tileIds = [];

window.onload = function () {
  setupGrid();
};

function setupGrid() {
  for (let i = 0; i <=8; i++) {
    const grid = document.createElement("div");
    grid.id = i.toString();
    document.getElementById("board-wrapper").appendChild(grid);

    for (let j = 0; j <=8; j++) {
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

  generateRandomNumbersOnTiles();
}

console.log(tileIds);

function generateRandomNumbersOnTiles() {
    const randomIndex = Math.round(Math.random() * 81);
    const randomNum = Math.floor(Math.random() * 9) + 1;;
    const tileId = tileIds[randomIndex];
    const tile = document.getElementById(tileId);

    if (tile.innerText == "") {
        tile.value = randomNum;
        tile.readOnly = true;
    } else {
        generateRandomNumbersOnTiles();
    }

    console.log(randomIndex);
    console.log(randomNum);
    console.log(tileId);
}
