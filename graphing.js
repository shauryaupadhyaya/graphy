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
})