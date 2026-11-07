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
let enteringLog = false;
let logBase = "";
let angleMode = localStorage.getItem("angleMode") || "DEG";

// display
function updateDisplay(){
    expression = serialize(rootSequence);
    expressionDisplay.innerHTML = renderSequence(rootSequence);

    // const displayExpression = expression
    //     .replace(/root\((\d+(?:\.\d+)?|Ans),/g, '<sup>$1</sup>√(')
    //     .replace(/sqrt\(/g, '√')
    //     .replace(/\*\*(\d+(?:\.\d+)?|Ans)?/g, (match, power) => {
    //         return `<sup>${power || "n"}</sup>`
    //     })
    //     .replace(/Math\.E/g, "e")
    //     .replace(/Math\.PI/g, "π")
    //     .replace(/\*/g, '×')
    //     .replace(/\//g, '÷');

    // expressionDisplay.innerHTML = displayExpression || 0;
}

// number and operator buttons
const numberButtons = document.querySelectorAll(".num");

numberButtons.forEach((button) => {
    button.addEventListener('click', () => {
        if (!isOn) return;

        const value = button.textContent.trim();

        if(justCalculated){
            rootSequence.items = [];
            rootSequence.cursor = 0;
            activeSequence = rootSequence;
            justCalculated = false;
        }

        if(enteringRoot){
            rootIndex += value;
        }

        if(enteringLog){
            logBase += value;
        }

        insertText(value);
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
            rootSequence.items = [..."Ans"];
            rootSequence.cursor = 3;
            activeSequence = rootSequence;

            rootSequence.items = [..."Ans"];
            rootSequence.cursor = 3;
            activeSequence = rootSequence;
            expression = "Ans";
            justCalculated = false;
        }

        insertText(operator);
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
        rootSequence.items = [..."Ans"];
        rootSequence.cursor = 3;
        activeSequence = rootSequence;
        expression = "Ans";
        justCalculated = false;
    }

    const currentNumber = expression.split(/[+\-*/()]/).pop();
    if(currentNumber.includes(".")) return;

    if(currentNumber === ""){
        insertText("0");
    }

    insertText(".");
    updateDisplay();
});

// brackets
const openBracketBtn = document.querySelector(".openbracket");
const closeBracketBtn = document.querySelector(".closebracket");

openBracketBtn.addEventListener('click', () => {
    if(!isOn) return;

    if(justCalculated){
        rootSequence.items = [..."Ans"];
        rootSequence.cursor = 3;
        activeSequence = rootSequence;
        expression = "Ans";
        justCalculated = false;
    }

    if(/[0-9.)]$/.test(expression) || expression.endsWith("Ans") || expression.endsWith("Math.E") || expression.endsWith("Math.PI")){
        insertText("*");
    }

    insertText("(");
    updateDisplay();
});

closeBracketBtn.addEventListener('click', () => {
    if(!isOn || justCalculated) return;

    const openCount = (expression.match(/\(/g) || []).length;
    const closeCount = (expression.match(/\)/g) || []).length;

    if(openCount > closeCount){
        if(/[+\-*/(]$/.test(expression)) return;
        insertText(")");
        updateDisplay();
    }
});

// power and roots
const squareBtn = document.querySelector(".squared");
const powerBtn = document.querySelector(".power");

squareBtn.addEventListener('click', () => {
    if(!isOn || !expression) return;

    if(justCalculated){
        rootSequence.items = [..."Ans"];
        rootSequence.cursor = 3;
        activeSequence = rootSequence;
        expression = "Ans";
        justCalculated = false;
    }

    insertText("**2");
    updateDisplay();
});

powerBtn.addEventListener('click', () => {
    if(!isOn || !expression) return;

    if(justCalculated){
        rootSequence.items = [..."Ans"];
        rootSequence.cursor = 3;
        activeSequence = rootSequence;
        expression = "Ans";
        justCalculated = false;
    }

    insertText("**");
    updateDisplay();
});

const sqrtBtn = document.querySelector(".sqrt");

sqrtBtn.addEventListener('click', () => {
    if(!isOn) return;

    if(shiftActive){
        insertText("root(");
        enteringRoot = true;
        rootIndex = "";

        shiftActive = false;
        shiftBtn.classList.remove("active");

        justCalculated = false;
        updateDisplay();
        return;
    }

    if(enteringRoot && rootIndex){
        insertText(",");
        enteringRoot = false;
        updateDisplay();
        return;
    }

    if(justCalculated){
        rootSequence.items = [];
        rootSequence.cursor = 0;
        activeSequence = rootSequence;
        justCalculated = false;
    }

    if(expression.endsWith("Math.PI") || expression.endsWith("Math.E") || expression.endsWith("Ans") || /[0-9.)]$/.test(expression)){
        insertText("*");
    }

    insertText("sqrt(");
    enteringSqrt = true;
    updateDisplay();
});

