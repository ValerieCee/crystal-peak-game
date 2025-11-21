//
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Sound effect placeholders
function playSoundCollect() {
    // TODO: Add collect sound effect
}

function playSoundJump() {
    // TODO: Add jump sound effect
}

function playSoundGameOver() {
    // TODO: Add game over sound effect
}

function playSoundRivalWin() {
    // TODO: Add rival win sound effect
}

// Game constants
const GRAVITY = 0.6;
const JUMP_STRENGTH = 12;
const PLAYER_SPEED = 5;
const GROUND_Y = 500;

// Game state
const game = {
    isRunning: true,
    frameCount: 0
};

// Player object
const player = {
    x: 150,
    y: GROUND_Y,
    width: 30,
    height: 40,
    velocityY: 0,
    velocityX: 0,
    isJumping: false,
    crystalsCollected: 0
};

// Rival object
const rival = {
    x: 850,
    y: GROUND_Y,
    width: 30,
    height: 40,
    velocityY: 0,
    velocityX: 0,
    isJumping: false,
    crystalsCollected: 0
};

// Yeti object
const yeti = {
    x: 500,
    y: GROUND_Y,
    width: 40,
    height: 50,
    velocityY: 0,
    velocityX: 2,
    speed: 2,
    direction: 1
};

// Crystals array
let crystals = [];

