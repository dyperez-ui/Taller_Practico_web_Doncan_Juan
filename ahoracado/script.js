// Palabras para el juego
// Palabras para el juego organizadas por categorías
const wordCategories = {
    animals: [
        'LEON', 'TIGRE', 'ELEFANTE', 'JIRAFA', 'COCODRILO', 
        'PINGÜINO', 'CANGURO', 'DELFIN', 'AGUILA', 'SERPIENTE', 
        'GORILA', 'RINOCERONTE', 'LOBO', 'OSO', 'CABALLO'
    ],
    countries: [
        'COLOMBIA', 'MEXICO', 'ARGENTINA', 'CHILE', 'PERU',
        'BRASIL', 'ECUADOR', 'URUGUAY', 'VENEZUELA', 'PARAGUAY',
        'BOLIVIA', 'ESPAÑA', 'PORTUGAL', 'FRANCIA', 'ITALIA'
    ],
    fruits: [
        'MANZANA', 'PERA', 'BANANO', 'MELON', 'SANDIA',
        'UVA', 'KIWI', 'FRESA', 'NARANJA', 'MANGO',
        'COCO', 'CEREZA', 'PAPAYA', 'GUAYABA', 'LIMON'
    ]
};

// Nombres de categorías para mostrar
const categoryNames = {
    animals: "Animales",
    countries: "Países",
    fruits: "Frutas"
};

// Elementos del DOM
const wordDisplay = document.getElementById('word-display');
const wrongLettersElement = document.getElementById('wrong-letters');
const wrongCountElement = document.getElementById('wrong-count');
const keyboard = document.getElementById('keyboard');
const message = document.getElementById('message');
const messageText = document.getElementById('message-text');
const playAgainButton = document.getElementById('play-again');
const figureParts = document.querySelectorAll('.figure');
const winsElement = document.getElementById('wins');
const lossesElement = document.getElementById('losses');
const resetGameButton = document.getElementById('reset-game');
const categoryButtons = document.querySelectorAll('.category-btn');
const currentCategoryElement = document.getElementById('current-category');

// Variables del juego
let selectedWord = '';
let correctLetters = [];
let wrongLetters = [];
let maxWrongAttempts = 6;
let wins = 0;
let losses = 0;
let gameActive = false;
let currentCategory = 'animals'; // Categoría por defecto

// Inicializar el juego
function initGame() {
    // Cargar estadísticas desde sessionStorage
    wins = parseInt(sessionStorage.getItem('hangmanWins')) || 0;
    losses = parseInt(sessionStorage.getItem('hangmanLosses')) || 0;
    winsElement.textContent = wins;
    lossesElement.textContent = losses;
    
    // Cargar categoría seleccionada
    const savedCategory = sessionStorage.getItem('hangmanCategory');
    if (savedCategory && wordCategories[savedCategory]) {
        currentCategory = savedCategory;
        // Activar el botón de la categoría guardada
        categoryButtons.forEach(btn => {
            if (btn.dataset.category === currentCategory) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        currentCategoryElement.textContent = categoryNames[currentCategory];
    }
    
    // Cargar estado del juego actual si existe
    const savedGameState = sessionStorage.getItem('hangmanGameState');
    if (savedGameState) {
        try {
            const gameState = JSON.parse(savedGameState);
            
            // Verificar si el juego guardado es válido y de la misma categoría
            if (gameState && gameState.selectedWord && 
                Array.isArray(gameState.correctLetters) && 
                Array.isArray(gameState.wrongLetters) &&
                gameState.category === currentCategory) {
                
                selectedWord = gameState.selectedWord;
                correctLetters = gameState.correctLetters;
                wrongLetters = gameState.wrongLetters;
                gameActive = gameState.gameActive || false;
                
                // Actualizar la interfaz con el estado guardado
                displayWord();
                updateWrongLetters();
                updateKeyboard();
                
                // Verificar si el juego ya terminó
                checkGameStatus();
                return;
            }
        } catch (e) {
            console.error("Error al cargar el juego guardado:", e);
        }
    }
    
    // Iniciar un nuevo juego si no hay estado guardado o es inválido
    resetGame();
}

// Guardar el estado actual del juego en sessionStorage
function saveGameState() {
    const gameState = {
        selectedWord,
        correctLetters,
        wrongLetters,
        category: currentCategory,
        gameActive: wrongLetters.length < maxWrongAttempts && 
                   !isWordComplete() &&
                   gameActive
    };
    sessionStorage.setItem('hangmanGameState', JSON.stringify(gameState));
}

// Guardar estadísticas en sessionStorage
function saveStats() {
    sessionStorage.setItem('hangmanWins', wins);
    sessionStorage.setItem('hangmanLosses', losses);
    sessionStorage.setItem('hangmanCategory', currentCategory);
}

// Cambiar categoría
function changeCategory(category) {
    if (!wordCategories[category] || category === currentCategory) return;
    
    currentCategory = category;
    currentCategoryElement.textContent = categoryNames[currentCategory];
    
    // Guardar la categoría seleccionada
    sessionStorage.setItem('hangmanCategory', currentCategory);
    
    // Reiniciar el juego con la nueva categoría
    resetGame();
}

// Inicializar el teclado
function initKeyboard() {
    keyboard.innerHTML = '';
    
    // Crear teclas para cada letra del abecedario
    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i);
        const button = document.createElement('button');
        button.classList.add('letter');
        button.textContent = letter;
        button.addEventListener('click', () => handleGuess(letter));
        keyboard.appendChild(button);
    }
    
    // Actualizar estado del teclado
    updateKeyboard();
}

