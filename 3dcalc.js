import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
document.addEventListener('DOMContentLoaded', async (e)=>{
    const maincanvas = document.getElementById("maincanvas");
    const equationInputTemplate = document.getElementById("equation-input-template");
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
    // create new threejs scene to hold all points
    const scene = new THREE.Scene();
    const environment = new THREE.Group();
    const graphs = new THREE.Group();
    const camera = new THREE.PerspectiveCamera(75, maincanvas.clientWidth / maincanvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(maincanvas.clientWidth, maincanvas.clientHeight);
    maincanvas.appendChild(renderer.domElement)
    const controls = new OrbitControls( camera, renderer.domElement );
    // box to show points limit
    const material = new THREE.LineBasicMaterial({color: 0x0000ff, linewidth: 2});
    const boxGeometry = new THREE.BoxGeometry(50, 50, 50);
    const edgeGeometry = new THREE.EdgesGeometry(boxGeometry);
    const cubeBorder = new THREE.LineSegments(edgeGeometry, material);
    camera.position.z = 100;
    environment.add(cubeBorder);
    function animate() {
        controls.update();
        renderer.render(scene, camera);
    }
    // dark/light mode toggle
    function updateTheme() {
        const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (isDarkMode) {
            scene.background = new THREE.Color(0x000000);
        } else {
            scene.background = new THREE.Color(0xffffff);
        }
    }
    // diy axes
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
    environment.add(axes);
    scene.add(environment);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);
    renderer.setAnimationLoop(animate);
    // points parsing
    eqInputList.addEventListener('input', async (e)=> {
        if (e.target.matches('.equation')) {
            const equation = e.target.value.trim();
            if (!equation) return;
            try {
                if (math.parse(e.target.value)) {
                    redrawGraph();
                };

            } catch(err) {
                console.log('Error: ', err);
            }
        }
    })
    function getPoints(eq) {
        // compile equation
        const compiled = math.compile(eq);
        const segments = [];
        let currentSegment = [];
        // set up for loop to check y values from minimum x to maximum x 
        for (let x = -20; x <= 20; x+=0.1) {
            try {
                const y = compiled.evaluate({x});
                if (typeof y === "number" && Number.isFinite(y) && y >= -25 && y <= 25) {
                    currentSegment.push({x, y});
                } else {
                    if (currentSegment.length >= 2) {
                        segments.push(currentSegment);
                    }
                    currentSegment = [];
                }
            } catch (error) {
                if (currentSegment.length >= 2) {
                    segments.push(currentSegment);
                }
                currentSegment = [];
            }
        }
        if (currentSegment.length >= 2) {
            segments.push(currentSegment);
        }
        currentSegment = [];
        return segments;
    }
    function plotEquation(eqPoints) {
        const geometry = new LineGeometry();
        const material = new LineMaterial({
            color: 0xff0000,
            linewidth: 4
        })
        const positions = [];
        eqPoints.forEach(point => {
            positions.push(point.x, point.y, point.z ?? 0);
        });
        geometry.setPositions(positions);
        const line = new Line2(geometry, material);
        line.computeLineDistances();
        graphs.add(line)
        return line;
    }
    function clearGraphs() {
        graphs.children.forEach(graph => {
            graph.geometry.dispose();
            graph.material.dispose();
        });
        graphs.clear();
    }
    function redrawGraph() {
        clearGraphs();
        const equations = eqInputList.querySelectorAll(".equation");
        equations.forEach(input => {
            const equation = input.value.trim();
            if (!equation) return;
            try {
                const segments = getPoints(equation);
                segments.forEach(segment => {
                    plotEquation(segment);
                })
            } catch (err) {
                console.log(err);
            }
        })
    }
    scene.add(graphs);
})