const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");
let expression = "";
let isOn = true;
let justCalculated = false;
let ans = 0;
let shiftActive = false;
let enteringRoot = false;
let enteringSqrt = false;
let rootIndex = "";

// display
function updateDisplay(){
    const displayExpression = expression
        .replace(/sqrt\(/g, '√')
        .replace(/root\((\d+(?:\.\d+)?|Ans),/g, '<sup>$1</sup>√(')
        .replace(
            /\*\*(\d+(?:\.\d+)?|\bAns\b)?|[*/]/g,
            (match, power) => {
                if(match.startsWith("**")){
                    return `<sup>${power || "n"}</sup>`
                }

                return match === "*" ? "×" : "÷"
            }
        );

    expressionDisplay.innerHTML = displayExpression || 0;
}

// number and operator buttons
const numberButtons = document.querySelectorAll(".num");

numberButtons.forEach((button) => {
    button.addEventListener('click', () => {
        if (!isOn) return;

        const value = button.textContent.trim();

        if(justCalculated){
            expression = "";
            justCalculated = false;
        }

        if(enteringRoot){
            rootIndex += value;
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

// shift button values
const shiftBtn = document.querySelector(".shiftbtn");

shiftBtn.addEventListener('click', () => {
    if(!isOn) return;

    shiftActive = !shiftActive;
    shiftBtn.classList.toggle("active", shiftActive);
});

// decimal
const decimalBtn = document.getElementById("decimal");

decimalBtn.addEventListener('click', () => {
    if(!isOn) return;

    if(justCalculated){
        expression = "Ans";
        justCalculated = false;
    }

    const currentNumber = expression.split(/[+\-*/()]/).pop();
    if(currentNumber.includes(".")) return;

    if(currentNumber === ""){
        expression += 0;
    }

    expression += ".";
    updateDisplay();
});

// brackets
const openBracketBtn = document.querySelector(".openbracket");
const closeBracketBtn = document.querySelector(".closebracket");

openBracketBtn.addEventListener('click', () => {
    if(!isOn) return;

    if(justCalculated){
        expression = "Ans";
        justCalculated = false;
    }

    if(/[0-9.)]$/.test(expression) || expression.endsWith("Ans")){
        expression += "*";
    }

    expression += "(";
    updateDisplay();
});

closeBracketBtn.addEventListener('click', () => {
    if(!isOn || justCalculated) return;

    const openCount = (expression.match(/\(/g) || []).length;
    const closeCount = (expression.match(/\)/g) || []).length;

    if(openCount > closeCount){
        if(/[+\-*/(]$/.test(expression)) return;
        expression += ")";
        updateDisplay();
    }
});

// power and roots
const squareBtn = document.querySelector(".squared");
const powerBtn = document.querySelector(".power");

squareBtn.addEventListener('click', () => {
    if(!isOn || !expression) return;

    if(justCalculated){
        expression = "Ans";
        justCalculated = false;
    }

    expression = `${expression}**2`;
    updateDisplay();
});

powerBtn.addEventListener('click', () => {
    if(!isOn || !expression) return;

    if(justCalculated){
        expression = "Ans";
        justCalculated = false;
    }

    expression += "**";
    updateDisplay();
});

const sqrtBtn = document.querySelector(".sqrt");

sqrtBtn.addEventListener('click', () => {
    if(!isOn) return;

    if(shiftActive){
        expression +="root(";
        enteringRoot = true;
        rootIndex = "";

        shiftActive = false;
        shiftBtn.classList.remove("active");

        justCalculated = false;
        updateDisplay();
        return;
    }

    if(justCalculated){
        expression = "";
        justCalculated = false;
    }

    expression += `sqrt(`;
    enteringSqrt = true;
    updateDisplay();
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
        let calculation = expression
            .replace(/\bAns\b/g, `(${ans})`)
            .replace(/sqrt\(/g, "Math.sqrt(");

        const openCount = (calculation.match(/\(/g) || []).length;
        const closeCount = (calculation.match(/\)/g) || []).length;

        calculation += ")".repeat(openCount - closeCount);

        calculation = calculation
            .replace(/(\d|\))\(/g, "$1*(")
            .replace(/\)(\d)/g, ")*$1");
        
        const rootFunction = (index, value) => {
            if(index === 0) throw new Error ("Invalid root");

            if(value < 0 && Number.isInteger(index) && index % 2 !== 0){
                return -Math.pow(-value, 1 / index)
            }

            return Math.pow(value, 1 / index);
        }
        
        const answer = Function("root", `"use strict"; return (${calculation})`)(rootFunction);

        if(!Number.isFinite(answer)){
            throw new Error("Invalid calculation");            
        }

        ans = Number(answer.toPrecision(10));
        resultDisplay.textContent = ans;
        expression = "Ans";
        justCalculated = true;

        updateDisplay();
    } catch(error){
        console.error(error);
        resultDisplay.textContent = "Error";
        justCalculated = false;
    }
});

updateDisplay();