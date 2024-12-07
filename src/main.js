import * as THREE from 'three';

import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

THREE.Cache.enabled = true;

//Declare

let container;

let camera, cameraTarget, scene, renderer;

let group, textMesh1, textMesh2, textGeo, materials;

let firstLetter = true;

let text = 'three.js',

    bevelEnabled = true,

    font = undefined,

    fontName = 'optimer', // helvetiker, optimer, gentilis, droid sans, droid serif
    fontWeight = 'bold'; // normal bold

const depth = 20,
      size = 70,
      hover = 30,

      curveSegments = 4,

      bevelThickness = 2,
      bevelSize = 1.5;

const mirror = true;

const fontMap = {

    'helvetiker': 0,
    'optimer': 1,
    'gentilis': 2,
    'droid/droid_sans': 3,
    'droid/droid_serif': 4

};

const weightMap = {

    'regular': 0,
    'bold': 1

};

const reverseFontMap = [];
const reverseWeightMap = [];

for ( const i in fontMap ) reverseFontMap[ fontMap[ i ] ] = i;
for ( const i in weightMap ) reverseWeightMap[ weightMap[ i ] ] = i;

let targetRotation = 0;
let targetRotationOnPointerDown = 0;

let pointerX = 0;
let pointerXOnPointerDown = 0;

let windowHalfX = window.innerWidth / 2;

let fontIndex = 1;

init();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    //camera
    camera.position.set( 0, 400, 700 );
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    //Scene

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x000000 );
	scene.fog = new THREE.Fog( 0x000000, 250, 1400 );

    // LIGHTS

    const dirLight = new THREE.DirectionalLight( 0xffffff, 0.4 );
    dirLight.position.set( 0, 0, 1 ).normalize();
    scene.add( dirLight );

    const pointLight = new THREE.PointLight( 0xffffff, 4.5, 0, 0 );
    pointLight.color.setHSL( Math.random(), 1, 0.5 );
    pointLight.position.set( 0, 100, 90 );
    scene.add( pointLight );

    materials = [
        new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
        new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
    ];

    group = new THREE.Group();
    group.position.y = 100;

    scene.add( group );

    loadFont();

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry( 10000, 10000 ),
        new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, transparent: true } )
    );
    plane.position.y = 100;
    plane.rotation.x = - Math.PI / 2;
    scene.add( plane );

    //Renderer

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animate );
    document.body.appendChild( renderer.domElement );

    const geometry = new THREE.BoxGeometry( 10, 10, 0.1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    cube.rotation.x = 0.5;
}

function animate() {


	renderer.render( scene, camera );

}

//add mouse interaction
var mouseClick = false;
window.addEventListener('click', function(e) {

    mouseClick = true;

}, false);