// x10^n button
const tenPowerBtn = document.querySelector(".tenpower");

tenPowerBtn.addEventListener('click', () => {
    if(!isOn || !expression) return;

    if(justCalculated){
        rootSequence.items = [..."Ans"];
        rootSequence.cursor = 3;
        activeSequence = rootSequence;
        expression = "Ans";
        justCalculated = false;
    }

    insertText("*10**");
    updateDisplay();
});

// log, e and ln
const logBtn = document.querySelector(".log");
const eBtn = document.querySelector(".e");

logBtn.addEventListener('click', () => {
    if(!isOn) return;

    if(shiftActive){
        if(justCalculated){
            expression = "";
            justCalculated = false;
        }

        insertText("ln(");

        shiftActive = false;
        shiftBtn.classList.remove("active");

        updateDisplay();
        return;
    }

    if(enteringLog && logBase){
        insertText(",");
        enteringLog = false;
        updateDisplay();
        return;
    }

    if(justCalculated){
        expression = "";
        justCalculated = false;
    }

    insertText("log(");
    enteringLog = true;
    logBase = "";
    updateDisplay();
});

eBtn.addEventListener('click', () => {
    if(!isOn) return;

    if(justCalculated){
        expression = "";
        justCalculated = false;
    }

    if(/[0-9.)]$/.test(expression) || expression.endsWith("Ans") || expression.endsWith("Math.PI")){
        insertText("*");
    }

    insertText("Math.E");
    updateDisplay();
});

// trig
const sinBtn = document.querySelector(".sin");
const cosBtn = document.querySelector(".cos");
const tanBtn = document.querySelector(".tan");

function TrigFunctions(button, normal, inverse){
    button.addEventListener('click', () => {
        if(!isOn) return;
        
        const functionName = shiftActive ? inverse : normal;

        if(justCalculated){
            rootSequence.items = [];
            rootSequence.cursor = 0;
            activeSequence = rootSequence;
            justCalculated = false;
        }

        if(/[0-9.)]$/.test(expression) || expression.endsWith("Ans") || expression.endsWith("Math.E") || expression.endsWith("Math.PI")){
            insertText("*");
        }

        insertText(`${functionName}(`);
        shiftActive = false;
        shiftBtn.classList.remove("active");
        updateDisplay();
    });
}

TrigFunctions(sinBtn, "sin", "arcsin");
TrigFunctions(cosBtn, "cos", "arccos");
TrigFunctions(tanBtn, "tan", "arctan");

// pi
const piBtn = document.querySelector(".pi");

piBtn.addEventListener('click', () => {
    if(!isOn) return;

    if(justCalculated){
        rootSequence.items = [];
        rootSequence.cursor = 0;
        activeSequence = rootSequence;
        justCalculated = false;
    }

    if(/[0-9.)]$/.test(expression) || expression.endsWith("Ans") || expression.endsWith("Math.E") || expression.endsWith("Math.PI")){
        insertText("*");
    }

    insertText("Math.PI");
    updateDisplay();
});

// settings menu
const leftArrow = document.getElementById("leftarrow");
const rightArrow = document.getElementById("rightarrow");
const upArrow = document.getElementById("uparrow");
const downArrow = document.getElementById("downarrow");
const okBtn = document.getElementById("ok");

