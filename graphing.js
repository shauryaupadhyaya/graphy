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
            ctx.lineTo(x, Math.round(canvas.width));
        }
        for (let x = canvas.width/2 - gridSize; x>=0; x -= gridSize) {
            let roundedX = Math.floor(x);
            ctx.moveTo(x, 0);
            ctx.lineTo(x, Math.round(canvas.width));
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
    }
    window.addEventListener('resize', resizeArea);
    resizeArea();

    const closeEqButtons = document.querySelectorAll(".equation-delete");
    closeEqButtons.forEach(button => {
        button.addEventListener('click', (e)=> {
            e.preventDefault();
            console.log("close button: " + e + " pressed.");
        })
    })
})