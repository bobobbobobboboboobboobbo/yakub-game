function spawnWhiteMonsters() {
    for(let i=0; i<10; i++) {
        const can = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.2, 0.5),
            new THREE.MeshStandardMaterial({ color: 0xffffff }) // White Monster Can
        );
        can.position.set(Math.random()*40-20, 0.5, Math.random()*40-20);
        can.name = "white_monster";
        scene.add(can);
    }
}

// Check for collection (Run this in the animate loop)
function checkCollection() {
    scene.children.forEach(obj => {
        if(obj.name === "white_monster") {
            if(camera.position.distanceTo(obj.position) < 2) {
                scene.remove(obj);
                monstersCollected++;
                document.getElementById('inventory').innerText = `White Monsters: ${monstersCollected}/10`;
                if(monstersCollected >= 10) triggerYakub();
            }
        }
    });
}

function triggerYakub() {
    gameState = "YAKUB";
    document.exitPointerLock();
    document.getElementById('yakub-overlay').classList.remove('hidden');
}

// Window global for the HTML button
window.tryTrick = function() {
    alert("Yakub: 'The fizz is eternal. You may enter Agartha.'");
    window.location.reload(); // Game Win Reset
}
