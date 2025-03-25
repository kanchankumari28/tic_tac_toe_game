// DOM Elements
const playerSetup = document.getElementById('player-setup');
const gameScreen = document.getElementById('game-screen');
const board = document.getElementById('board');
const winningLine = document.getElementById('winning-line');
const status = document.getElementById('status');
const restartBtn = document.getElementById('restart-btn');
const startBtn = document.getElementById('start-btn');
const playerXInput = document.getElementById('player-x');
const playerOInput = document.getElementById('player-o');

let playerX = '';
let playerO = '';
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

// Start Game Setup
startBtn.addEventListener('click', () => {
    // Validate name inputs
    if (!playerXInput.value.trim()) {
        alert('Please enter a name for Player X');
        return;
    }
    if (!playerOInput.value.trim()) {
        alert('Please enter a name for Player O');
        return;
    }

    // Set player names
    playerX = playerXInput.value.trim();
    playerO = playerOInput.value.trim();

    // Switch screens
    playerSetup.classList.add('hidden');
    gameScreen.classList.remove('hidden');

    // Initialize game
    createBoard();
    updateStatus();
});

// Create board cells
function createBoard() {
    board.innerHTML = ''; // Clear previous board
    winningLine.style.width = '0';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
    }
}

// Handle cell click
function handleCellClick(event) {
    const clickedCell = event.target;
    const cellIndex = clickedCell.getAttribute('data-index');

    if (gameBoard[cellIndex] !== '' || !gameActive) return;

    gameBoard[cellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    const winningCondition = checkWinner();
    if (winningCondition) {
        const winningPlayer = currentPlayer === 'X' ? playerX : playerO;
        status.textContent = `${winningPlayer} wins!`;
        gameActive = false;
        drawWinningLine(winningCondition);
    } else if (isDraw()) {
        status.textContent = "It's a draw!";
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateStatus();
    }
}

// Draw winning line
function drawWinningLine(condition) {
    const boardRect = board.getBoundingClientRect();
    const cells = document.querySelectorAll('.cell');
    const startCell = cells[condition[0]];
    const endCell = cells[condition[2]];

    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();

    // Calculate line position and angle
    const centerX = startRect.left + startRect.width / 2 - boardRect.left;
    const centerY = startRect.top + startRect.height / 2 - boardRect.top;
    const length = Math.sqrt(
        Math.pow(endRect.left - startRect.left, 2) + 
        Math.pow(endRect.top - startRect.top, 2)
    );

    const angle = Math.atan2(
        endRect.top - startRect.top, 
        endRect.left - startRect.left
    ) * 180 / Math.PI;

    winningLine.style.position = 'absolute';
    winningLine.style.left = `${centerX}px`;
    winningLine.style.top = `${centerY}px`;
    winningLine.style.transformOrigin = 'left center';
    winningLine.style.transform = `rotate(${angle}deg)`;
    winningLine.style.width = `${length}px`;
}

// Update status message
function updateStatus() {
    const currentPlayerName = currentPlayer === 'X' ? playerX : playerO;
    status.textContent = `${currentPlayerName}'s turn (${currentPlayer})`;
}

// Check for winner
function checkWinner() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
        [0, 4, 8], [2, 4, 6]  // Diagonals
    ];

    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (
            gameBoard[a] && 
            gameBoard[a] === gameBoard[b] && 
            gameBoard[a] === gameBoard[c]
        ) {
            return condition;
        }
    }
    return null;
}

// Check for draw
function isDraw() {
    return gameBoard.every(cell => cell !== '');
}

// Restart game
function restartGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    winningLine.style.width = '0';
    createBoard();
    updateStatus();
}

// Restart button event listener
restartBtn.addEventListener('click', restartGame);