const settingsBtn = document.querySelector(".settings");
const settingsMenu = document.getElementById("settingsMenu");
const settingsMain = document.getElementById("settingsMain");
const angleMenu = document.getElementById("angleMenu");
const angleSettings = document.getElementById("angleSettings");
const angleOption = document.getElementById("angleOption");
const degOption = document.getElementById("degOption");
const radOption = document.getElementById("radOption");

let settingsOpen = false;
let settingsPage = "main";
let selectedAngle = angleMode;
let selectedSetting = 0;

const settingsItems = [angleSettings];

function updateSettingsDisplay(){
    settingsMain.classList.toggle("active", settingsPage === "main");
    angleMenu.classList.toggle("active", settingsPage === "angle");

    settingsItems.forEach((item, index) => {
        item.classList.toggle("selected", index === selectedSetting)
    });

    angleOption.textContent = angleMode;

    degOption.classList.toggle("selected", selectedAngle === "DEG");
    radOption.classList.toggle("selected", selectedAngle === "RAD");
}

settingsBtn.addEventListener('click', () => {
    settingsOpen = !settingsOpen;

    if(settingsOpen){
        settingsPage = "main";
        selectedAngle = angleMode;
        selectedSetting = 0;
        settingsMenu.classList.add("active");
    } else{
        settingsMenu.classList.remove("active");
        settingsPage = "main";
    }

    updateSettingsDisplay();
});

function moveSetting(direction){
    if(!settingsOpen || settingsPage !== "main") return;

    selectedSetting = (selectedSetting + direction + settingsItems.length) % settingsItems.length;
    updateSettingsDisplay();
}

function moveAngle(direction){
    if(!settingsOpen || settingsPage !== "angle") return;

    selectedAngle = direction === 1 ? "RAD" : "DEG";
    updateSettingsDisplay();
}

function openSettings(){
    if(!settingsOpen || settingsPage !== "main") return;

    if(settingsItems[selectedSetting] === angleSettings){
        settingsPage = "angle";
        selectedAngle = angleMode;
    }

    updateSettingsDisplay();
}

function saveAngle(){
    if(!settingsOpen || settingsPage !== "angle") return;

    angleMode = selectedAngle;
    localStorage.setItem("angleMode", angleMode);
    settingsPage = "main";
    updateSettingsDisplay();
}

// arrow navigation
upArrow.addEventListener('click', () => {
    if(settingsPage === "main"){
        moveSetting(-1);
    }
});

downArrow.addEventListener('click', () => {
    if(settingsPage === "main"){
        moveSetting(1)
    }
});

leftArrow.addEventListener('click', () => {
    if(!settingsOpen){
        if(settingsPage === "main"){
            settingsMenu.classList.remove("active");
            settingsOpen = false;
            settingsPage = "main";
        } else{
            moveAngle(-1);
        }
    } else if(isOn){
        moveCursor("left");
    }
});

rightArrow.addEventListener('click', () => {
    if(!settingsOpen){
        if(settingsPage === "main"){
            openSettings();
        } else{
            moveAngle(1);
        }
    } else if(isOn){
        moveCursor("right");
    }
});

okBtn.addEventListener('click', () => {
    if(!settingsOpen) return;

    if(settingsPage === "main"){
        openSettings();
    } else{
        saveAngle();
    }
});

updateSettingsDisplay();

// fraction display
const fractionBtn = document.querySelector(".fraction");
const mixedFractionBtn = document.querySelector(".mixedfraction");

function createSequence(parent = null, field = null){
    return{
        items: [],
        cursor: 0,
        parent,
        field
    };
}

const rootSequence = createSequence();
let activeSequence = rootSequence;

function createFraction(type = "fraction"){
    const fraction = {type, parentSequence: activeSequence};

    if(type === "mixed"){
        fraction.whole = createSequence(fraction, "whole");
    }

    fraction.numerator = createSequence(fraction, "numerator");
    fraction.denominator = createSequence(fraction, "denominator");

    return fraction;
}

