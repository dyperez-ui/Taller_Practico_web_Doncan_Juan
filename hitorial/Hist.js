// Variables globales
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let attempts = 0;
let timer = null;
let seconds = 0;
let gameStarted = false;
let boardSize = 16; // 4x4 por defecto

// Elementos del DOM
const gameBoard = document.getElementById('game-board');
const attemptsElement = document.getElementById('attempts');
const timerElement = document.getElementById('timer');
const bestTimeElement = document.getElementById('best-time');
const startButton = document.getElementById('start-btn');
const difficultySelect = document.getElementById('difficulty');
const gameResult = document.getElementById('game-result');
const finalTimeElement = document.getElementById('final-time');
const finalAttemptsElement = document.getElementById('final-attempts');
const playAgainButton = document.getElementById('play-again-btn');

// Inicializar el juego
document.addEventListener('DOMContentLoaded', () => {
    // Cargar mejor tiempo desde localStorage
    const bestTime = localStorage.getItem('memoramaBestTime');
    if (bestTime) {
        bestTimeElement.textContent = formatTime(bestTime);
    }
    
    // Event listeners
    startButton.addEventListener('click', startGame);
    playAgainButton.addEventListener('click', startGame);
    difficultySelect.addEventListener('change', updateDifficulty);
});

// Actualizar la dificultad
function updateDifficulty() {
    const difficulty = difficultySelect.value;
    
    switch(difficulty) {
        case 'easy':
            boardSize = 16; // 4x4
            break;
        case 'medium':
            boardSize = 20; // 4x5
            break;
        case 'hard':
            boardSize = 30; // 5x6
            break;
    }
}

// Iniciar nuevo juego
function startGame() {
    // Reiniciar variables del juego
    clearInterval(timer);
    flippedCards = [];
    matchedPairs = 0;
    attempts = 0;
    seconds = 0;
    gameStarted = true;
    
    // Actualizar UI
    attemptsElement.textContent = attempts;
    timerElement.textContent = '00:00';
    gameResult.classList.add('hidden');
    
    // Configurar el tablero según la dificultad
    setupGameBoard();
    
    // Iniciar temporizador
    timer = setInterval(updateTimer, 1000);
}

// Configurar el tablero de juego
function setupGameBoard() {
    // Limpiar tablero
    gameBoard.innerHTML = '';
    
    // Determinar el número de columnas según la dificultad
    let columns;
    switch(difficultySelect.value) {
        case 'easy':
            columns = 4;
            break;
        case 'medium':
            columns = 5;
            break;
        case 'hard':
            columns = 6;
            break;
    }
    
    // Establecer el grid
    gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    
    // Crear pares de cartas
    const totalPairs = boardSize / 2;
    let cardValues = [];
    
    // Generar valores para las cartas (emojis o números)
    for (let i = 1; i <= totalPairs; i++) {
        cardValues.push(i);
        cardValues.push(i);
    }
    
    // Mezclar las cartas
    cardValues = shuffleArray(cardValues);
    
    // Crear las cartas en el tablero
    cards = [];
    for (let i = 0; i < boardSize; i++) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.value = cardValues[i];
        card.textContent = cardValues[i];
        
        card.addEventListener('click', () => flipCard(card));
        gameBoard.appendChild(card);
        cards.push(card);
    }
}

// Voltear una carta
function flipCard(card) {
    // No hacer nada si el juego no ha comenzado, la carta ya está volteada o ya fue emparejada
    if (!gameStarted || flippedCards.length === 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    // Voltear la carta
    card.classList.add('flipped');
    flippedCards.push(card);
    
    // Si hay dos cartas volteadas, comprobar si son iguales
    if (flippedCards.length === 2) {
        attempts++;
        attemptsElement.textContent = attempts;
        
        setTimeout(checkMatch, 700);
    }
}

// Comprobar si las cartas volteadas son iguales
function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.dataset.value === card2.dataset.value) {
        // Las cartas coinciden
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        
        // Comprobar si el juego ha terminado
        if (matchedPairs === boardSize / 2) {
            endGame();
        }
    } else {
        // Las cartas no coinciden, voltearlas de nuevo
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }
    
    // Reiniciar las cartas volteadas
    flippedCards = [];
}

// Finalizar el juego
function endGame() {
    clearInterval(timer);
    gameStarted = false;
    
    // Guardar el mejor tiempo si es necesario
    const bestTime = localStorage.getItem('memoramaBestTime');
    if (!bestTime || seconds < bestTime) {
        localStorage.setItem('memoramaBestTime', seconds);
        bestTimeElement.textContent = formatTime(seconds);
    }
    
    // Mostrar resultados
    finalTimeElement.textContent = formatTime(seconds);
    finalAttemptsElement.textContent = attempts;
    gameResult.classList.remove('hidden');
}

// Actualizar el temporizador
function updateTimer() {
    seconds++;
    timerElement.textContent = formatTime(seconds);
}

// Formatear el tiempo (segundos a MM:SS)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Mezclar array (algoritmo Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}