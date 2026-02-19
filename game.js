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

function handleEnter(wordDay) {
  let enteredWord = '';
  for (let i = 0; i < 5; i++) {
    enteredWord += getGridDiv(i, row).innerText;
  }
  checkWord(enteredWord, wordDay);
}

function checkWord(enteredWord, wordDay) {
  for (let i = 0; i < 5; i++) {
    console.log(wordDay[i] === enteredWord[i]);
    if (wordDay[i] === enteredWord[i]) {
      getGridDiv(i, row).classList.add('the-required-letter');
    } else if (
      wordDay.indexOf(enteredWord[i]) !== -1 &&
      !getGridDiv(i, row).classList.contains('the-required-letter')
    ) {
      getGridDiv(i, row).classList.add('the-required-letter-in-bad-place');
    }
  }

  let resultGame = 0;

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 6; j++) {
      const grid = document.querySelector(`.game-map-grid`).querySelectorAll('.game-map');
      const gridCol = grid[i].querySelectorAll('.box')[j];
      if (gridCol.classList.contains('the-required-letter')) {
        resultGame++;
        break;
      }
    }
  }
  if (resultGame === 5) {
    alert(`Вы выйграли, загаданное слово: ${wordDay}`);
  }

  if (getGridDiv(4, row).innerText !== '') {
    row++;
    col = 0;
  }
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

async function initGame() {
  let wordDay = await getWord();
  wordDay = wordDay.toUpperCase();
  console.log(wordDay);
  document.addEventListener('keydown', function (event) {
    if (!isLetter(event.key)) {
      switch (event.key) {
        case 'Enter':
          handleEnter(wordDay);
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
