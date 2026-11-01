import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
document.addEventListener('DOMContentLoaded', async (e)=>{
    const maincanvas = document.getElementById("maincanvas");
    const equationInputTemplate = document.getElementById("equation-input-template");
    const equationInputs = document.querySelectorAll(".equation");
    const eqInputList = document.getElementById("equations-bottom");
    let gridOffsetX = 0;
    let gridOffsetY = 0;
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
    let eqInputs = eqInputList.querySelectorAll(".equations-input-box");
    eqInputList.addEventListener('click', (e)=> {
        e.preventDefault();
        const button = e.target.closest(".equation-delete");
        if (!button || !eqInputList.contains(button)) return;
        eqInputs = eqInputList.querySelectorAll(".equations-input-box");
        console.log(eqInputs.length);
        if (eqInputs.length === 1) {
            eqInputs[0].querySelector(".equation").value = '';
            redrawGraph(gridOffsetX, gridOffsetY);
        } else {
            const boxToDel = e.target.parentElement;
            boxToDel.remove();
            redrawGraph(gridOffsetX, gridOffsetY);
        }
    })
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, maincanvas.clientWidth / maincanvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(maincanvas.clientWidth, maincanvas.clientHeight);
    maincanvas.appendChild(renderer.domElement)
    const controls = new OrbitControls( camera, renderer.domElement );
    const material = new THREE.LineBasicMaterial({color: 0x0000ff, linewidth: 2});
    const boxGeometry = new THREE.BoxGeometry(50, 50, 50);
    const edgeGeometry = new THREE.EdgesGeometry(boxGeometry);
    const cubeBorder = new THREE.LineSegments(edgeGeometry, material);
    camera.position.z = 100;
    scene.add(cubeBorder);
    const bidirectionalAxes = new THREE.Group();
    const axesHelper = new THREE.AxesHelper(20);
    bidirectionalAxes.add(axesHelper);
    const negAxes = new THREE.AxesHelper(20);
    negAxes.scale.set(-1, -1, -1);
    bidirectionalAxes.add(negAxes);
    scene.add(bidirectionalAxes);
    function animate() {
        controls.update();
        renderer.render(scene, camera);
    }
    function updateTheme() {
        const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (isDarkMode) {
            scene.background = new THREE.Color(0x000000);
        } else {
            scene.background = new THREE.Color(0xffffff);
        }
    }
    function createAxesHelper(size = 5, thickness = 0.05) {
        const group = new THREE.Group();
        const createAxes = (color, rotation, position) => {
            const geometry = new THREE.CylinderGeometry(thickness, thickness, size, 16);
            const material = new THREE.MeshBasicMaterial({color});
            const cylinder = new THREE.Mesh(geometry, material);
            cylinder.rotation.set(rotation.x, rotation.y, rotation.z);
            group.add(cylinder);
        }
        createAxes(0xff0000, {
            x: 0,
            y: 0,
            z: Math.PI/2
        })
        createAxes(0x00ff00, {
            x: 0,
            y: Math.PI/2,
            z: 0,
        })
        createAxes(0x0000ff, {
            x: Math.PI/2,
            y: 0,
            z: 0,
        })
        return group;
    }
    updateTheme();
    const axes = createAxesHelper(50, 0.5);
    scene.add(axes);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);
    renderer.setAnimationLoop(animate);
    
})