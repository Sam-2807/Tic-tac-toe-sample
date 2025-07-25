document.addEventListener('DOMContentLoaded', () => {

    // DOM Elements
    const setupScreen = document.getElementById('setup-screen');
    const mainGameScreen = document.getElementById('main-game-screen');
    const startGameBtn = document.getElementById('start-game-btn');
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');
    const gameModeSelect = document.getElementById('game-mode');

    const cells = document.querySelectorAll('[data-cell]');
    const statusDisplay = document.getElementById('status');
    const restartButton = document.getElementById('restartButton');
    const themeToggle = document.getElementById('theme-toggle');
    
    const p1ScoreDisplay = document.getElementById('p1-score-display');
    const p2ScoreDisplay = document.getElementById('p2-score-display');

    const gameOverModal = document.getElementById('game-over-modal');
    const modalMessage = document.getElementById('modal-message');
    const playAgainBtn = document.getElementById('play-again-btn');

    const winningLine = document.getElementById('winning-line');

    const clickSound = document.getElementById('click-sound');
    const winSound = document.getElementById('win-sound');
    const drawSound = document.getElementById('draw-sound');

    // Game State
    let isGameActive = true;
    let currentPlayer = 'X';
    let gameState = ["", "", "", "", "", "", "", "", ""];
    let gameMode = 'player';
    let playerNames = { X: 'Player X', O: 'Player O' };
    let scores = { X: 0, O: 0 };

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // Functions
    function startGame() {
        gameMode = gameModeSelect.value;
        playerNames.X = player1Input.value || 'Player X';
        playerNames.O = (gameMode === 'computer') ? 'Computer' : (player2Input.value || 'Player O');
        
        setupScreen.classList.remove('active');
        mainGameScreen.classList.add('active');
        
        loadScores();
        updateScoreboard();
        handleRestartGame();
    }

    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = Array.from(cells).indexOf(clickedCell);

        if (gameState[clickedCellIndex] !== "" || !isGameActive) {
            return;
        }

        clickSound.currentTime = 0;
        clickSound.play();
        
        updateCell(clickedCell, clickedCellIndex);
        handleResultValidation();

        if (isGameActive && gameMode === 'computer' && currentPlayer === 'O') {
            setTimeout(computerMove, 500);
        }
    }

    function computerMove() {
        const emptyCells = gameState.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
        if(emptyCells.length === 0) return;

        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const cellToClick = cells[randomIndex];
        cellToClick.click();
    }
    
    function updateCell(cell, index) {
        gameState[index] = currentPlayer;
        cell.innerText = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());
    }

    function handlePlayerChange() {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusDisplay.innerText = `${playerNames[currentPlayer]}'s turn`;
        document.body.className = (currentPlayer === 'X') ? 'x-turn' : 'o-turn';
    }

    function handleResultValidation() {
        let roundWon = false;
        let winningCombination = [];

        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = gameState[winCondition[0]];
            let b = gameState[winCondition[1]];
            let c = gameState[winCondition[2]];
            if (a === '' || b === '' || c === '') continue;
            if (a === b && b === c) {
                roundWon = true;
                winningCombination = winCondition;
                break;
            }
        }

        if (roundWon) {
            isGameActive = false;
            winSound.play();
            scores[currentPlayer]++;
            saveScores();
            updateScoreboard();
            drawWinningLine(winningCombination);
            setTimeout(() => showGameOverModal(`${playerNames[currentPlayer]} has won!`), 600);
            return;
        }

        if (!gameState.includes("")) {
            isGameActive = false;
            drawSound.play();
            setTimeout(() => showGameOverModal(`Game ended in a draw!`), 100);
            return;
        }

        handlePlayerChange();
    }
    

function drawWinningLine(combination) {
    winningLine.style.display = 'block';
    winningLine.style.width = '0px'; // Reset width before animation
    winning-line.style.backgroundColor = (currentPlayer === 'X') ? 'var(--accent-color-x)' : 'var(--accent-color-o)';

    const board = document.getElementById('board');
    const boardRect = board.getBoundingClientRect();
    const startCell = cells[combination[0]].getBoundingClientRect();
    const endCell = cells[combination[2]].getBoundingClientRect();

    const startX = startCell.left + startCell.width / 2 - boardRect.left;
    const startY = startCell.top + startCell.height / 2 - boardRect.top;
    const endX = endCell.left + endCell.width / 2 - boardRect.left;
    const endY = endCell.top + endCell.height / 2 - boardRect.top;

    const deltaX = endX - startX;
    const deltaY = endY - startY;

    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    winningLine.style.width = `${length}px`;
    winningLine.style.transformOrigin = '0 0';
    winningLine.style.transform = `translate(${startX}px, ${startY}px) rotate(${angle}deg)`;
    winningLine.style.top = '0';
    winningLine.style.left = '0';
}


// Yeh function bhi update karein taaki line reset ho
function handleRestartGame() {
    isGameActive = true;
    currentPlayer = 'X';
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerText = `${playerNames[currentPlayer]}'s turn`;
    document.body.className = 'x-turn';
    cells.forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('x', 'o');
    });
    // winningLine ko hide karein
    winningLine.style.width = '0'; 
    winningLine.style.display = 'none'; // Ise add karein
    gameOverModal.style.display = 'none';
}

    function handleRestartGame() {
        isGameActive = true;
        currentPlayer = 'X';
        gameState = ["", "", "", "", "", "", "", "", ""];
        statusDisplay.innerText = `${playerNames[currentPlayer]}'s turn`;
        document.body.className = 'x-turn';
        cells.forEach(cell => {
            cell.innerText = '';
            cell.classList.remove('x', 'o');
        });
        winningLine.style.width = '0';
        gameOverModal.style.display = 'none';
    }
    
    function showGameOverModal(message) {
        modalMessage.innerText = message;
        gameOverModal.style.display = 'flex';
    }

    // Local Storage & Theme
    function saveScores() {
        localStorage.setItem('ticTacToeScores', JSON.stringify(scores));
    }

    function loadScores() {
        const savedScores = JSON.parse(localStorage.getItem('ticTacToeScores'));
        if (savedScores) {
            scores = savedScores;
        }
    }

    function updateScoreboard() {
        p1ScoreDisplay.innerText = `${playerNames.X}: ${scores.X}`;
        p2ScoreDisplay.innerText = `${playerNames.O}: ${scores.O}`;
    }

    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        themeToggle.innerText = isDarkMode ? '☀️' : '🌙';
        localStorage.setItem('ticTacToeTheme', isDarkMode ? 'dark' : 'light');
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem('ticTacToeTheme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.innerText = '☀️';
        }
    }

    // Event Listeners
    startGameBtn.addEventListener('click', startGame);
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', handleRestartGame);
    playAgainBtn.addEventListener('click', handleRestartGame);
    themeToggle.addEventListener('click', toggleTheme);
    
    // Initial Load
    loadTheme();
    setupScreen.classList.add('active'); // Show setup screen on load
});
