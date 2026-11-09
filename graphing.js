document.addEventListener('DOMContentLoaded', async (e)=>{
    const equationInputTemplate = document.getElementById("equation-input-template");
    const equationInputs = document.querySelectorAll(".equation");
    const eqInputList = document.getElementById("equations-bottom");
    let view = {
        xMin: -10,
        xMax: 10,
        yMin: -10,
        yMax: 10
    };

    // eqInputList.addEventListener('keydown', (e)=>{
    //     if (e.key === 'Enter' && e.target.matches('.equation')) {
    //         const element = e.target;
    //         const clone = equationInputTemplate.content.cloneNode(true);
    //         let cloneNumber = element.parentElement.querySelector(".equation-number").textContent;
    //         cloneNumber++;
    //         clone.querySelector(".equation-number").textContent = cloneNumber;
    //         eqInputList.appendChild(clone);
    //         eqInputListCount++;
    //         // shopSale();
    //     }
    // });

    function updateEquationNumbers(){
        const boxes = eqInputList.querySelectorAll(".equations-input-box");

        boxes.forEach((box, index) => {
            box.querySelector(".equation-number").textContent = index + 1
        });
    }

    function addEquation(){
        const clone = equationInputTemplate.content.cloneNode(true);

        eqInputList.appendChild(clone);
        updateEquationNumbers();
    }

    const addEq = document.getElementById("add-equation");
    addEq.addEventListener("click", addEquation);
    
    eqInputList.addEventListener("keydown", (e) => {
        if(e.key === "Enter" && e.target.matches(".equation")){
            addEquation();
        }
    });

    const observer = new MutationObserver((mutationsList)=> {
        for (const mutation of mutationsList) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const input = node.querySelector(".equation");
                    if (input) {
                        input.focus();
                    }
                }
            }
        }
    });

    observer.observe(eqInputList, {childList: true});
    let redrawTimeout;

    const canvas = document.getElementById('graph');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    const ctx = canvas.getContext('2d');

    function screenToMathX(screenX){
        return view.xMin + (screenX / canvas.width) * (view.xMax - view.xMin);
    }
    
    function screenToMathY(screenY){
        return view.yMax - (screenY / canvas.height) * (view.yMax - view.yMin);
    }

    function mathToScreenX(x){
        return ((x - view.xMin) / (view.xMax - view.xMin)) * canvas.width;
    }

    function mathToScreenY(y){
        return ((view.yMax - y) / (view.yMax - view.yMin)) * canvas.height;
    }

    function getGridStep(range){
        const roughStep = range / 10;
        const power = Math.pow(10, Math.floor(Math.log10(roughStep)));
        const fraction = roughStep / power;

        let niceFraction;

        if(fraction <= 1) niceFraction = 1;
        else if (fraction <= 2) niceFraction = 2;
        else if (fraction <= 5) niceFraction = 5;
        else niceFraction = 10;

        return niceFraction * power;
    }

    function drawGrid(){
        const xStep = getGridStep(view.xMax - view.xMin);
        const yStep = getGridStep(view.yMax - view.yMin);

        ctx.strokeStyle = '#555555';
        ctx.lineWidth = 1;
        ctx.beginPath();

        for(let x = Math.ceil(view.xMin / xStep) * xStep; x <= view.xMax; x += xStep){
            const px = mathToScreenX(x);
            ctx.moveTo(px, 0);
            ctx.lineTo(px, canvas.height);
        }

        for(let y = Math.ceil(view.yMin / yStep) * yStep; y <= view.yMax; y += yStep){
            const py = mathToScreenY(y);
            ctx.moveTo(0, py);
            ctx.lineTo(canvas.width, py);
        }

        ctx.stroke();
    }

    function drawAxes(){
        ctx.strokeStyle = '#aaaaaa';
        ctx.lineWidth = 2;
        ctx.beginPath();

        if(view.xMin <= 0 && view.xMax >= 0){
            const x = mathToScreenX(0);
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
        }

        if(view.yMin <= 0 && view.yMax >= 0){
            const y = mathToScreenY(0);
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
        }

        ctx.stroke();
    }
    
    // function drawAxes(offsetX, offsetY) {
    //     ctx.strokeStyle = 'black';
    //     ctx.lineWidth = 2;
    //     ctx.beginPath();
    //     // y-axis
    //     ctx.moveTo(canvas.width/2+offsetX, 0);
    //     ctx.lineTo(canvas.width/2+offsetX, canvas.height);
    //     // x-axis
    //     ctx.moveTo(0, canvas.height/2 + offsetY);
    //     ctx.lineTo(canvas.width, canvas.height/2 + offsetY);
    //     ctx.stroke();
    // }

    // function drawGrid(gridSize, offsetY, offsetX) {
    //     ctx.strokeStyle = 'gray';
    //     ctx.lineWidth = 1;
    //     ctx.beginPath();
    //     for (let x = (canvas.width/2 + offsetX); x <= canvas.width; x += gridSize) {
    //         let roundedX = Math.floor(x);
    //         ctx.moveTo(x, 0);
    //         ctx.lineTo(x, Math.round(canvas.height));
    //     }
    //     for (let x = (canvas.width/2 - gridSize + offsetX); x>=0; x -= gridSize) {
    //         let roundedX = Math.floor(x);
    //         ctx.moveTo(x, 0);
    //         ctx.lineTo(x, Math.round(canvas.height));
    //     }
    //     for (let y = (canvas.height/2 + offsetY); y <= canvas.height; y += gridSize) {
    //         ctx.moveTo(0, y);
    //         ctx.lineTo(Math.round(canvas.width), y);
    //     }
    //     for (let y = (canvas.height/2 - gridSize + offsetY); y>=0; y -= gridSize) {
    //         ctx.moveTo(0, y);
    //         ctx.lineTo(Math.round(canvas.width), y);
    //     }
    //     ctx.stroke();
    // }

    function resizeArea(offsetX, offsetY) {
        redrawGraph();
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

            updateEquationNumbers();
            redrawGraph();
        }
    });

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
    });

    function redrawGraph(offsetX, offsetY) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawGrid();
        drawAxes();
        drawGridNumbers();
        
        document.querySelectorAll(".equation").forEach(input => {
            if (input.value.trim() !== '') {
                plotEquation(input.value, input.dataset.color);
            }
        });
    }

    // zoom with scroll
    function zoomAt(clientX, clientY, factor){
        const rect = canvas.getBoundingClientRect();

        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;

        const anchorX = screenToMathX(mouseX);
        const anchorY = screenToMathY(mouseY);

        view.xMin = anchorX - (anchorX - view.xMin) / factor;
        view.xMax = anchorX + (view.xMax - anchorX) / factor;
        view.yMin = anchorY - (anchorY - view.yMin) / factor;
        view.yMax = anchorY + (view.yMax - anchorY) / factor;

        // const oldGridSize = getGridSize();

        // const graphX = (mouseX - (canvas.width / 2 + gridOffsetX)) / oldGridSize;
        // const graphY = (canvas.height / 2 - gridOffsetY - mouseY) / oldGridSize;

        // zoom = Math.max(0.2, Math.min(zoom * zoomFactor, 8));

        // const newGridSize = getGridSize();

        // gridOffsetX = mouseX - canvas.width / 2 - graphX * newGridSize;
        // gridOffsetY = mouseY - canvas.height / 2 - graphY * newGridSize;

        redrawGraph();
    }

    canvas.addEventListener("wheel", (e) => {
        if(!e.ctrlKey && !e.metaKey) return;

        e.preventDefault();
        const factor = Math.exp(-e.deltaY * 0.01);
        zoomAt(e.clientX, e.clientY, factor);
    }, {passive: false});

    let lastGestureScale = 1;

    canvas.addEventListener("gesturestart", (e) => {
        e.preventDefault();
        lastGestureScale = 1;
    });

    canvas.addEventListener("gesturechange", (e) => {
        e.preventDefault();

        const factor = e.scale / lastGestureScale;
        lastGestureScale = e.scale;

        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || rect.left + rect.width / 2;
        const clientY = e.clientY || rect.top + rect.height / 2;

        zoomAt(clientX, clientY, factor);
    });

    canvas.addEventListener("gestureend", (e) => {
        e.preventDefault();
        lastGestureScale = 1;
    });

    // click and drag to pan graph
    let isPanning = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    canvas.addEventListener("pointerdown", (e) => {
        if(e.button !== 0) return;

        isPanning = true;

        lastMouseX = e.clientX;
        lastMouseY = e.clientY;

        canvas.setPointerCapture(e.pointerId);
        canvas.style.cursor = "grabbing";
    });

    canvas.addEventListener("pointermove", (e) => {
        if(!isPanning) return;

        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;

        const xUnitsPerPixel = (view.xMax - view.xMin) / canvas.width;
        const yUnitsPerPixel = (view.yMax - view.yMin) / canvas.height;

        view.xMin -= dx * xUnitsPerPixel;
        view.xMax -= dx * xUnitsPerPixel;
        view.yMin += dy * yUnitsPerPixel;
        view.yMax += dy * yUnitsPerPixel;

        lastMouseX = e.clientX;
        lastMouseY = e.clientY;

        redrawGraph();
    });

    function stopPanning(){
        isPanning = false;
        canvas.style.cursor = "grab";
    }

    canvas.addEventListener("pointerup", stopPanning);
    canvas.addEventListener("pointercancel", stopPanning);

    function plotEquation(value, color) {
        if (!value.trim()) return;
        let compiled;
        console.log("Plotting:", value);
        
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
            console.log("Compiled successfully", compiled);       
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
        
        function mathX(px) {
            return screenToMathX(px);
        }

        function mathY(py) {
            return screenToMathY(py);
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

                    if ((a <= 0 && b >= 0) || (a >= 0 && b <= 0)) {
                        if (a !== b) {
                            crossings.push(
                                intersection(points[i], points[j], a, b)
                            );
                        }
                    }
                }

                if (crossings.length === 2) {
                    ctx.moveTo(crossings[0].x, crossings[0].y);
                    ctx.lineTo(crossings[1].x, crossings[1].y);
                } else if (crossings.length === 4) {
                    ctx.moveTo(crossings[0].x, crossings[0].y);
                    ctx.lineTo(crossings[1].x, crossings[1].y);

                    ctx.moveTo(crossings[2].x, crossings[2].y);
                    ctx.lineTo(crossings[3].x, crossings[3].y);
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

    function drawGridNumbers(gridSize, offsetX, offsetY) {
        const xStep = getGridStep(view.xMax - view.xMin);
        const yStep = getGridStep(view.yMax - view.yMin);

        const hasYAxis = view.xMin <= 0 && view.xMax >= 0;
        const hasXAxis = view.yMin<= 0 && view.yMax >= 0;

        const axisX = hasYAxis ? mathToScreenX(0) : 0;
        const axisY = hasXAxis ? mathToScreenY(0) : canvas.height;

        ctx.save();

        ctx.fillStyle = 'white';
        ctx.font = '12px Rubik';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        // X-axis numbers
        for (let x = Math.ceil(view.xMin / xStep) * xStep; x <= view.xMax; x+= xStep) {
            if(Math.abs(x) < 0.0000001) continue;

            const px = mathToScreenX(x);
            const py = hasXAxis ? axisY + 8 : canvas.height - 20;

            ctx.fillText(Number(x.toPrecision(6)), px, py);
        }

        // Y-axis numbers
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        for (let y = Math.ceil(view.yMin / yStep) * yStep; y <= view.yMax; y += yStep){
            if(Math.abs(y) < 0.0000001) continue;

            const px = hasYAxis ? axisX + 8 : 8;
            const py = mathToScreenY(y);

            ctx.fillText(Number(y.toPrecision(6)), px, py);
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
            });
        });
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
    });

    setUpListenersC();
    
    // shopSale();
    // const gridControls = document.getElementById("graph-nav");
    // const gridUp = document.getElementById("graph-up");
    // const gridDown = document.getElementById("graph-down");
    // const gridLeft = document.getElementById("graph-left");
    // const gridRight = document.getElementById("graph-right");
    
    // gridUp.addEventListener('click', (e)=> {
    //     e.preventDefault();
    //     moveGrid(0, 1);
    // })
    
    // gridDown.addEventListener('click', (e)=> {
    //     e.preventDefault();
    //     moveGrid(0, -1);
    // })
    
    // gridLeft.addEventListener('click', (e)=> {
    //     e.preventDefault();
    //     moveGrid(-1, 0);
    // })
    
    // gridRight.addEventListener('click', (e)=> {
    //     e.preventDefault();
    //     moveGrid(1, 0);
    // })
    
    // function moveGrid(toOffsetX, toOffsetY) {
    //     const gridSize = Math.max(15, Math.round(Math.min(canvas.height, canvas.width)/20))
    //     gridOffsetX += toOffsetX * gridSize;
    //     gridOffsetY += toOffsetY * gridSize;
    //     redrawGraph(gridOffsetX, gridOffsetY);
    // }

    // resize equations sidebar dragging
    const equations = document.getElementById("equations");
    let isResizing = false;

    equations.addEventListener("pointerdown", (e) => {
        const rect = equations.getBoundingClientRect();
        
        if(e.clientX < rect.right - 2) return;

        isResizing = true;
        equations.classList.add("resizing");
        equations.setPointerCapture(e.pointerId);
    });

    equations.addEventListener("pointermove", (e) => {
        if(!isResizing) return;
        
        const minWidth = 200;
        const maxWidth = window.innerWidth * 0.4;

        const newWidth = Math.max(minWidth, Math.min(e.clientX, maxWidth));
        equations.style.width = `${newWidth}px`;

        redrawGraph();
    });

    function stopResizing(){
        if(!isResizing) return;

        isResizing = false;
        equations.classList.remove("resizing");
        redrawGraph();
    }

    equations.addEventListener("pointerup", stopResizing);
    equations.addEventListener("pointercancel", stopResizing);
})