function serialize(sequence){
    return sequence.items.map(item => {
        if (typeof item === "string") return item;

        const numerator = serialize(item.numerator);
        const denominator = serialize(item.denominator);

        if(item.type === "mixed"){
            return `${serialize(item.whole)}*(${numerator})/(${denominator})`;
        }

        return `(${numerator})/(${denominator})`;
    }).join("");
}

function insertText(value){
    const chars = [...value];

    activeSequence.items.splice(activeSequence.cursor, 0, ...chars);
    activeSequence.cursor += chars.length;

    expression = serialize(rootSequence);
    updateDisplay();
}

function insertFraction(type){
    const fraction = createFraction(type);

    activeSequence.items.splice(activeSequence.cursor, 0, fraction);
    activeSequence.cursor++;

    activeSequence = type === "mixed" ? fraction.whole : fraction.numerator;

    justCalculated = false;
    expression = serialize(rootSequence);
    updateDisplay();
}

fractionBtn.addEventListener('click', () => {
    if(isOn) insertFraction("fraction");
});

mixedFractionBtn.addEventListener('click', () => {
    if(isOn) insertFraction("mixed");
});

function renderSequence(sequence){
    let html = "";

    sequence.items.forEach((item, index) => {
        if(sequence === activeSequence && index === sequence.cursor){
            html += `<span class="cursor"></span>`;
        }

        if(typeof item === "string"){
            html += item
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/\*/g, "×")
                .replace(/\//g, "÷");
        } else{
            if(item.type === "mixed"){
                html += `
                    <span class="mixed-expression">
                        <span class="mixed-whole">
                            ${renderSequence(item.whole)}
                        </span>
                `;
            }

            html += `
                <span class="fraction-expression">
                    <span class="fraction-field">
                        ${renderSequence(item.numerator)}
                    </span>
                    <span class="fraction-line"></span>
                    <span class="fraction-field">
                        ${renderSequence(item.denominator)}
                    </span>
                </span>
            `;

            if(item.type === "mixed"){
                html += `</span>`;
            }
        }
    });

    if(sequence === activeSequence && sequence.cursor === sequence.items.length){
        html += `<span class="editor-cursor"></span>`;
    }

    return html;
}

function moveCursor(direction){
    const sequence = activeSequence;
    const fraction = sequence.parent;

    if(direction === "left"){
        if(sequence.cursor > 0){
            sequence.cursor--;
        } else if(fraction){
            if(sequence.field === "denominator"){
                activeSequence = fraction.numerator;
                activeSequence.cursor = activeSequence.items.length;
            } else if(sequence.field === "numerator" && fraction.type === "mixed"){
                activeSequence = fraction.whole;
                activeSequence.cursor = activeSequence.items.length;
            } else{
                const parentSequence = fraction.parentSequence;
                activeSequence = parentSequence;
                activeSequence.cursor = activeSequence.items.indexOf(fraction);
            }
        }
    }

    if(direction === "right"){
        if(sequence.cursor < sequence.items.length){
            sequence.cursor++;
        } else if(fraction){
            if(sequence.field === "whole"){
                activeSequence = fraction.numerator;
                activeSequence.cursor = 0;
            } else if(sequence.field === "numerator"){
                activeSequence = fraction.whole;
                activeSequence.cursor = 0;
            } else{
                const parentSequence = fraction.parentSequence;
                activeSequence = parentSequence;
                activeSequence.cursor = activeSequence.items.indexOf(fraction) + 1;
            }
        }
    }

    updateDisplay();
}

function deleteEditorCharacter(){
    if(activeSequence.cursor > 0){
        activeSequence.items.splice(activeSequence.cursor - 1, 1);
        activeSequence.cursor--;
    } else if(activeSequence.parent){
        const fraction = activeSequence.parent;

        if(activeSequence.field === "denominator"){
            activeSequence = fraction.numerator;
            activeSequence.cursor = activeSequence.items.length;
        } else if(activeSequence.field === "numerator" && fraction.type === "mixed"){
            activeSequence = fraction.whole;
            activeSequence.cursor = activeSequence.items.length;
        } else{
            const parentSequence = fraction.parentSequence;
            const index = parentSequence.items.indexOf(fraction);

            parentSequence.items.splice(index, 1);
            activeSequence = parentSequence;
            activeSequence.cursor = index;
        }
    }

    expression = serialize(rootSequence);
    updateDisplay();
}

