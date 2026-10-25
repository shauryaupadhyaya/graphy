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
        }
    })
    const canvas = document.getElementById('graph');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
    function drawAxes() {
        ctx.strokeStyle = 'white';
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
        drawGridNumbers(gridSize)
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
        } else {
            const boxToDel = e.target.parentElement;
            boxToDel.remove();
        }
    })
    eqInputs.forEach(equation => {
        equation.querySelector('.equation').addEventListener('input', (e)=> {
            graphIT(equation.querySelector(".equation").value);
        })
    })
    function graphIT(value) {
        console.log("Equation being sent to me: ", value);
        if (isValidEquation(value)) {
            console.log("Equation sent is valid");
            // generate points
            const compile = math.compile(value);
            const points = [];
        } else {
            console.log("Equation sent is invalid");
        }
    }
    
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

        ctx.fillStyle = 'white';
        ctx.font = '12px Rubik';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        const originX = canvas.width / 2;
        const originY = canvas.height / 2;

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
})