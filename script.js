// Configuración básica del juego
const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Establecemos el tamaño del canvas
canvas.width = 800;
canvas.height = 400;

// Cargar imágenes
const fondo = new Image();
fondo.src = 'assets/mesa-fondo.png';

const raquetaImg = new Image();
raquetaImg.src = 'assets/raquetas.png';

const pelotaImg = new Image();
pelotaImg.src = 'assets/pelota.png';

// Cargar sonidos
const sonidoPunto = new Audio('assets/sonido-punto.wav');
const sonidoPelota = new Audio('assets/sonido-pelota.wav');

// Raquetas
const raquetaAncho = 30, raquetaAlto = 100;
let raquetaJugadorY = canvas.height / 2 - raquetaAlto / 2;
let raquetaComputadoraY = canvas.height / 2 - raquetaAlto / 2;
let velocidadRaquetaJugador = 10; // Aumentamos la velocidad de la raqueta del jugador
let velocidadRaquetaComputadora = 4;  // La velocidad inicial de la computadora

// Pelota
const pelotaAncho = 20; // Usamos el tamaño de la imagen de la pelota
const pelotaAlto = 20; // Usamos el tamaño de la imagen de la pelota
let pelotaX = canvas.width / 2;
let pelotaY = canvas.height / 2;
let velocidadPelotaX = 3 * (Math.random() < 0.5 ? 1 : -1);  // Velocidad inicial más lenta
let velocidadPelotaY = 3 * (Math.random() < 0.5 ? 1 : -1);  // Velocidad inicial más lenta

// Marcador
let puntosJugador = 0;
let puntosComputadora = 0;

// Estado del juego
let juegoIniciado = false;
let pausado = false;
let sonidoActivado = true;

// Función para dibujar la pelota
function dibujarPelota() {
    ctx.drawImage(pelotaImg, pelotaX - pelotaAncho / 2, pelotaY - pelotaAlto / 2, pelotaAncho, pelotaAlto);
}

// Función para dibujar las raquetas
function dibujarRaquetas() {
    // Raqueta del jugador
    ctx.drawImage(raquetaImg, 10, raquetaJugadorY, raquetaAncho, raquetaAlto);

    // Raqueta de la computadora
    ctx.drawImage(raquetaImg, canvas.width - raquetaAncho - 10, raquetaComputadoraY, raquetaAncho, raquetaAlto);
}

// Función para dibujar el fondo
function dibujarFondo() {
    ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);
}

// Función para mover la pelota
function moverPelota() {
    // Aumento gradual de la velocidad de la pelota
    velocidadPelotaX *= 1.001; // Aumento muy suave de la velocidad
    velocidadPelotaY *= 1.001; // Aumento muy suave de la velocidad

    // Movimiento de la pelota
    pelotaX += velocidadPelotaX;
    pelotaY += velocidadPelotaY;

    // Rebote superior e inferior
    if (pelotaY <= 0 || pelotaY >= canvas.height) {
        velocidadPelotaY = -velocidadPelotaY * 0.95; // Rebote con menos fuerza
    }

    // Colisión con las raquetas
    if (pelotaX <= raquetaAncho + 10 && pelotaY > raquetaJugadorY && pelotaY < raquetaJugadorY + raquetaAlto) {
        velocidadPelotaX = -velocidadPelotaX;
        // Variación en el rebote según la posición de contacto
        let diferencia = pelotaY - (raquetaJugadorY + raquetaAlto / 2);
        velocidadPelotaY = diferencia * 0.3; // Hacer que la pelota rebote de forma diferente
        if (sonidoActivado) sonidoPelota.play();
    } else if (pelotaX >= canvas.width - raquetaAncho - 10 && pelotaY > raquetaComputadoraY && pelotaY < raquetaComputadoraY + raquetaAlto) {
        velocidadPelotaX = -velocidadPelotaX;
        // Variación en el rebote según la posición de contacto
        let diferencia = pelotaY - (raquetaComputadoraY + raquetaAlto / 2);
        velocidadPelotaY = diferencia * 0.3; // Hacer que la pelota rebote de forma diferente
        if (sonidoActivado) sonidoPelota.play();
    }

    // Puntos
    if (pelotaX < 0) {
        puntosComputadora++;
        if (sonidoActivado) sonidoPunto.play();
        reiniciarPelota();
    } else if (pelotaX > canvas.width) {
        puntosJugador++;
        if (sonidoActivado) sonidoPunto.play();
        reiniciarPelota();
    }
}

// Función para reiniciar la pelota
function reiniciarPelota() {
    pelotaX = canvas.width / 2;
    pelotaY = canvas.height / 2;
    velocidadPelotaX = 3 * (Math.random() < 0.5 ? 1 : -1);  // Velocidad inicial más lenta
    velocidadPelotaY = 3 * (Math.random() < 0.5 ? 1 : -1);  // Velocidad inicial más lenta
}

// Función para dibujar el marcador
function dibujarMarcador() {
    ctx.font = "32px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(puntosJugador, canvas.width / 2 - 50, 50);
    ctx.fillText(puntosComputadora, canvas.width / 2 + 50, 50);
}

// Función para mover la raqueta del jugador
function moverRaquetaJugador() {
    if (upPressed && raquetaJugadorY > 15) { // Restringir la raqueta a 15px del borde
        raquetaJugadorY -= velocidadRaquetaJugador; // Raqueta más rápida
    } else if (downPressed && raquetaJugadorY < canvas.height - raquetaAlto - 15) { // Restringir la raqueta a 15px del borde
        raquetaJugadorY += velocidadRaquetaJugador; // Raqueta más rápida
    }
}

// Función para mover la raqueta de la computadora (IA)
function moverRaquetaComputadora() {
    // Aumentamos gradualmente la velocidad de la computadora con el tiempo
    velocidadRaquetaComputadora = 4 + Math.min(puntosComputadora / 3, 6);  // La computadora acelera conforme se anotan puntos

    if (pelotaY < raquetaComputadoraY + raquetaAlto / 2) {
        raquetaComputadoraY -= velocidadRaquetaComputadora;
    } else if (pelotaY > raquetaComputadoraY + raquetaAlto / 2) {
        raquetaComputadoraY += velocidadRaquetaComputadora;
    }

    // Restringir la raqueta a 15px del borde
    if (raquetaComputadoraY < 15) {
        raquetaComputadoraY = 15;
    } else if (raquetaComputadoraY > canvas.height - raquetaAlto - 15) {
        raquetaComputadoraY = canvas.height - raquetaAlto - 15;
    }
}

// Teclas de control
let upPressed = false;
let downPressed = false;

document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp") upPressed = true;
    if (event.key === "ArrowDown") downPressed = true;
});

document.addEventListener("keyup", function(event) {
    if (event.key === "ArrowUp") upPressed = false;
    if (event.key === "ArrowDown") downPressed = false;
});

// Control del juego y de la pausa
document.getElementById("iniciar").addEventListener("click", iniciarJuego);

// Función para iniciar el juego
function iniciarJuego() {
    juegoIniciado = true;
    document.getElementById("instrucciones").style.display = "none";
    requestAnimationFrame(bucleJuego);
}

// Función principal del bucle de juego
function bucleJuego() {
    if (!pausado) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar canvas
        dibujarFondo();
        dibujarRaquetas();
        dibujarPelota();
        dibujarMarcador();
        moverPelota();
        moverRaquetaJugador();
        moverRaquetaComputadora();
    }

    requestAnimationFrame(bucleJuego);
}
