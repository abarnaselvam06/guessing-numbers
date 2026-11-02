
// =====================================
// NUMBER GUESSING GAME - JAVASCRIPT
// =====================================

// GAME VARIABLES

let minLimit = 1;
let maxLimit = 100;
let secretNumber;

let attempts = 0;
let score = 100;
let hintsUsed = 0;

let guessHistory = [];

let timer = 0;
let timerInterval = null;

let timerStarted = false;
let gameOver = false;


// =====================================
// LOCAL STORAGE
// =====================================

let gamesPlayed =
    Number(localStorage.getItem("gamesPlayed")) || 0;

let gamesWon =
    Number(localStorage.getItem("gamesWon")) || 0;

let totalAttempts =
    Number(localStorage.getItem("totalAttempts")) || 0;

let bestScore =
    Number(localStorage.getItem("numberGameBestScore")) || 0;


// =====================================
// HTML ELEMENTS
// =====================================

const minInput = document.getElementById("minNumber");
const maxInput = document.getElementById("maxNumber");

const setRangeBtn = document.getElementById("setRangeBtn");
const rangeMessage = document.getElementById("rangeMessage");
const rangeDisplay = document.getElementById("rangeDisplay");

const guessInput = document.getElementById("guessInput");
const guessBtn = document.getElementById("guessBtn");
const hintBtn = document.getElementById("hintBtn");
const restartBtn = document.getElementById("restartBtn");

const message = document.getElementById("message");

const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const bestScoreDisplay = document.getElementById("bestScore");
const attemptsDisplay = document.getElementById("attempts");

const historyList = document.getElementById("history");
const hintsUsedDisplay = document.getElementById("hintsUsed");

const gamesPlayedDisplay = document.getElementById("gamesPlayed");
const gamesWonDisplay = document.getElementById("gamesWon");
const totalAttemptsDisplay = document.getElementById("totalAttempts");

// WINNING SCREEN ELEMENTS

const winScreen = document.getElementById("winScreen");

const winningNumber = document.getElementById("winningNumber");
const finalScore = document.getElementById("finalScore");
const finalBestScore = document.getElementById("finalBestScore");
const finalAttempts = document.getElementById("finalAttempts");
const finalTime = document.getElementById("finalTime");

const playAgainBtn = document.getElementById("playAgainBtn");


// =====================================
// START NEW GAME
// =====================================

function startGame() {

    clearInterval(timerInterval);

    secretNumber = Math.floor(
        Math.random() * (maxLimit - minLimit + 1)
    ) + minLimit;

    attempts = 0;
    score = 100;
    hintsUsed = 0;

    guessHistory = [];

    timer = 0;
    timerStarted = false;
    gameOver = false;

    // Reset displays

    timerDisplay.textContent = "0s";
    scoreDisplay.textContent = score;

    attemptsDisplay.textContent = attempts;
    hintsUsedDisplay.textContent = hintsUsed;

    rangeDisplay.textContent =
        `${minLimit} - ${maxLimit}`;

    historyList.innerHTML = "";

    guessInput.value = "";

    guessInput.min = minLimit;
    guessInput.max = maxLimit;

    message.textContent =
        `Guess a number between ${minLimit} and ${maxLimit}!`;

    // Enable controls

    guessInput.disabled = false;
    guessBtn.disabled = false;
    hintBtn.disabled = false;

    // Hide winning screen

    winScreen.style.display = "none";

    updateStats();
}


// =====================================
// TIMER FUNCTION
// =====================================

function startTimer() {

    if (timerStarted) return;

    timerStarted = true;

    timerInterval = setInterval(function() {

        timer++;

        timerDisplay.textContent = timer + "s";

        updateScore();

    }, 1000);

}


// =====================================
// SCORE FUNCTION
// =====================================

function updateScore() {

    score = Math.max(
        10,
        100
        - (attempts - 1) * 10
        - Math.floor(timer / 5) * 5
        - hintsUsed * 10
    );

    scoreDisplay.textContent = score;

}


// =====================================
// CHECK USER GUESS
// =====================================

function checkGuess() {

    if (gameOver) return;

    const guess = Number(guessInput.value);

    // Validate input

    if (
        guessInput.value.trim() === "" ||
        !Number.isSafeInteger(guess)
    ) {

        message.textContent =
            "Please enter a valid whole number!";

        return;
    }

    // Check number range

    if (guess < minLimit || guess > maxLimit) {

        message.textContent =
            `Enter a number between ${minLimit} and ${maxLimit}.`;

        return;
    }

    // Check duplicate guess

    if (guessHistory.includes(guess)) {

        message.textContent =
            "You already guessed that number!";

        return;
    }

    // Start timer

    startTimer();

    // INCREASE ATTEMPTS

    attempts++;

    totalAttempts++;

    // Store guess

    guessHistory.push(guess);

    // UPDATE COUNTERS IMMEDIATELY

    attemptsDisplay.textContent = attempts;

    totalAttemptsDisplay.textContent = totalAttempts;

    updateHistory();

    updateStats();

    // CHECK CORRECT ANSWER FIRST

    if (guess === secretNumber) {

        winGame();

        return;
    }

    // CHECK HOW CLOSE THE GUESS IS

    const difference =
        Math.abs(secretNumber - guess);

    if (difference <= 5) {

        message.textContent =
            "🔥 You are very close to guessing the number!";

    }

    else if (difference <= 10) {

        message.textContent =
            "😊 You are close to guessing the number!";

    }

    else if (guess < secretNumber) {

        message.textContent =
            "Too Low! Try a higher number.";

    }

    else {

        message.textContent =
            "Too High! Try a lower number.";

    }

    updateScore();

    guessInput.value = "";

    guessInput.focus();

}


