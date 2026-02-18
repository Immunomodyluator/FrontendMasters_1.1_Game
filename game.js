function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

async function getWord() {
  const promise = await fetch('https://words.dev-apis.com/word-of-the-day');
  const proceedResponse = await promise.json();
  return proceedResponse.word;
}

async function sendWord() {
  const sendWord = await fetch('https://words.dev-apis.com/validate-word', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resultWord }),
  });
  return await sendWord.json();
}

let col = 0;
let row = 0;

function getGridDiv(col, row) {
  const grid = document.querySelector(`.game-map-grid`).querySelectorAll('.game-map');
  return grid[col].querySelectorAll('.box')[row];
}

function addDivKey(key) {
  getGridDiv(col, row).innerText = key.toUpperCase();
  if (col < 4) {
    col++;
  }
}

function handleEnter() {
  let enteredWord = '';
  for (let i = 0; i < 5; i++) {
    enteredWord += getGridDiv(i, row).innerText;
  }
  getWord().then((word) => {
    word = word.toUpperCase();
    if (word === enteredWord) {
      console.log('выйграл');
    } else {
      console.log('проиграл');
    }

    for (let i = 0; i < 5; i++) {
      if (enteredWord[i] === word[i]) {
        getGridDiv(i, row).classList.add('the-required-letter');
      }
    }
    if (getGridDiv(4, row).innerText !== '') {
      row++;
      col = 0;
    }
  });
}

function removeKeyFromDiv() {
  const div = getGridDiv(col, row);
  if (col > 0 && div.innerText === '') {
    col--;
    getGridDiv(col, row).innerText = '';
  } else if (div.innerText !== '') {
    getGridDiv(col, row).innerText = '';
  }
}

function initGame() {
  document.addEventListener('keydown', function (event) {
    if (!isLetter(event.key)) {
      switch (event.key) {
        case 'Enter':
          handleEnter();
          break;
        case 'Backspace':
          removeKeyFromDiv();
          break;
      }
    } else {
      addDivKey(event.key);
    }
  });
}

initGame();
