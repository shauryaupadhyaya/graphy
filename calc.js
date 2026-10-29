const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");
let expression = "";
let isOn = true;
let justCalculated = false;

// display
function updateDisplay(){
    const displayExpression = expression.replace(/\*/g, '×').replace(/\//g, '÷');
    expressionDisplay.textContent = displayExpression || 0;
}

// buttons
const numberButtons = document.querySelectorAll(".num");

numberButtons.forEach((button) => {
    button.addEventListener('click', () => {
        if (!isOn) return;

        const value = button.textContent.trim();

        if(justCalculated){
            expression = "";
            justCalculated = false;
        }

        expression += value;
        updateDisplay();
    });
});

const operatorButtons = {
    addition: '+',
    subtraction: '-',
    divide: '/',
    multiply: '*'
};

Object.entries(operatorButtons).forEach(([id, operator]) => {
    const button = document.getElementById(id);

    button.addEventListener('click', () => {
        if(!isOn) return;

        if(justCalculated){
            justCalculated = false;
        }

        expression += operator;
        updateDisplay();
    });
});

updateDisplay();