// =====================================
// GUESS HISTORY
// =====================================

function updateHistory() {

    historyList.innerHTML = "";

    guessHistory.forEach(function(guess, index) {

        const li = document.createElement("li");

        li.textContent =
            `Attempt ${index + 1}: ${guess}`;

        historyList.appendChild(li);

    });

}


// =====================================
// HINT SYSTEM
// =====================================

function getHint() {

    if (gameOver) return;

    if (hintsUsed >= 2) {

        message.textContent =
            "You have used all your hints!";

        return;
    }

    hintsUsed++;

    if (hintsUsed === 1) {

        if (secretNumber % 2 === 0) {

            message.textContent =
                "💡 Hint: The number is EVEN.";

        }

        else {

            message.textContent =
                "💡 Hint: The number is ODD.";

        }

    }

    else {

        const midpoint =
            (minLimit + maxLimit) / 2;

        if (secretNumber <= midpoint) {

            message.textContent =
                "💡 Hint: The number is in the lower half of the range.";

        }

        else {

            message.textContent =
                "💡 Hint: The number is in the upper half of the range.";

        }

    }

    hintsUsedDisplay.textContent = hintsUsed;

    updateScore();

}


// =====================================
// WINNING FUNCTION
// =====================================

function winGame() {

    clearInterval(timerInterval);

    gameOver = true;

    gamesWon++;

    updateScore();

    // Update best score

    if (score > bestScore) {

        bestScore = score;

        localStorage.setItem(
            "numberGameBestScore",
            bestScore
        );

    }

    // Display winning details

    winningNumber.textContent = secretNumber;

    finalScore.textContent = score;

    finalBestScore.textContent = bestScore;

    finalAttempts.textContent = attempts;

    finalTime.textContent = timer;

    // Disable game controls

    guessInput.disabled = true;

    guessBtn.disabled = true;

    hintBtn.disabled = true;

    updateStats();

    // Show winning screen

    winScreen.style.display = "flex";

}


// =====================================
// UPDATE GAME STATISTICS
// =====================================

function updateStats() {

    // IMPORTANT: ATTEMPTS DISPLAY

    attemptsDisplay.textContent = attempts;

    // Other statistics

    gamesPlayedDisplay.textContent = gamesPlayed;

    gamesWonDisplay.textContent = gamesWon;

    totalAttemptsDisplay.textContent = totalAttempts;

    bestScoreDisplay.textContent = bestScore;

    // Save statistics

    localStorage.setItem(
        "gamesPlayed",
        gamesPlayed
    );

    localStorage.setItem(
        "gamesWon",
        gamesWon
    );

    localStorage.setItem(
        "totalAttempts",
        totalAttempts
    );

}


// =====================================
// SET CUSTOM NUMBER RANGE
// =====================================

function setNumberRange() {

    const min = Number(minInput.value);

    const max = Number(maxInput.value);

    // Validate input

    if (
        minInput.value.trim() === "" ||
        maxInput.value.trim() === "" ||
        !Number.isSafeInteger(min) ||
        !Number.isSafeInteger(max)
    ) {

        rangeMessage.textContent =
            "Please enter valid whole numbers.";

        return;
    }

    // Validate range

    if (min >= max) {

        rangeMessage.textContent =
            "Maximum number must be greater than minimum number!";

        return;
    }

    // Set range

    minLimit = min;

    maxLimit = max;

    gamesPlayed++;

    rangeMessage.textContent =
        `Your range is set: ${minLimit} to ${maxLimit}`;

    startGame();

}


// =====================================
// RESTART GAME
// =====================================

function restartGame() {

    gamesPlayed++;

    startGame();

}


// =====================================
// PLAY AGAIN
// =====================================

function playAgain() {

    gamesPlayed++;

    startGame();

}


// =====================================
// BUTTON EVENTS
// =====================================

guessBtn.addEventListener(
    "click",
    checkGuess
);

hintBtn.addEventListener(
    "click",
    getHint
);

restartBtn.addEventListener(
    "click",
    restartGame
);

setRangeBtn.addEventListener(
    "click",
    setNumberRange
);

playAgainBtn.addEventListener(
    "click",
    playAgain
);


// =====================================
// ENTER KEY SUPPORT
// =====================================

guessInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            checkGuess();

        }

    }
);


// =====================================
// INITIALIZE GAME
// =====================================

bestScoreDisplay.textContent = bestScore;

startGame();
