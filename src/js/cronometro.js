document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const horasEl = document.getElementById('horas');
    const minutosEl = document.getElementById('minutos');
    const segundosEl = document.getElementById('segundos');
    const centesimasEl = document.getElementById('centesimas');
    
    const iniciarBtn = document.getElementById('iniciar-btn');
    const pausarBtn = document.getElementById('pausar-btn');
    const reiniciarBtn = document.getElementById('reiniciar-btn');
    const vueltaBtn = document.getElementById('vuelta-btn');
    
    const vueltasBody = document.getElementById('vueltas-body');
    
    // Variables del cronómetro
    let tiempoInicio = 0;
    let tiempoActual = 0;
    let tiempoPausa = 0;
    let intervalo;
    let vueltas = [];
    let contadorVueltas = 0;
    let enMarcha = false;
    
    // Iniciar cronómetro
    function iniciar() {
        if (!enMarcha) {
            enMarcha = true;
            
            // Si no es un reinicio desde pausa
            if (tiempoActual === 0) {
                tiempoInicio = Date.now();
            } else {
                // Ajustar el tiempo de inicio con el tiempo que ya había pasado
                tiempoInicio = Date.now() - tiempoActual;
            }
            
            // Actualizar a 10 milisegundos de intervalo (centésimas)
            intervalo = setInterval(actualizar, 10);
            
            // Actualizar UI
            iniciarBtn.disabled = true;
            pausarBtn.disabled = false;
            reiniciarBtn.disabled = false;
            vueltaBtn.disabled = false;
        }
    }
    
    // Pausar cronómetro
    function pausar() {
        if (enMarcha) {
            enMarcha = false;
            clearInterval(intervalo);
            
            // Guardar el tiempo actual
            tiempoActual = Date.now() - tiempoInicio;
            
            // Actualizar UI
            iniciarBtn.disabled = false;
            pausarBtn.disabled = true;
            vueltaBtn.disabled = true;
        }
    }
    
    // Reiniciar cronómetro
    function reiniciar() {
        enMarcha = false;
        clearInterval(intervalo);
        
        // Reiniciar tiempos
        tiempoInicio = 0;
        tiempoActual = 0;
        
        // Reiniciar UI
        actualizarDisplay(0);
        vueltasBody.innerHTML = '';
        vueltas = [];
        contadorVueltas = 0;
        
        // Actualizar botones
        iniciarBtn.disabled = false;
        pausarBtn.disabled = true;
        reiniciarBtn.disabled = true;
        vueltaBtn.disabled = true;
    }
    
    // Actualizar cronómetro
    function actualizar() {
        const tiempo = Date.now() - tiempoInicio;
        actualizarDisplay(tiempo);
    }
    
    // Actualizar el display con el tiempo proporcionado
    function actualizarDisplay(tiempo) {
        const totalCentesimas = Math.floor(tiempo / 10);
        const centesimas = totalCentesimas % 100;
        const totalSegundos = Math.floor(tiempo / 1000);
        const segundos = totalSegundos % 60;
        const totalMinutos = Math.floor(totalSegundos / 60);
        const minutos = totalMinutos % 60;
        const horas = Math.floor(totalMinutos / 60);
        
        horasEl.textContent = formatNumber(horas);
        minutosEl.textContent = formatNumber(minutos);
        segundosEl.textContent = formatNumber(segundos);
        centesimasEl.textContent = formatNumber(centesimas);
    }
    
    // Formatear números a dos dígitos
    function formatNumber(num) {
        return num.toString().padStart(2, '0');
    }
    
    // Marcar vuelta
    function marcarVuelta() {
        if (enMarcha) {
            contadorVueltas++;
            const tiempoVuelta = Date.now() - tiempoInicio;
            
            // Calcular diferencia con vuelta anterior
            let diferencia = tiempoVuelta;
            if (vueltas.length > 0) {
                diferencia = tiempoVuelta - vueltas[vueltas.length - 1];
            }
            
            vueltas.push(tiempoVuelta);
            
            // Crear fila para la tabla
            const row = document.createElement('tr');
            row.classList.add('lap-row');
            
            row.innerHTML = `
                <td>${contadorVueltas}</td>
                <td>${formatTime(tiempoVuelta)}</td>
                <td>${contadorVueltas > 1 ? formatTime(diferencia) : '-'}</td>
            `;
            
            vueltasBody.appendChild(row);
            
            // Marcar vueltas más rápidas y más lentas si hay más de 2 vueltas
            if (contadorVueltas > 2) {
                marcarVueltasEspeciales();
            }
        }
    }
    
    // Formatear tiempo a hh:mm:ss:cc
    function formatTime(tiempo) {
        const totalCentesimas = Math.floor(tiempo / 10);
        const centesimas = totalCentesimas % 100;
        const totalSegundos = Math.floor(tiempo / 1000);
        const segundos = totalSegundos % 60;
        const totalMinutos = Math.floor(totalSegundos / 60);
        const minutos = totalMinutos % 60;
        const horas = Math.floor(totalMinutos / 60);
        
        return `${formatNumber(horas)}:${formatNumber(minutos)}:${formatNumber(segundos)}:${formatNumber(centesimas)}`;
    }
    
    // Marcar vueltas más rápidas y más lentas
    function marcarVueltasEspeciales() {
        if (vueltas.length < 2) return;
        
        // Calcular diferencias entre vueltas
        const diferencias = [];
        for (let i = 1; i < vueltas.length; i++) {
            diferencias.push({
                index: i,
                diferencia: vueltas[i] - vueltas[i-1]
            });
        }
        
        // Ordenar por diferencia
        diferencias.sort((a, b) => a.diferencia - b.diferencia);
        
        // Limpiar clases anteriores
        document.querySelectorAll('.lap-row').forEach(row => {
            row.classList.remove('fastest-lap', 'slowest-lap');
        });
        
        // Marcar la más rápida y la más lenta
        if (diferencias.length > 0) {
            const masRapida = diferencias[0].index;
            const masLenta = diferencias[diferencias.length - 1].index;
            
            const rows = document.querySelectorAll('.lap-row');
            if (rows[masRapida]) {
                rows[masRapida].classList.add('fastest-lap');
            }
            
            if (rows[masLenta] && masLenta !== masRapida) {
                rows[masLenta].classList.add('slowest-lap');
            }
        }
    }
    
    // Event listeners
    iniciarBtn.addEventListener('click', iniciar);
    pausarBtn.addEventListener('click', pausar);
    reiniciarBtn.addEventListener('click', reiniciar);
    vueltaBtn.addEventListener('click', marcarVuelta);
}); 