// Actualizar el estado del teclado según las letras usadas
function updateKeyboard() {
    const buttons = keyboard.querySelectorAll('button');
    buttons.forEach(button => {
        const letter = button.textContent;
        if (correctLetters.includes(letter)) {
            button.disabled = true;
            button.classList.add('correct');
        } else if (wrongLetters.includes(letter)) {
            button.disabled = true;
            button.classList.add('incorrect');
        } else {
            button.disabled = false;
            button.classList.remove('correct', 'incorrect');
        }
    });
}

// Seleccionar una palabra aleatoria de la categoría actual
function getRandomWord() {
    const categoryWords = wordCategories[currentCategory];
    return categoryWords[Math.floor(Math.random() * categoryWords.length)];
}

// Mostrar la palabra oculta con guiones
function displayWord() {
    wordDisplay.innerHTML = selectedWord
        .split('')
        .map(letter => `
            <span class="letter-span">
                ${correctLetters.includes(letter) ? letter : '_'}
            </span>
        `)
        .join('');
}

// Comprobar si la palabra está completa
function isWordComplete() {
    return selectedWord
        .split('')
        .every(letter => correctLetters.includes(letter));
}

// Actualizar las letras incorrectas
function updateWrongLetters() {
    wrongCountElement.textContent = wrongLetters.length;
    
    wrongLettersElement.innerHTML = `
        ${wrongLetters.length > 0 ? '' : ''}
        ${wrongLetters.map(letter => `<span>${letter}</span>`).join(', ')}
    `;

    // Mostrar partes del ahorcado
    figureParts.forEach((part, index) => {
        const errors = wrongLetters.length;
        if (index < errors) {
            part.classList.remove('hidden');
        } else {
            part.classList.add('hidden');
        }
    });
}

// Comprobar el estado del juego
function checkGameStatus() {
    // Verificar si el jugador ganó
    if (isWordComplete()) {
        wins++;
        winsElement.textContent = wins;
        saveStats();
        showMessage('¡Felicidades! Ganaste. 😊');
        gameActive = false;
        return;
    }

    // Verificar si el jugador perdió
    if (wrongLetters.length === maxWrongAttempts) {
        losses++;
        lossesElement.textContent = losses;
        saveStats();
        showMessage(`Perdiste. La palabra era: ${selectedWord}`);
        gameActive = false;
        return;
    }
}

// Mostrar mensaje de victoria/derrota
function showMessage(msg) {
    messageText.innerText = msg;
    message.style.display = 'flex';
}

// Manejar la adivinanza de una letra
function handleGuess(letter) {
    // Si el juego no está activo, no hacer nada
    if (!gameActive) return;
    
    // Si la letra ya fue seleccionada, no hacer nada
    if (correctLetters.includes(letter) || wrongLetters.includes(letter)) {
        return;
    }

    if (selectedWord.includes(letter)) {
        // Letra correcta
        correctLetters.push(letter);
        displayWord();
    } else {
        // Letra incorrecta
        wrongLetters.push(letter);
        updateWrongLetters();
    }
    
    // Actualizar teclado
    updateKeyboard();
    
    // Comprobar estado del juego
    checkGameStatus();
    
    // Guardar el estado del juego
    saveGameState();
}

// Reiniciar el juego
function resetGame() {
    // Reiniciar variables
    correctLetters = [];
    wrongLetters = [];
    selectedWord = getRandomWord();
    gameActive = true;

    // Ocultar todas las partes del ahorcado
    figureParts.forEach(part => part.classList.add('hidden'));

    // Limpiar letras incorrectas
    wrongLettersElement.innerHTML = '';
    wrongCountElement.textContent = '0';

    // Ocultar mensaje
    message.style.display = 'none';

    // Actualizar teclado
    updateKeyboard();

    // Mostrar nueva palabra
    displayWord();
    
    // Guardar el estado del juego
    saveGameState();
}

// Limpiar completamente el sessionStorage
function clearSessionStorage() {
    sessionStorage.removeItem('hangmanGameState');
    sessionStorage.removeItem('hangmanWins');
    sessionStorage.removeItem('hangmanLosses');
    sessionStorage.removeItem('hangmanCategory');
    wins = 0;
    losses = 0;
    winsElement.textContent = wins;
    lossesElement.textContent = losses;
    
    // Reiniciar el juego después de limpiar
    resetGame();
}

// Inicializar el juego cuando se carga la página
window.addEventListener('DOMContentLoaded', () => {
    initKeyboard();
    initGame();
    
    // Configurar event listeners para los botones de categoría
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Quitar la clase active de todos los botones
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Añadir la clase active al botón clickeado
            button.classList.add('active');
            // Cambiar la categoría
            changeCategory(button.dataset.category);
        });
    });
    
    // Configurar event listeners
    playAgainButton.addEventListener('click', resetGame);
    resetGameButton.addEventListener('click', clearSessionStorage);
    
    // Permitir adivinar con el teclado físico
    window.addEventListener('keydown', e => {
        if (e.keyCode >= 65 && e.keyCode <= 90) {
            const letter = e.key.toUpperCase();
            handleGuess(letter);
        }
        
        // Permitir reiniciar con la tecla Enter cuando el juego termina
        if (!gameActive && e.key === 'Enter') {
            resetGame();
        }
    });
});