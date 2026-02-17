function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

let col = 0;
let row = 0;

function getGridDiv(col, row) {
  const grid = document.querySelector(`.game-map-grid`).querySelectorAll('.game-map');
  return grid[col].querySelectorAll('.box')[row];
}

function addDivKey(key) {
  console.log(col, row);
  const selectedDiv = getGridDiv(col, row);
  if (col > 3) {
    selectedDiv.innerText = key.toUpperCase();
  } else {
    selectedDiv.innerText = key.toUpperCase();
    col++;
  }
}

function handleEnter() {
  if (col < 3) {
    console.log('ничего');
  }
}

function initGame() {
  document.addEventListener('keydown', function (event) {
    if (!isLetter(event.key)) {
      switch (event.key) {
        case 'Enter':
          console.log(getGridDiv(col, row).innerText.length > 0);
          if (getGridDiv(col, row).innerText.length > 0) {
            row++;
            col = 0;
          }
          break;
      }
    } else {
      addDivKey(event.key);
    }
  });
}

initGame();
