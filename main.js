import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GameBoard } from './game/GameBoard.js';
import { GamePiece } from './game/GamePiece.js';
import { Input } from './game/Input.js';
import { GameLoop } from './game/GameLoop.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

const gameBoard = new GameBoard();
gameBoard.addToScene(scene);
document.body.appendChild( renderer.domElement );


const controls = new OrbitControls( camera, renderer.domElement );
// const loader = new GLTFLoader();


const input = new Input(null);
const gameLoop = new GameLoop(scene, input, gameBoard);

camera.position.set(5, 15, 15);
controls.target.set(3, 10, 3);
controls.update();

function animate() {
    renderer.render( scene, camera );
    gameLoop.update();
}
renderer.setAnimationLoop( animate );