// all clear and delete buttons
const allClearBtn = document.getElementById("allclear");
const deleteBtn = document.getElementById("delete");

allClearBtn.addEventListener('click', () => {
    if(!isOn) return;

    rootSequence.items = [];
    rootSequence.cursor = 0;
    activeSequence = rootSequence;

    expression = "";
    justCalculated = false;

    enteringRoot = false;
    enteringSqrt = false;
    rootIndex = "";

    enteringLog = false;
    logBase = "";

    shiftActive = false;
    shiftBtn.classList.remove("active");

    resultDisplay.textContent = 0;
    updateDisplay();
});

deleteBtn.addEventListener('click', () => {
    if(!isOn) return;

    deleteEditorCharacter();
    justCalculated = false;
});

// equal to button and solving the equation
const executeBtn = document.getElementById("exe");

executeBtn.addEventListener('click', () => {
    if(!isOn || !expression) return;

    try{
        let calculation = expression
            .replace(/\bAns\b/g, `(${ans})`)
            .replace(/sqrt\(/g, "Math.sqrt(")
            .replace(/ln\(/g, "Math.log(");

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

        const logFunction = (base, value) => {
            if(base <= 0 || base === 1 || value <= 0){
                throw new Error("Invalid logarithim");
            }

            return Math.log(value) / Math.log(base);
        }

        const toRadians = angle => {
            return angleMode === "DEG" ? angle * Math.PI / 180 : angle;
        };
        const toDegrees = angle => {
            return angleMode === "DEG" ? angle * 180 / Math.PI : angle;
        };

        const sin = angle => {
            const result = Math.sin(toRadians(angle));
            return Math.abs(result) < 1e-10 ? 0 : result;
        };
        const cos = angle => {
            const result = Math.cos(toRadians(angle));
            return Math.abs(result) < 1e-10 ? 0 : result;
        };
        const tan = angle => {
            if(Math.abs(Math.cos(toRadians(angle))) < 1e-10){
                return NaN;
            }
    
            const result = Math.tan(toRadians(angle));
            return Math.abs(result) < 1e-10 ? 0 : result;
        };

        const asin = value => toDegrees(Math.asin(value));
        const acos = value => toDegrees(Math.acos(value));
        const atan = value => toDegrees(Math.atan(value));
        
        const answer = Function("Math", "root", "log", "sin", "cos", "tan", "arcsin", "arccos", "arctan", `"use strict"; return (${calculation})`)(Math, rootFunction, logFunction, sin, cos, tan, asin, acos, atan);

        if(!Number.isFinite(answer)){
            throw new Error("Invalid calculation");            
        }

        ans = Number(answer.toPrecision(10));
        resultDisplay.textContent = ans;
        rootSequence.items = [..."Ans"];
        rootSequence.cursor = 3;
        activeSequence = rootSequence;

        rootSequence.items = [..."Ans"];
        rootSequence.cursor = 3;
        activeSequence = rootSequence;
        expression = "Ans";
        justCalculated = true;

        enteringRoot = false;
        enteringSqrt = false;
        rootIndex = "";

        enteringLog = false;
        logBase = "";

        updateDisplay();
    } catch(error){
        console.error(error);
        resultDisplay.textContent = "Error";
        justCalculated = false;
    }
});

updateDisplay();

// how to use popup
const howToUse = document.getElementById("howToUse");
const howPopup = document.getElementById("howPopup");
const closeHow = document.getElementById("closeHow");

howToUse.addEventListener('click', () => {
    howPopup.classList.add("active");
});

closeHow.addEventListener('click', () => {
    howPopup.classList.remove("active");
});

document.addEventListener('keydown', (e) => {
    if(e.key === "Escape"){
        howPopup.classList.remove("active");
    }
});