// Keyboard input
const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    if (e.key === 'ArrowUp' && !player.isJumping && player.y >= GROUND_Y) {
        player.velocityY = -JUMP_STRENGTH;
        player.isJumping = true;
        playSoundJump();
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Initialize crystals
function initializeCrystals() {
    crystals = [];
    const positions = [
        { x: 100, y: 300 },
        { x: 200, y: 250 },
        { x: 300, y: 200 },
        { x: 400, y: 150 },
        { x: 500, y: 200 },
        { x: 600, y: 250 },
        { x: 700, y: 300 },
        { x: 800, y: 350 },
        { x: 900, y: 300 }
    ];

    positions.forEach((pos, index) => {
        crystals.push({
            x: pos.x,
            y: pos.y,
            size: 12,
            collected: false,
            id: index
        });
    });
}

// Draw functions
function drawRectangle(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawDiamond(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x, y + size);
    ctx.lineTo(x - size, y);
    ctx.closePath();
    ctx.fill();
}

function drawPlayer(p, color) {
    // Body
    drawRectangle(p.x - p.width / 2, p.y - p.height / 2, p.width, p.height * 0.6, color);
    // Head
    drawCircle(p.x, p.y - p.height / 2 - p.height * 0.25, p.width * 0.4, color);
    // Legs
    drawRectangle(p.x - p.width * 0.15, p.y + p.height * 0.1, p.width * 0.15, p.height * 0.3, color);
    drawRectangle(p.x + p.width * 0.05, p.y + p.height * 0.1, p.width * 0.15, p.height * 0.3, color);
}

function drawYeti(y) {
    // Head
    drawCircle(y.x, y.y - y.height * 0.4, y.width * 0.4, '#E8E8E8');
    // Body
    drawRectangle(y.x - y.width * 0.35, y.y - y.height * 0.2, y.width * 0.7, y.height * 0.5, '#E8E8E8');
    // Legs
    drawRectangle(y.x - y.width * 0.2, y.y + y.height * 0.3, y.width * 0.15, y.height * 0.35, '#D0D0D0');
    drawRectangle(y.x + y.width * 0.05, y.y + y.height * 0.3, y.width * 0.15, y.height * 0.35, '#D0D0D0');
}

function drawGround() {
    drawRectangle(0, GROUND_Y + 50, canvas.width, canvas.height - GROUND_Y - 50, '#8B7355');
}

function drawCrystals() {
    crystals.forEach((crystal) => {
        if (!crystal.collected) {
            drawDiamond(crystal.x, crystal.y, crystal.size, '#00FFFF');
            // Outline
            ctx.strokeStyle = '#0099FF';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(crystal.x, crystal.y - crystal.size);
            ctx.lineTo(crystal.x + crystal.size, crystal.y);
            ctx.lineTo(crystal.x, crystal.y + crystal.size);
            ctx.lineTo(crystal.x - crystal.size, crystal.y);
            ctx.closePath();
            ctx.stroke();
        }
    });
}

// Update functions
function updatePhysics(obj) {
    obj.velocityY += GRAVITY;
    obj.y += obj.velocityY;

    if (obj.y >= GROUND_Y) {
        obj.y = GROUND_Y;
        obj.velocityY = 0;
        if (obj === player) {
            player.isJumping = false;
        }
    }
}

function updatePlayerInput() {
    if (keys['ArrowLeft'] || keys['a']) {
        player.x -= PLAYER_SPEED;
    }
    if (keys['ArrowRight'] || keys['d']) {
        player.x += PLAYER_SPEED;
    }

    player.x = Math.max(player.width / 2, Math.min(canvas.width - player.width / 2, player.x));
}

function updateRivalAI() {
    const unCollectedCrystal = crystals.find((c) => !c.collected);

    if (unCollectedCrystal) {
        const dx = unCollectedCrystal.x - rival.x;
        const distance = Math.abs(dx);

        if (distance > 5) {
            rival.x += dx > 0 ? PLAYER_SPEED * 0.7 : -PLAYER_SPEED * 0.7;
        }

        // Random jump
        if (Math.random() < 0.02 && !rival.isJumping && rival.y >= GROUND_Y) {
            rival.velocityY = -JUMP_STRENGTH;
            rival.isJumping = true;
        }
    }

    rival.x = Math.max(rival.width / 2, Math.min(canvas.width - rival.width / 2, rival.x));
}

function updateYetiAI() {
    yeti.x += yeti.direction * yeti.speed;

    if (yeti.x <= yeti.width / 2 || yeti.x >= canvas.width - yeti.width / 2) {
        yeti.direction *= -1;
    }

    // Chase player if close
    const distToPlayer = Math.abs(yeti.x - player.x);
    if (distToPlayer < 200) {
        yeti.direction = player.x > yeti.x ? 1 : -1;
        yeti.speed = 3;
    } else {
        yeti.speed = 2;
    }
}

function checkCrystalCollection() {
    crystals.forEach((crystal) => {
        if (crystal.collected) return;

        // Check player
        const distPlayer = Math.hypot(player.x - crystal.x, player.y - crystal.y);
        if (distPlayer < 30) {
            crystal.collected = true;
            player.crystalsCollected++;
            playSoundCollect();
        }

        // Check rival
        const distRival = Math.hypot(rival.x - crystal.x, rival.y - crystal.y);
        if (distRival < 30) {
            crystal.collected = true;
            rival.crystalsCollected++;
            playSoundCollect();
        }
    });
}

function checkCollisions() {
    // Check if yeti touched player
    const yetiDistToPlayer = Math.hypot(yeti.x - player.x, yeti.y - player.y);
    if (yetiDistToPlayer < 35) {
        return 'yeti';
    }

    // Check if rival collected all crystals
    if (rival.crystalsCollected >= crystals.length && crystals.length > 0) {
        return 'rival';
    }

    // Check if player collected all crystals
    if (player.crystalsCollected >= crystals.length && crystals.length > 0) {
        return 'player';
    }

    return null;
}

function updateUI() {
    document.getElementById('playerScore').textContent = player.crystalsCollected;
    document.getElementById('rivalScore').textContent = rival.crystalsCollected;
    const remaining = crystals.filter((c) => !c.collected).length;
    document.getElementById('crystalsLeft').textContent = remaining;
}

function endGame(result) {
    game.isRunning = false;
    playSoundGameOver();

    const gameOverScreen = document.getElementById('gameOverScreen');
    const gameOverTitle = document.getElementById('gameOverTitle');
    const gameOverMessage = document.getElementById('gameOverMessage');

    if (result === 'yeti') {
        gameOverTitle.textContent = '💀 Game Over!';
        gameOverMessage.textContent = `The Yeti caught you!\n\nYou collected: ${player.crystalsCollected} crystals\nRival collected: ${rival.crystalsCollected} crystals`;
    } else if (result === 'rival') {
        gameOverTitle.textContent = '😞 Rival Wins!';
        gameOverMessage.textContent = `Your rival collected all the crystals first!\n\nYou collected: ${player.crystalsCollected} crystals\nRival collected: ${rival.crystalsCollected} crystals`;
        playSoundRivalWin();
    } else if (result === 'player') {
        gameOverTitle.textContent = '🎉 You Win!';
        gameOverMessage.textContent = `You collected all the crystals!\n\nYou collected: ${player.crystalsCollected} crystals\nRival collected: ${rival.crystalsCollected} crystals`;
    }

    gameOverScreen.classList.remove('hidden');
}

// Main game loop
function gameLoop() {
    // Clear canvas
    ctx.fillStyle = 'rgba(135, 206, 235, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (game.isRunning) {
        // Update
        updatePlayerInput();
        updatePhysics(player);
        updatePhysics(rival);
        updateRivalAI();
        updateYetiAI();
        checkCrystalCollection();

        // Check win/lose conditions
        const result = checkCollisions();
        if (result) {
            endGame(result);
        }

        // Update UI
        updateUI();
    }

    // Draw
    drawGround();
    drawCrystals();
    drawPlayer(player, '#0066FF');
    drawPlayer(rival, '#000000');
    drawYeti(yeti);

    game.frameCount++;
    requestAnimationFrame(gameLoop);
}

// Start game
initializeCrystals();
gameLoop();