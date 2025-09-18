// definir lo q sale en las cartas
const simbolos = [
    'hola','adios','arriba','abajo','izquierda','derecha',
    'A','B','Z'
];
// pares totales = el largo del array
const totalPares = simbolos.length;
// variables
let cartas = [];
let cartasVolteadas = [];
let ParesEncontrados = 0;
let tiempoInicio = 0;
let tiempoJugando = 0;
let IntervaloTiempo = null;


//emepezar el temporizador
function empezarTemporizador() {
tiempoInicio = Date.now(); // obtiene el tiempo actual en milisegundos
clearInterval(IntervaloTiempo); // limpia cualquier intervalo previo

IntervaloTiempo =setInterval( () => {

  tiempoJugando = Date.now() - tiempoInicio; // calcula el tiempo jugado
  actualizarTiempo(); // actualiza la visualizacion del tiempo
 },1000); //actualiza el tiempo cada segundo
};


function actualizarTiempo() {

const seg = Math.floor( (tiempoJugando / 1000));
const min = Math.floor( seg / 60);

//fllega el id timer
const ContadorTIempo = document.getElementById('timer');
if (ContadorTIempo) {
 ContadorTIempo.textContent = `Tiempo: ${min} : ${seg % 60}`;
};
};

//mezclar las cartas/ desordenar las cartas
function mezclarCartas(array) {
  // corta una parte del array
   return array.slice().sort( () => Math.random() - 0.5 );
//  el metodo slice devuelve una parte del arreglo
// math ranndom da numeros  al azar menores q n

// notas
// el .slice crea una copia del array original mientras se mezcla
//el .sort mezcla los elementos del array
};
//los ... sacan los objetos del array en este caso las cartas
cartas= mezclarCartas([...simbolos, ...simbolos]); // se duplica el array para tener pares



function crearCarta(simbolo) {

  // crea un elemento tipo div y se agrega una nueva clase
  const carta = document.createElement('div');
  carta.classList.add('carta');
  //lo mismo
  const ContenedorSimbolo = document.createElement('div');
  ContenedorSimbolo.classList.add('simbolo');
  ContenedorSimbolo.textContent = simbolo;


function UsoClick() {
    cartaVolteada(carta);//para que la carta sepa cual es el evento para dejar de usar el click
};
carta.UsoClick = UsoClick;
carta.addEventListener('click', carta.UsoClick);


  carta.appendChild(ContenedorSimbolo);
// cuando click en una carta se activa la funcion carta volteada
  return carta;
};


function cartaVolteada(carta) {
// si la cartas volteadas tienen un largo menor a 2 no se pueden voltear mas cartas (solo se pueden voltaer 2 cartas  )
//y si la carta no ha sido volteada anteriormente
// !cartasVolteadas.includes(carta) comprueba q la carta q queremos voltear no es la que ya tenemos volteada

  if (cartasVolteadas.length < 2 && !cartasVolteadas.includes(carta)) {
      //    si se cimplen las condiciones del if, se le agrega a la carta la clase de volteada
      carta.classList.add('volteada');
      // la carta se agrega al array de cartas volteadas
      cartasVolteadas.push(carta);
  };
  // si las cartas volteadas son iguales
  //si son 2 las cartas volteadas
  if( cartasVolteadas.length === 2){
    setTimeout( LasCartasSonIguales, 1000);// se espera 1 segundo y se llama a la funcion
  };

};


// si las cartas son iguales
function LasCartasSonIguales() {
  const [carta1, carta2] = cartasVolteadas; //las cartas que volteamos son definidas como carta1 y 2
  const simbolo1 = carta1.querySelector('.simbolo').textContent;  // se obtiene el simbolo de la carta 1
  const simbolo2 = carta2.querySelector('.simbolo').textContent;

  // se hace la comparacion
  if (simbolo1 === simbolo2) {
    // si son la misma ya no se pueden dar click
    carta1.removeEventListener('click', carta1.UsoClick); 
    carta2.removeEventListener('click', carta2.UsoClick);
    ParesEncontrados++; // se suma 1 a los pares encontrados

    // si los pares encontrados es igual al total de pares salta una alerta de que ganamos
    if(ParesEncontrados === totalPares){
      clearInterval(IntervaloTiempo); // se detiene el tiempo
      alert('Felicidades, ganaste!!!!!!!!');
    }
  } else {
    // si no son iguales se les quita la clase de volteada
    carta1.classList.remove('volteada');
    carta2.classList.remove('volteada');
  }

  cartasVolteadas = []; // se limpia el array de cartas volteadas (siempre se ejecuta)
}


//iniciar el juego
function IniciarJuego() {

  cartas = mezclarCartas([...simbolos, ...simbolos]);
  ParesEncontrados = 0;
  cartasVolteadas = []; //inicia el array de cartas volteadas vacio
  tiempoInicio = 0;//inicia el tiempo en 0
  tiempoJugando = 0;
  clearInterval(IntervaloTiempo); // limpia el intervalo de tiempo
  actualizarTiempo();
  empezarTemporizador();

  const ContenedorDelJuego = document.querySelector('.memorama-inicio');
  ContenedorDelJuego.innerHTML = '';// limpiar el tablero y borra todo lo anterior para una nueva partida

  cartas.forEach(simbolo => {
    
    const carta = crearCarta(simbolo);
    // se le agrega el resultado al contendor del juego
    ContenedorDelJuego.appendChild(carta);
  });
};

IniciarJuego();

