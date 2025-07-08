document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const gameBoard = document.getElementById('gameBoard');
    const gameStatus = document.getElementById('gameStatus');
    const resetBtn = document.getElementById('resetBtn');
    const pvpModeBtn = document.getElementById('pvpMode');
    const pvcModeBtn = document.getElementById('pvcMode');
    const xScoreEl = document.getElementById('xScore');
    const oScoreEl = document.getElementById('oScore');
    const drawScoreEl = document.getElementById('drawScore');
    const themeToggle = document.getElementById('themeToggle');

    // Game Variables
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;
    let gameMode = 'pvp'; // 'pvp' or 'pvc'
    let scores = { X: 0, O: 0, draws: 0 };

    // Initialize Game
    function initGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        renderBoard();
        updateStatus();
    }

    // Render Board
    function renderBoard() {
        gameBoard.innerHTML = '';
        board.forEach((cell, index) => {
            const cellEl = document.createElement('div');
            cellEl.classList.add('cell');
            if (cell) cellEl.classList.add(cell.toLowerCase());
            cellEl.setAttribute('data-index', index);
            cellEl.addEventListener('click', handleCellClick);
            gameBoard.appendChild(cellEl);
        });
    }

    // Handle Cell Click
    function handleCellClick(e) {
        const index = e.target.getAttribute('data-index');
        
        if (board[index] !== '' || !gameActive) return;

        board[index] = currentPlayer;
        renderBoard();
        checkGameResult();

        if (gameMode === 'pvc' && gameActive && currentPlayer === 'O') {
            setTimeout(makeAIMove, 500);
        }
    }

    // Check Game Result
    function checkGameResult() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        let roundWon = false;

        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                roundWon = true;
                highlightWinningCells(pattern);
                break;
            }
        }

        if (roundWon) {
            scores[currentPlayer]++;
            updateScores();
            gameActive = false;
            gameStatus.textContent = `Player ${currentPlayer} wins!`;
            return;
        }

        if (!board.includes('')) {
            scores.draws++;
            updateScores();
            gameActive = false;
            gameStatus.textContent = 'Game ended in a draw!';
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateStatus();
    }

    // Highlight Winning Cells
    function highlightWinningCells(cells) {
        cells.forEach(index => {
            document.querySelector(`.cell[data-index="${index}"]`).classList.add('win');
        });
    }

    // Update Game Status
    function updateStatus() {
        gameStatus.textContent = gameMode === 'pvp' 
            ? `Player ${currentPlayer}'s turn` 
            : currentPlayer === 'X' 
                ? 'Your turn (X)' 
                : 'AI thinking...';
    }

    // Update Scores
    function updateScores() {
        xScoreEl.textContent = scores.X;
        oScoreEl.textContent = scores.O;
        drawScoreEl.textContent = scores.draws;
    }

    // AI Move (Simple AI)
    function makeAIMove() {
        if (!gameActive) return;

        // Find empty cells
        const emptyCells = board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);

        // Random move (for simplicity)
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        
        if (randomIndex !== undefined) {
            board[randomIndex] = 'O';
            renderBoard();
            checkGameResult();
        }
    }

    // Reset Game
    function resetGame() {
        initGame();
    }

    // Reset Scores
    function resetScores() {
        scores = { X: 0, O: 0, draws: 0 };
        updateScores();
    }

    // Switch Game Mode
    function switchMode(mode) {
        gameMode = mode;
        pvpModeBtn.classList.toggle('active', mode === 'pvp');
        pvcModeBtn.classList.toggle('active', mode === 'pvc');
        resetGame();
    }

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('darkMode', isDark);
    });

    // Check for saved theme preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Event Listeners
    resetBtn.addEventListener('click', resetGame);
    pvpModeBtn.addEventListener('click', () => switchMode('pvp'));
    pvcModeBtn.addEventListener('click', () => switchMode('pvc'));

    // Initialize
    initGame();
});