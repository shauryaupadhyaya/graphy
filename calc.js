const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");
let expression = "";
let isOn = true;
let justCalculated = false;
let ans = 0;

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
            expression = "Ans";
            justCalculated = false;
        }

        expression += operator;
        updateDisplay();
    });
});

// all clear and delete buttons
const allClearBtn = document.getElementById("allclear");
const deleteBtn = document.getElementById("delete");

allClearBtn.addEventListener('click', () => {
    if(!isOn) return;

    expression = "";
    justCalculated = false;
    resultDisplay.textContent = 0;
    updateDisplay();
});

deleteBtn.addEventListener('click', () => {
    if(!isOn) return;

    expression = expression.slice(0, -1);
    justCalculated = false;
    updateDisplay();
});

// equal to button and solving the equation
const executeBtn = document.getElementById("exe");

executeBtn.addEventListener('click', () => {
    if(!isOn || !expression) return;

    try{
        const calculation = expression.replace(/\bAns\b/g, `(${ans})`);
        const answer = Function(`"use strict"; return (${calculation})`)();

        if(!Number.isFinite(answer)){
            throw new Error("Invalid calculation");            
        }

        ans = Number(answer.toPrecision(10));
        resultDisplay.textContent = ans;
        expression = "Ans";
        justCalculated = true;

        updateDisplay();
    } catch{
        resultDisplay.textContent = "Error";
        justCalculated = false;
    }
});

updateDisplay();