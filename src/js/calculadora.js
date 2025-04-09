document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.calc-btn');
    
    // Variables para cálculos
    let currentInput = '';
    let currentOperation = '';
    let previousInput = '';
    let shouldResetDisplay = false;
    let calculationDone = false;
    let operationDisplayMap = {
        '+': '+',
        '-': '-',
        '*': '×',
        '/': '÷'
    };
    let expressionDisplay = ''; // Para mostrar la expresión completa
    
    // Agregar event listeners a todos los botones
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            const value = this.dataset.value;
            
            // Si se presionó un botón después de una operación completa, reiniciar la calculadora
            if (calculationDone && !action) {
                clear();
                calculationDone = false;
            }
            
            // Manejar números
            if (value !== undefined) {
                if (shouldResetDisplay) {
                    // Si estamos empezando a ingresar un nuevo número después de una operación
                    // No reiniciamos el display completamente, solo actualizamos el currentInput
                    currentInput = '';
                    shouldResetDisplay = false;
                }
                
                // Evitar múltiples puntos decimales
                if (value === '.' && currentInput.includes('.')) {
                    return;
                }
                
                // Evitar números que comienzan con múltiples ceros
                if (value === '0' && currentInput === '0') {
                    return;
                }
                
                // Reemplazar el cero inicial al ingresar otros dígitos
                if (currentInput === '0' && value !== '.') {
                    currentInput = value;
                } else {
                    currentInput += value;
                }
                
                // Actualizar el display con la expresión completa más el número actual
                updateDisplay();
            }
            
            // Manejar acciones/operaciones
            if (action) {
                switch(action) {
                    case 'clear':
                        clear();
                        break;
                        
                    case 'backspace':
                        if (!shouldResetDisplay) {
                            currentInput = currentInput.slice(0, -1);
                            if (currentInput === '') {
                                currentInput = '0';
                            }
                            updateDisplay();
                        }
                        break;
                        
                    case '%':
                        currentInput = (parseFloat(currentInput) / 100).toString();
                        updateDisplay();
                        break;
                        
                    case '=':
                        if (previousInput && currentOperation) {
                            // Guardar la expresión completa para mostrarla (solo para referencia)
                            let fullExpression = expressionDisplay + ' ' + currentInput;
                            
                            calculate();
                            
                            // Mostrar solo el resultado
                            display.value = currentInput;
                            
                            // Reiniciar para la próxima operación
                            expressionDisplay = '';
                            currentOperation = '';
                            previousInput = '';
                            shouldResetDisplay = true;
                            calculationDone = true;
                        }
                        break;
                        
                    case '+':
                    case '-':
                    case '*':
                    case '/':
                        // Si ya tenemos una operación pendiente, calculamos primero
                        if (currentOperation && previousInput && !shouldResetDisplay) {
                            calculate();
                        }
                        
                        // Guardamos el número actual como previo
                        previousInput = currentInput;
                        currentOperation = action;
                        
                        // Actualizar la expresión display
                        if (expressionDisplay === '') {
                            expressionDisplay = currentInput;
                        } else {
                            expressionDisplay += ' ' + operationDisplayMap[currentOperation] + ' ' + currentInput;
                        }
                        
                        // Actualizar el display con la expresión actual + el operador
                        display.value = expressionDisplay + ' ' + operationDisplayMap[action];
                        
                        shouldResetDisplay = true;
                        break;
                }
            }
        });
    });
    
    // Función para actualizar el display
    function updateDisplay() {
        if (expressionDisplay === '') {
            display.value = currentInput;
        } else {
            // Mostrar la expresión completa + el número actual
            display.value = expressionDisplay + ' ' + operationDisplayMap[currentOperation] + ' ' + currentInput;
        }
    }
    
    // Función para limpiar la calculadora
    function clear() {
        display.value = '0';
        currentInput = '0';
        previousInput = '';
        currentOperation = '';
        expressionDisplay = '';
        shouldResetDisplay = false;
    }
    
    // Función para realizar cálculos
    function calculate() {
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        let result = 0;
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch(currentOperation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    display.value = 'Error: División por cero';
                    currentInput = '0';
                    previousInput = '';
                    currentOperation = '';
                    expressionDisplay = '';
                    shouldResetDisplay = true;
                    calculationDone = true;
                    return;
                }
                result = prev / current;
                break;
        }
        
        // Verificar si el resultado es infinito o no es un número
        if (!isFinite(result) || isNaN(result)) {
            display.value = 'Error: Resultado inválido';
            currentInput = '0';
            previousInput = '';
            currentOperation = '';
            expressionDisplay = '';
            shouldResetDisplay = true;
            calculationDone = true;
            return;
        }
        
        // Actualizar el valor actual con el resultado
        currentInput = parseFloat(result.toFixed(8)).toString();
        
        // Eliminar ceros a la derecha innecesarios para números decimales
        if (currentInput.includes('.')) {
            currentInput = currentInput.replace(/\.?0+$/, '');
        }
        
        // Actualizar expressionDisplay para la siguiente operación
        expressionDisplay = '';
    }
    
    // Soporte para teclado
    document.addEventListener('keydown', function(e) {
        const key = e.key;
        
        // Números y punto decimal
        if (/[0-9\.]/.test(key)) {
            document.querySelector(`.calc-btn[data-value="${key}"]`)?.click();
        }
        
        // Operaciones
        switch(key) {
            case '+':
            case '-':
            case '*':
            case '/':
                document.querySelector(`.calc-btn[data-action="${key}"]`)?.click();
                break;
            case 'Enter':
                document.querySelector('.calc-btn[data-action="="]')?.click();
                break;
            case 'Backspace':
                document.querySelector('.calc-btn[data-action="backspace"]')?.click();
                break;
            case 'Delete':
            case 'Escape':
                document.querySelector('.calc-btn[data-action="clear"]')?.click();
                break;
        }
    });
    
    // Inicializar la calculadora
    clear();
}); 