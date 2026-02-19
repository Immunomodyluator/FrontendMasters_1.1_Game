// Проверка, является ли символ буквой
function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

// Получение слова дня с API
async function getWord() {
  try {
    const response = await fetch('https://words.dev-apis.com/word-of-the-day');
    const data = await response.json();
    return data.word.toUpperCase();
  } catch (error) {
    console.error('Ошибка при получении слова:', error);
    alert('Не удалось загрузить слово. Попробуйте обновить страницу.');
    return null;
  }
}

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

let currentCol = 0;
let currentRow = 0;
let secretWord = '';
let isGameOver = false;
let isLoading = false;

// Получение ячейки по координатам (строка, колонка)
function getBox(row, col) {
  const rows = document.querySelectorAll('.game-map');
  return rows[row].querySelectorAll('.box')[col];
}

// Добавление буквы в ячейку
function addLetter(letter) {
  console.log('addLetter вызвана:', letter, 'currentCol:', currentCol, 'currentRow:', currentRow); // Отладка

  if (isGameOver || isLoading) {
    console.log('Игра окончена или загрузка:', { isGameOver, isLoading }); // Отладка
    return;
  }

  if (currentCol < WORD_LENGTH) {
    const box = getBox(currentRow, currentCol);
    box.innerText = letter.toUpperCase();
    box.classList.add('active');
    currentCol++;
    console.log('Буква добавлена, новый currentCol:', currentCol); // Отладка
  } else {
    console.log('Достигнут лимит букв'); // Отладка
  }
}

// Удаление последней буквы
function removeLetter() {
  if (isGameOver || isLoading) return;

  if (currentCol > 0) {
    currentCol--;
    const box = getBox(currentRow, currentCol);
    box.innerText = '';
    box.classList.remove('active');
  }
}

// Получение введённого слова
function getCurrentWord() {
  let word = '';
  for (let i = 0; i < WORD_LENGTH; i++) {
    word += getBox(currentRow, i).innerText;
  }
  return word;
}

// Обработка нажатия Enter
function handleEnter() {
  if (isGameOver || isLoading) return;

  // Проверка, что введено 5 букв
  if (currentCol !== WORD_LENGTH) {
    showMessage('Недостаточно букв');
    shakeRow(currentRow);
    return;
  }

  const enteredWord = getCurrentWord();

  // Проверка букв
  checkWord(enteredWord);

  // Проверка победы
  if (enteredWord === secretWord) {
    isGameOver = true;
    setTimeout(() => {
      showMessage(`🎉 Поздравляем! Вы угадали слово: ${secretWord}`);
    }, 500);
    return;
  }

  // Переход на следующую строку
  currentRow++;
  currentCol = 0;

  // Проверка поражения
  if (currentRow >= MAX_ATTEMPTS) {
    isGameOver = true;
    setTimeout(() => {
      showMessage(`😔 Игра окончена. Загаданное слово было: ${secretWord}`);
    }, 500);
  }
}

// Проверка введённого слова
function checkWord(enteredWord) {
  const secretLetters = secretWord.split('');
  const enteredLetters = enteredWord.split('');
  const letterCount = {};

  // Подсчёт букв в секретном слове
  secretLetters.forEach((letter) => {
    letterCount[letter] = (letterCount[letter] || 0) + 1;
  });

  // Первый проход - отмечаем точные совпадения (зелёные)
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (enteredLetters[i] === secretLetters[i]) {
      getBox(currentRow, i).classList.add('the-required-letter');
      letterCount[enteredLetters[i]]--;
    }
  }

  // Второй проход - отмечаем буквы не на своём месте (жёлтые) и неправильные (серые)
  for (let i = 0; i < WORD_LENGTH; i++) {
    const box = getBox(currentRow, i);

    if (enteredLetters[i] === secretLetters[i]) {
      // Уже обработано в первом проходе
    } else if (letterCount[enteredLetters[i]] > 0) {
      box.classList.add('the-required-letter-in-bad-place');
      letterCount[enteredLetters[i]]--;
    } else {
      box.classList.add('wrong-letter');
    }
  }
}

// Анимация тряски строки при ошибке
function shakeRow(row) {
  const rowElement = document.querySelectorAll('.game-map')[row];
  rowElement.classList.add('invalid-word');
  setTimeout(() => {
    rowElement.classList.remove('invalid-word');
  }, 500);
}

// Показ сообщения пользователю
function showMessage(message) {
  alert(message);
}

// Обработка нажатий клавиш
function handleKeyPress(event) {
  const key = event.key;
  console.log('Нажата клавиша:', key); // Отладка

  if (key === 'Enter') {
    handleEnter();
  } else if (key === 'Backspace') {
    removeLetter();
  } else if (isLetter(key)) {
    addLetter(key);
  }
}

// Инициализация игры
async function initGame() {
  console.log('Инициализация игры...'); // Отладка

  const loadingElement = document.getElementById('loading');

  if (!loadingElement) {
    console.error('Элемент loading не найден!');
    return;
  }

  // Показываем индикатор загрузки
  loadingElement.classList.remove('hidden');

  // Получаем слово дня
  secretWord = await getWord();

  // Скрываем индикатор загрузки
  loadingElement.classList.add('hidden');

  if (!secretWord) {
    console.error('Не удалось загрузить слово!');
    return; // Выход, если не удалось загрузить слово
  }

  // Для отладки (удалить в продакшене)
  console.log('Загаданное слово:', secretWord);
  console.log('Добавляем обработчик клавиатуры...');

  // Добавляем обработчик событий клавиатуры
  document.addEventListener('keydown', handleKeyPress);

  console.log('Игра готова! Начинайте вводить буквы.');
}

// Запуск игры после полной загрузки DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}
