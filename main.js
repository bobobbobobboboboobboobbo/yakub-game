import * as THREE from 'three';

let scene, camera, renderer, controls;
let gameState = "REACTOR"; // REACTOR -> GEORGE -> MINIONS -> COLLECTION -> YAKUB
let monstersCollected = 0;

// Game Objects
let fentReactor, georgeDroid, kirkinator, yakub;
let bullets = [];
let minions = [];

init();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    scene.fog = new THREE.FogExp2(0x000000, 0.05);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const light = new THREE.PointLight(0x00ff00, 10, 100);
    light.position.set(0, 10, 0);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    setupWorld();
    setupPlayerControls();
    animate();
}

function setupWorld() {
    // Floor
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        new THREE.MeshStandardMaterial({ color: 0x111111 })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // General Kirkinator (Ally NPC)
    const kirkGeo = new THREE.BoxGeometry(1, 2, 1);
    const kirkMat = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    kirkinator = new THREE.Mesh(kirkGeo, kirkMat);
    kirkinator.position.set(-5, 1, -5);
    scene.add(kirkinator);

    // Fent Reactor (Target 1)
    fentReactor = new THREE.Mesh(
        new THREE.BoxGeometry(2, 4, 2),
        new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff })
    );
    fentReactor.position.set(0, 2, -20);
    scene.add(fentReactor);

    // George Droid (Boss - Hidden initially)
    georgeDroid = new THREE.Mesh(
        new THREE.SphereGeometry(2),
        new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
    georgeDroid.position.set(0, 10, -30);
    georgeDroid.visible = false;
    scene.add(georgeDroid);
}

function setupPlayerControls() {
    // Basic movement logic
    const move = { fwd: false, bwd: false, lft: false, rgt: false };
    document.addEventListener('keydown', (e) => {
        if(e.code === 'KeyW') move.fwd = true;
        if(e.code === 'KeyS') move.bwd = true;
        if(e.code === 'KeyA') move.lft = true;
        if(e.code === 'KeyD') move.rgt = true;
    });
    document.addEventListener('keyup', (e) => {
        if(e.code === 'KeyW') move.fwd = false;
        if(e.code === 'KeyS') move.bwd = false;
        if(e.code === 'KeyA') move.lft = false;
        if(e.code === 'KeyD') move.rgt = false;
    });

    document.getElementById('instructions').addEventListener('click', () => {
        document.body.requestPointerLock();
        document.getElementById('instructions').classList.add('hidden');
    });

    // Mouse look
    document.addEventListener('mousemove', (e) => {
        if (document.pointerLockElement) {
            camera.rotation.y -= e.movementX * 0.002;
        }
    });

    // Shooting
    document.addEventListener('mousedown', shoot);
}

function shoot() {
    const bullet = new THREE.Mesh(
        new THREE.SphereGeometry(0.1),
        new THREE.MeshBasicMaterial({ color: 0xffff00 })
    );
    bullet.position.copy(camera.position);
    const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    bullet.userData.velocity = direction.multiplyScalar(0.5);
    scene.add(bullet);
    bullets.push(bullet);

    // Collision Logic simplified
    if (gameState === "REACTOR" && bullet.position.distanceTo(fentReactor.position) < 15) {
        destroyReactor();
    }
}

function destroyReactor() {
    scene.remove(fentReactor);
    gameState = "GEORGE";
    georgeDroid.visible = true;
    document.getElementById('objective').innerText = "Objective: Defeat George Droid";
}

function animate() {
    requestAnimationFrame(animate);
    
    // Move bullets
    bullets.forEach((b, i) => {
        b.position.add(b.userData.velocity);
        if(b.position.length() > 100) {
            scene.remove(b);
            bullets.splice(i, 1);
        }
    });

    renderer.render(scene, camera);
}
