document.addEventListener('DOMContentLoaded', async (e)=>{
    const equationInputTemplate = document.getElementById("equation-input-template");
    const equationInputs = document.querySelectorAll(".equation");
    const eqInputList = document.getElementById("equations-bottom");
    eqInputList.addEventListener('keydown', (e)=>{
        if (e.key === 'Enter' && e.target.matches('.equation')) {
            const element = e.target;
            const clone = equationInputTemplate.content.cloneNode(true);
            let cloneNumber = element.parentElement.querySelector(".equation-number").textContent;
            cloneNumber++;
            clone.querySelector(".equation-number").textContent = cloneNumber;
            eqInputList.appendChild(clone);
            // shopSale();
        }
    })
    let redrawTimeout;
    const canvas = document.getElementById('graph');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
    function drawAxes() {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        // y-axis
        ctx.moveTo(canvas.width/2, 0);
        ctx.lineTo(canvas.width/2, canvas.height);
        // x-axis
        ctx.moveTo(0, canvas.height/2);
        ctx.lineTo(canvas.width, canvas.height/2);
        ctx.stroke();
    }
    function drawGrid(gridSize) {
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = canvas.width/2; x <= canvas.width; x += gridSize) {
            let roundedX = Math.floor(x);
            ctx.moveTo(x, 0);
            ctx.lineTo(x, Math.round(canvas.height));
        }
        for (let x = canvas.width/2 - gridSize; x>=0; x -= gridSize) {
            let roundedX = Math.floor(x);
            ctx.moveTo(x, 0);
            ctx.lineTo(x, Math.round(canvas.height));
        }
        for (let y = canvas.height/2; y <= canvas.height; y += gridSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(Math.round(canvas.width), y);
        }
        for (let y = canvas.height/2 - gridSize; y>=0; y -= gridSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(Math.round(canvas.width), y);
        }
        ctx.stroke();
    }
    function resizeArea() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.translate(0, canvas.height);
        ctx.scale(1, -1);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const gridSize = Math.max(15, Math.round(Math.min(canvas.height, canvas.width)/20))
        drawGrid(gridSize);
        drawAxes();
        drawGridNumbers(gridSize);
        document.querySelectorAll(".equation").forEach(input => {
            if (input.value.trim() !== '') {
                redrawGraph();
            }
        })
    }
    window.addEventListener('resize', resizeArea);
    resizeArea();
    let eqInputs = eqInputList.querySelectorAll(".equations-input-box");
    eqInputList.addEventListener('click', (e)=> {
        e.preventDefault();
        const button = e.target.closest(".equation-delete");
        if (!button || !eqInputList.contains(button)) return;
        eqInputs = eqInputList.querySelectorAll(".equations-input-box");
        console.log(eqInputs.length);
        if (eqInputs.length === 1) {
            eqInputs[0].querySelector(".equation").value = '';
            redrawGraph();
        } else {
            const boxToDel = e.target.parentElement;
            boxToDel.remove();
            redrawGraph();
        }
    })
    // eqInputs.forEach(equation => {
    //     equation.querySelector('.equation').addEventListener('input', (e)=> {
    //         redrawGraph();
    //     })
    // })
    eqInputList.addEventListener('input', (e)=> {
        if (e.target.matches('.equation')) {
            clearTimeout(redrawTimeout);
            redrawTimeout = setTimeout(() => {
                redrawGraph();
            }, 150);
        }
    })
    function redrawGraph() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(0, canvas.height);
        ctx.scale(1, -1);
        const gridSize = Math.max(15, Math.round(Math.min(canvas.height, canvas.width)/20))
        drawGrid(gridSize);
        drawAxes();
        drawGridNumbers(gridSize);
        document.querySelectorAll(".equation").forEach(input => {
            if (input.value.trim() !== '') {
                console.log(input.value)
                plotEquation(input.value, gridSize, input.dataset.color);
            }
        })
    }
    function plotEquation(value, gridSize, color) {
        if (!value.trim()) return;
        let compiled;
        try {
            const parts = value.split('=');
            if (parts.length === 2) {
                if (!parts[0].trim() || !parts[1].trim()) return;
                compiled = math.parse(`${parts[0]} - ${parts[1]}`).compile();
            } else if (parts.length === 1) {
                compiled = math.parse(`y - ${value}`).compile();
            } else {
                return;
            }
            // if (node.isOperatorNode && node.op === '=') {
            //     const difference = new Math.operatorNode(
            //         '-',
            //         'subtract',
            //         node.args
            //     );
            //     compiled = difference.compile();
            // } else {
            //     compiled = math.parse(`y-(${value})`).compile();
            // }
        } catch (error) {
            console.error("Invalid equation: ", value, error);
            return;
        }
        function evaluate(x, y) {
            try {
                const result = compiled.evaluate({x, y});
                return typeof result === 'number' && Number.isFinite(result)? result : NaN;
            } catch {
                return NaN;
            }
        }
        const width = canvas.width;
        const height = canvas.height;
        const originX = width/2;
        const originY = height/2;
        
        function mathX(px) {
            return (px - originX) / gridSize;
        }

        function mathY(py) {
            return (originY - py) / gridSize;
        }

        // ai generated function below
        function intersection(a, b, va, vb) {
            const t = va / (va - vb);

            return {
                x: a.x + (b.x - a.x) * t,
                y: a.y + (b.y - a.y) * t
            };
        }

        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        const step = 5;

        for (let py = 0; py < height; py += step) {
            for (let px = 0; px < width; px += step) {
                const points = [
                    {x: px, y: py},
                    {x: px + step, y: py},
                    {x: px + step, y: py + step},
                    {x: px, y: py+step},
                ]
                const values = points.map(p => evaluate(mathX(p.x), mathY(p.y)));
                if (values.some(v => !Number.isFinite(v))) {
                    continue;
                }
                const crossings = [];

                for (let i = 0; i < 4; i++) {
                    const j = (i + 1) % 4;
                    const a = values[i];
                    const b = values[j];

                    if ((a < 0 && b > 0) || (a > 0 && b < 0)) {
                        crossings.push(
                            intersection(points[i], points[j], a, b)
                        );
                    }
                }

                if (crossings.length === 2) {
                    ctx.moveTo(crossings[0].x, height - crossings[0].y);
                    ctx.lineTo(crossings[1].x, height - crossings[1].y);
                } else if (crossings.length === 4) {
                    ctx.moveTo(crossings[0].x, height - crossings[0].y);
                    ctx.lineTo(crossings[1].x, height - crossings[1].y);

                    ctx.moveTo(crossings[2].x, height - crossings[2].y);
                    ctx.lineTo(crossings[3].x, height - crossings[3].y);
                }
            }
        }
        ctx.stroke();
        ctx.restore();
    }
        // console.log("Equation being sent to me: ", value);
        // if (isValidEquation(value)) {
        //     console.log("Equation sent is valid");
        //     // generate points
        //     const node = math.parse(value);
        //     let compiled;
        //     if (node.isOperatorNode && node.op === '=') {
        //         compiled = new Math.operatorNode(
        //             '-',
        //             'subtract',
        //             node.args
        //         ).compile();
        //     } else {
        //         compiled = math.parse(`y-(${value})`).compile();
        //     }
        //     const compile = math.compile(value);
        //     const points = [];
        //     const start = -Math.floor((canvas.width/2)/gridSize);
        //     const end = Math.floor((canvas.width/2)/gridSize);
        //     const step = 1;
        //     ctx.fillStyle = color;
        //     ctx.strokeStyle = color;
        //     ctx.lineWidth = 3;
        //     ctx.beginPath();
        //     let firstPoint = true;
        //     for (let x = start; x <= end; x+= 0.1) {
        //         const y = compile.evaluate({x:x});
        //         const canvasX = canvas.width / 2 + x * gridSize;
        //         const canvasY = canvas.height / 2 + y * gridSize;
        //         points.push({x, y});
        //         if (!Number.isFinite(y)) {
        //             firstPoint = true;
        //             continue;
        //         }
        //         if (firstPoint) {
        //             ctx.moveTo(canvasX, canvasY);
        //             firstPoint = false;
        //         } else {
        //             ctx.lineTo(canvasX, canvasY )
        //         }
        //         ctx.stroke();
        //     }
        //     console.log(points);
        //     // draw points
        // } else {
        //     console.log("Equation sent is invalid");
        // }
    // }
    
    function isValidEquation(eq) {
        try {
            math.parse(eq);
            return true;
        } catch (error) {
            return false;
        }
    }
    function drawGridNumbers(gridSize) {
        ctx.save();

        // Reset the flipped coordinate system for text
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        ctx.fillStyle = 'black';
        ctx.font = '12px Rubik';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        const originX = canvas.width / 2;
        const originY = canvas.height/ 2;

        // X-axis numbers
        for (let x = 1; originX + x * gridSize < canvas.width; x++) {
            ctx.fillText(
                x,
                originX + x * gridSize,
                originY + 8
            );
        }

        for (let x = 1; originX - x * gridSize > 0; x++) {
            ctx.fillText(
                -x,
                originX - x * gridSize,
                originY + 8
            );
        }

        // Y-axis numbers
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        for (let y = 1; originY - y * gridSize > 0; y++) {
            ctx.fillText(
                y,
                originX + 8,
                originY - y * gridSize
            );
        }

        for (let y = 1; originY + y * gridSize < canvas.height; y++) {
            ctx.fillText(
                -y,
                originX + 8,
                originY + y * gridSize
            );
        }
        ctx.restore();
    }
    let eqNumberColor = 1;
    // const colorEditBtns = document.querySelectorAll(".color-pick");
    const colorMenu = document.querySelector(".edit-color");
    // function shopSale() {
    //     colorEditBtns.forEach(element => {
    //         element.addEventListener("click", (e)=> {
    //             if (colorMenu.classList.contains("slideIn")) {
    //                 colorMenu.classList.remove("slideIn");
    //                 colorMenu.classList.add("slideOut");
    //             } else if (colorMenu.classList.contains("slideOut")) {
    //                 colorMenu.classList.remove("slideOut");
    //                 colorMenu.classList.add("slideIn");
    //                 eqNumberColor = element.parentElement.querySelector(".equation-number").textContent;
    //                 console.log("Equation number being editied: " + eqNumberColor)
    //             } else {
    //                 colorMenu.classList.remove("slideOut");
    //                 colorMenu.classList.add("slideIn");
    //                 eqNumberColor = element.parentElement.querySelector(".equation-number").textContent;
    //                 console.log("Equation number being editied: " + eqNumberColor)
    //             }
    //         })
    //     })
    // }
    let colorToBecome;
    function setUpListenersC() {
        colorMenu.querySelectorAll("button").forEach(element => {
            element.addEventListener('click', (e)=> {
                colorToBecome = e.target.dataset.color;
                console.log("color to become: ", colorToBecome)
                const allNumbers = document.querySelectorAll(".equation-number");
                console.log(allNumbers[0]);
                for (let i = 0; i < allNumbers.length; i++) {
                    console.log(allNumbers[i].parentElement.parentElement);
                    if (allNumbers[i].textContent === eqNumberColor) {
                        allNumbers[i].parentElement.parentElement.querySelector(".equation").dataset.color = colorToBecome;
                        redrawGraph();
                    }
                }
            })
        })
    }
    eqInputList.addEventListener("click", (e)=> {
        const button = e.target.closest(".color-pick");
        if (!button) return;
        eqNumberColor = button.parentElement.querySelector(".equation-number").textContent;
        if (colorMenu.classList.contains("slideIn")) {
            colorMenu.classList.remove("slideIn");
            colorMenu.classList.add("slideOut");
        } else {
            colorMenu.classList.remove("slideOut");
            colorMenu.classList.add("slideIn");
        }
        console.log("Equation being edited: ", eqNumberColor);
    })
    setUpListenersC();
    // shopSale();
})