document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const contactForm = document.getElementById('contactForm');
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const mensajeInput = document.getElementById('mensaje');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    // Función para validar email
    function validarEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Función para mostrar error en un campo
    function mostrarError(input) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    }
    
    // Función para mostrar éxito en un campo
    function mostrarExito(input) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }
    
    // Función para validar un campo requerido
    function validarCampoRequerido(input) {
        if (input.value.trim() === '') {
            mostrarError(input);
            return false;
        } else {
            mostrarExito(input);
            return true;
        }
    }
    
    // Validar todos los campos cuando hay cambios
    nombreInput.addEventListener('input', function() {
        validarCampoRequerido(nombreInput);
    });
    
    emailInput.addEventListener('input', function() {
        if (emailInput.value.trim() === '') {
            mostrarError(emailInput);
        } else if (!validarEmail(emailInput.value)) {
            mostrarError(emailInput);
        } else {
            mostrarExito(emailInput);
        }
    });
    
    mensajeInput.addEventListener('input', function() {
        validarCampoRequerido(mensajeInput);
    });
    
    // Manejar envío del formulario
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Ocultar mensajes previos
        successMessage.classList.add('d-none');
        errorMessage.classList.add('d-none');
        
        // Validar todos los campos
        const nombreValido = validarCampoRequerido(nombreInput);
        
        let emailValido = false;
        if (emailInput.value.trim() === '') {
            mostrarError(emailInput);
        } else if (!validarEmail(emailInput.value)) {
            mostrarError(emailInput);
        } else {
            mostrarExito(emailInput);
            emailValido = true;
        }
        
        const mensajeValido = validarCampoRequerido(mensajeInput);
        
        // Comprobar si todo es válido
        if (nombreValido && emailValido && mensajeValido) {
            // Simulación de envío exitoso
            successMessage.classList.remove('d-none');
            
            // Restablecer formulario y clases de validación
            contactForm.reset();
            [nombreInput, emailInput, mensajeInput].forEach(input => {
                input.classList.remove('is-valid');
            });
            
            // Simular tiempo de espera para envío
            console.log('Formulario enviado correctamente');
        } else {
            // Mostrar mensaje de error
            errorMessage.classList.remove('d-none');
        }
    });
}); 