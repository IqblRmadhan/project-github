let secretNumber;
let min = 1;
let max = 100;
let maxAttempts = 10;
let attempts = 0;
let gameOver = false;
let previousGuess = null;

function loadConfig() {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      min = data.min;
      max = data.max;
      maxAttempts = data.maxAttempts;

      document.getElementById("range-info").textContent =
        `Tebak angka antara ${min} dan ${max}. Maksimal ${maxAttempts} percobaan.`;

      secretNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    })
    .catch(error => {
      document.getElementById("range-info").textContent = "Gagal memuat konfigurasi.";
      console.error("Gagal memuat data.json:", error);
    });
}

function checkGuess() {
  if (gameOver) return;

  const guessInput = document.getElementById('guess');
  const guess = parseInt(guessInput.value);
  const message = document.getElementById('message');

  if (isNaN(guess) || guess < min || guess > max) {
    message.textContent = `Masukkan angka antara ${min} dan ${max}.`;
    return;
  }

  attempts++;
  document.getElementById('attempts').textContent = `Percobaan: ${attempts}`;

  let clue = "";

  if (guess === secretNumber) {
    message.textContent = `🎉 Benar! Angkanya adalah ${secretNumber}.`;
    gameOver = true;
    document.getElementById('restartBtn').style.display = 'inline-block';
  } else {
    if (guess < secretNumber) {
      message.textContent = "Terlalu rendah!";
    } else {
      message.textContent = "Terlalu tinggi!";
    }

    // 🎯 Clue Ganjil atau Genap
    clue += ` Clue: Angka tersebut adalah ${secretNumber % 2 === 0 ? 'Genap' : 'Ganjil'}.`;

    // 🔁 Clue Lebih Dekat atau Lebih Jauh
    if (previousGuess !== null) {
      const prevDiff = Math.abs(secretNumber - previousGuess);
      const currDiff = Math.abs(secretNumber - guess);
      clue += ` Kamu ${currDiff < prevDiff ? 'lebih dekat' : 'lebih jauh'} dari sebelumnya.`;
    }

    message.textContent += clue;
  }

  if (attempts >= maxAttempts && !gameOver) {
    message.textContent = `😞 Game over! Angka yang benar adalah ${secretNumber}.`;
    gameOver = true;
    document.getElementById('restartBtn').style.display = 'inline-block';
  }

  previousGuess = guess;
  guessInput.value = '';
}

function restartGame() {
  attempts = 0;
  previousGuess = null;
  gameOver = false;
  document.getElementById('guess').value = '';
  document.getElementById('message').textContent = '';
  document.getElementById('attempts').textContent = 'Percobaan: 0';
  document.getElementById('restartBtn').style.display = 'none';
  loadConfig();
}

loadConfig();