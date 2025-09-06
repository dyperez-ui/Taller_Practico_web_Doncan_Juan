const tablero = document.getElementById("game-board");
const boton = document.getElementById("start-btn");

boton.addEventListener("click", crearTablero);

function crearTablero() {
  tablero.innerHTML = "";
  tablero.style.gridTemplateColumns = "repeat(4, 1fr)";

  let valores = [];
  for (let i = 1; i <= 8; i++) {
    valores.push(i, i); // pares de números
  }

  valores = valores.sort(() => Math.random() - 0.5); // mezclar

  for (let i = 0; i < 16; i++) {
    const carta = document.createElement("div");
    carta.className = "card";
    carta.textContent = valores[i]; // siempre muestra el número
    tablero.appendChild(carta);
  }
}


