// Game Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

// Game Objects
const paddleWidth = 10;
const paddleHeight = 80;
const ballSize = 8;

let player = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 6
};

let ai = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 4.5
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: ballSize,
    dx: 5,
    dy: 5,
    speed: 5
};

let score = {
    player: 0,
    ai: 0
};

// Input handling
const keys = {};
let mouseY = canvas.height / 2;

window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Update player paddle position
function updatePlayer() {
    // Keyboard input
    if (keys['ArrowUp'] || keys['w'] || keys['W']) {
        player.y -= player.speed;
    }
    if (keys['ArrowDown'] || keys['s'] || keys['S']) {
        player.y += player.speed;
    }

    // Mouse input
    const mouseMargin = 40;
    if (mouseY > player.y + paddleHeight / 2 + mouseMargin) {
        player.y += player.speed;
    } else if (mouseY < player.y + paddleHeight / 2 - mouseMargin) {
        player.y -= player.speed;
    }

    // Boundary checking
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }
}

// Update AI paddle position
function updateAI() {
    const aiCenter = ai.y + ai.height / 2;
    const ballCenter = ball.y;

    if (ballCenter < aiCenter - 35) {
        ai.y -= ai.speed;
    } else if (ballCenter > aiCenter + 35) {
        ai.y += ai.speed;
    }

    // Boundary checking
    if (ai.y < 0) ai.y = 0;
    if (ai.y + ai.height > canvas.height) {
        ai.y = canvas.height - ai.height;
    }
}

// Update ball position
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision (top and bottom)
    if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height) {
        ball.dy = -ball.dy;
        ball.y = ball.y - ball.size < 0 ? ball.size : canvas.height - ball.size;
    }

    // Paddle collision detection
    if (
        ball.x - ball.size < player.x + player.width &&
        ball.y > player.y &&
        ball.y < player.y + player.height
    ) {
        ball.dx = -ball.dx;
        ball.x = player.x + player.width + ball.size;

        // Add spin based on paddle hit location
        const hitPos = (ball.y - (player.y + player.height / 2)) / (player.height / 2);
        ball.dy += hitPos * 3;
    }

    if (
        ball.x + ball.size > ai.x &&
        ball.y > ai.y &&
        ball.y < ai.y + ai.height
    ) {
        ball.dx = -ball.dx;
        ball.x = ai.x - ball.size;

        // Add spin based on paddle hit location
        const hitPos = (ball.y - (ai.y + ai.height / 2)) / (ai.height / 2);
        ball.dy += hitPos * 3;
    }

    // Scoring
    if (ball.x < 0) {
        score.ai++;
        resetBall();
    }
    if (ball.x > canvas.width) {
        score.player++;
        resetBall();
    }

    // Update score display
    document.getElementById('playerScore').textContent = score.player;
    document.getElementById('aiScore').textContent = score.ai;
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.dy = (Math.random() - 0.5) * ball.speed;
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

function drawCenterLine() {
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
    ctx.setLineDash([10, 10]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw center line
    drawCenterLine();

    // Draw paddles
    drawRectangle(player.x, player.y, player.width, player.height, '#00ff88');
    drawRectangle(ai.x, ai.y, ai.width, ai.height, '#ff0055');

    // Draw ball
    drawCircle(ball.x, ball.y, ball.size, '#00ff88');
}

// Game loop
function gameLoop() {
    updatePlayer();
    updateAI();
    updateBall();
    draw();
    requestAnimationFrame(gameLoop);
}

// Reset game
document.getElementById('resetBtn').addEventListener('click', () => {
    score.player = 0;
    score.ai = 0;
    document.getElementById('playerScore').textContent = 0;
    document.getElementById('aiScore').textContent = 0;
    resetBall();
});

// Start game
gameLoop();
