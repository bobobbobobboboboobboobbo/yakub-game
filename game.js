const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const player = new Player();
const gDroid = new GeorgeDroid();
const kirk = new Kirkinator();

let gameState = "REACTOR"; // REACTOR, BOSS, MINIONS, COLLECTION, YAKUB, WIN

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function update() {
    if (gameState === "REACTOR") {
        document.getElementById('objective').innerText = "Disable the Fent Reactor (Click it!)";
        // Logic to reach reactor
    } else if (gameState === "BOSS") {
        document.getElementById('objective').innerText = "Defeat George Droid";
        if (gDroid.hp <= 0) gameState = "MINIONS";
    } else if (gameState === "COLLECTION") {
        document.getElementById('objective').innerText = "Collect White Monsters for Yakub";
        if (player.monstersCollected >= 10) gameState = "YAKUB";
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Reactor
    if (gameState === "REACTOR") {
        ctx.fillStyle = "cyan";
        ctx.fillRect(700, 250, 50, 100); // The Fent Reactor
        ctx.fillText("FENT REACTOR", 690, 240);
    }

    // Draw George Droid
    if (gameState === "BOSS" || (gameState === "REACTOR" && !player.hasDisabledReactor)) {
        ctx.fillStyle = "red";
        ctx.fillRect(gDroid.x, gDroid.y, 60, 80);
        ctx.fillText("GEORGE DROID", gDroid.x, gDroid.y - 10);
    }

    // Draw Kirkinator (Ally)
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x - 40, player.y, 40, 60);
    ctx.fillText("KIRKINATOR", player.x - 50, player.y - 10);

    // Draw Player
    ctx.fillStyle = "white";
    ctx.fillRect(player.x, player.y, 30, 30);
}

// Interaction Logic
canvas.addEventListener('click', (e) => {
    if (gameState === "REACTOR") {
        // Simple click detection for reactor
        player.hasDisabledReactor = true;
        gameState = "BOSS";
        alert("Fent Reactor Disabled! George Droid is weakening!");
    }
    
    if (gameState === "BOSS") {
        gDroid.hp -= 50;
    }

    if (gameState === "YAKUB") {
        startYakubDialogue();
    }
});

function startYakubDialogue() {
    const box = document.getElementById('dialogue-box');
    const text = document.getElementById('dialogue-text');
    const options = document.getElementById('dialogue-options');
    
    box.classList.remove('hidden');
    text.innerText = "Yakub: Why should I let you into Agartha with those White Monsters?";
    
    options.innerHTML = `
        <button onclick="checkTrick(true)">Tell him they are the elixir of life</button>
        <button onclick="checkTrick(false)">Tell him you stole them</button>
    `;
}

function checkTrick(success) {
    if (success) {
        alert("Yakub: Impressive. Your Tricknology is strong. Welcome to Agartha.");
        gameState = "WIN";
        document.body.innerHTML = "<h1>YOU HAVE ASCENDED TO AGARTHA</h1>";
    } else {
        alert("Yakub: You have failed the experiment.");
        location.reload();
    }
}

gameLoop();
