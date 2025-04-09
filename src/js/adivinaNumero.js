document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const guessInput = document.getElementById('guess-input');
    const comprobarBtn = document.getElementById('comprobar-btn');
    const nuevoJuegoBtn = document.getElementById('nuevo-juego-btn');
    const intentosRestantesSpan = document.getElementById('intentos-restantes');
    const intentosDiv = document.getElementById('intentos');
    const resultadoDiv = document.getElementById('resultado');
    const mensajeResultadoDiv = document.getElementById('mensaje-resultado');
    const numeroSecretoDiv = document.getElementById('numero-secreto');
    
    // Variables del juego
    let numeroSecreto;
    let intentosRestantes;
    let juegoTerminado = false;
    const maxIntentos = 3;
    
    // Iniciar nuevo juego
    function iniciarJuego() {
        numeroSecreto = Math.floor(Math.random() * 10) + 1; // Número del 1 al 10
        intentosRestantes = maxIntentos;
        juegoTerminado = false;
        
        // Restablecer UI
        intentosRestantesSpan.textContent = intentosRestantes;
        guessInput.value = '';
        intentosDiv.innerHTML = '';
        resultadoDiv.classList.add('d-none');
        resultadoDiv.classList.remove('success', 'error');
        numeroSecretoDiv.classList.add('d-none');
        
        // Habilitar input
        guessInput.disabled = false;
        comprobarBtn.disabled = false;
        
        // Enfocar en el input
        guessInput.focus();
        
        console.log('Número secreto:', numeroSecreto); // Para pruebas
    }
    
    // Comprobar intento
    function comprobarIntento() {
        if (juegoTerminado) return;
        
        // Validar entrada
        const intento = parseInt(guessInput.value);
        if (isNaN(intento) || intento < 1 || intento > 10) {
            alert('Por favor ingresa un número válido entre 1 y 10');
            guessInput.value = '';
            guessInput.focus();
            return;
        }
        
        // Reducir intentos
        intentosRestantes--;
        intentosRestantesSpan.textContent = intentosRestantes;
        
        // Comprobar acierto
        const acierto = intento === numeroSecreto;
        
        // Agregar intento a la lista
        const badgeEl = document.createElement('div');
        badgeEl.classList.add('attempt-badge');
        badgeEl.classList.add(acierto ? 'correct' : 'incorrect');
        badgeEl.textContent = intento;
        intentosDiv.appendChild(badgeEl);
        
        // Mostrar resultado
        resultadoDiv.classList.remove('d-none');
        
        if (acierto) {
            // Victoria
            resultadoDiv.classList.add('success');
            mensajeResultadoDiv.innerHTML = '¡Felicidades! <i class="bi bi-emoji-smile"></i> ¡Has adivinado el número!';
            finalizarJuego(true);
        } else {
            // Pista
            const pista = intento < numeroSecreto ? 'mayor' : 'menor';
            mensajeResultadoDiv.textContent = `No es correcto. El número es ${pista} que ${intento}.`;
            
            // Comprobar si se agotaron los intentos
            if (intentosRestantes === 0) {
                resultadoDiv.classList.add('error');
                mensajeResultadoDiv.innerHTML = `¡Se acabaron los intentos! <i class="bi bi-emoji-frown"></i>`;
                finalizarJuego(false);
            } else {
                // Limpiar y enfocar para el siguiente intento
                guessInput.value = '';
                guessInput.focus();
            }
        }
    }
    
    // Finalizar juego
    function finalizarJuego(victoria) {
        juegoTerminado = true;
        guessInput.disabled = true;
        comprobarBtn.disabled = true;
        
        // Mostrar el número secreto
        numeroSecretoDiv.textContent = numeroSecreto;
        numeroSecretoDiv.classList.remove('d-none');
    }
    
    // Event listeners
    comprobarBtn.addEventListener('click', comprobarIntento);
    nuevoJuegoBtn.addEventListener('click', iniciarJuego);
    
    // Permitir presionar Enter para enviar
    guessInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            comprobarIntento();
        }
    });
    
    // Iniciar juego al cargar la página
    iniciarJuego();
}); 