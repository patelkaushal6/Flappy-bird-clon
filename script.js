
document.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  const startScreen = document.getElementById('start-screen');
  const gameOverScreen = document.getElementById('game-over-screen');
  const startButton = document.getElementById('start-button');
  const restartButton = document.getElementById('restart-button');
  const finalScoreElement = document.getElementById('final-score');
  const colorPicker = document.getElementById('color-picker');

  let birdColor = colorPicker.value;
  colorPicker.addEventListener('input', (e) => birdColor = e.target.value);

  let gameStarted = false;
  let gameOver = false;
  let score = 0;
  let frames = 0;

  const bird = { x: 50, y: 150, width: 34, height: 24, gravity: 0.5, velocity: 0, jump: -7 };
  const pipes = { position: [], top: { width: 52, height: 320 }, bottom: { width: 52, height: 320 }, gap: 220, maxYPos: -120, dx: 2 };
  const ground = { x: 0, y: canvas.height - 112, width: canvas.width, height: 112, dx: 2 };

  function drawBird() {
    ctx.fillStyle = birdColor;
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(bird.x + 25, bird.y + 10, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FF6B6B";
    ctx.beginPath();
    ctx.moveTo(bird.x + 34, bird.y + 12);
    ctx.lineTo(bird.x + 45, bird.y + 12);
    ctx.lineTo(bird.x + 34, bird.y + 20);
    ctx.fill();
  }

  function drawBackground() {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#DED895";
    ctx.fillRect(ground.x, ground.y, ground.width, ground.height);
    ctx.fillStyle = "#5EAA15";
    ctx.fillRect(ground.x, ground.y, ground.width, 20);
  }

  function drawPipes() {
    for (let i = 0; i < pipes.position.length; i++) {
      let p = pipes.position[i];
      ctx.fillStyle = "#73BF2E";
      ctx.fillRect(p.x, p.y, pipes.top.width, pipes.top.height);
      ctx.fillRect(p.x, p.y + pipes.top.height + pipes.gap, pipes.bottom.width, pipes.bottom.height);
      ctx.fillStyle = "#5EAA15";
      ctx.fillRect(p.x - 2, p.y + pipes.top.height - 20, pipes.top.width + 4, 20);
      ctx.fillRect(p.x - 2, p.y + pipes.top.height + pipes.gap, pipes.bottom.width + 4, 20);
    }
  }

  function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText(score, canvas.width / 2 - 15, 50);
  }

  function update() {
    if (gameStarted && !gameOver) {
      bird.velocity += bird.gravity;
      bird.y += bird.velocity;

      if (bird.y + bird.height >= canvas.height - ground.height) {
        gameOver = true;
        bird.y = canvas.height - ground.height - bird.height;
      }

      if (bird.y <= 0) {
        bird.y = 0;
        bird.velocity = 0;
      }

      if (frames % 100 === 0) {
        pipes.position.push({ x: canvas.width, y: Math.floor(Math.random() * pipes.maxYPos) - pipes.maxYPos });
      }

      for (let i = 0; i < pipes.position.length; i++) {
        let p = pipes.position[i];
        p.x -= pipes.dx;

        if (p.x + pipes.top.width <= 0) {
          pipes.position.shift();
          score++;
        }

        if (bird.x + bird.width > p.x && bird.x < p.x + pipes.top.width && 
            (bird.y < p.y + pipes.top.height || bird.y + bird.height > p.y + pipes.top.height + pipes.gap)) {
          gameOver = true;
        }
      }
      frames++;
    }

    if (gameOver) {
      finalScoreElement.textContent = score;
      gameOverScreen.style.display = 'flex';
    }
  }

  function draw() {
    drawBackground();
    drawPipes();
    drawBird();
    drawScore();
  }

  function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }

  function jump() {
    if (!gameOver) bird.velocity = bird.jump;
  }

  canvas.addEventListener('click', () => (!gameStarted ? startGame() : jump()));
  document.addEventListener('keydown', (e) => (e.code === 'Space' && (!gameStarted ? startGame() : jump())));
  startButton.addEventListener('click', startGame);
  restartButton.addEventListener('click', resetGame);

  function startGame() {
    gameStarted = true;
    startScreen.style.display = 'none';
    document.getElementById('bg-music').play().catch(() => {});
  }

  function resetGame() {
    gameStarted = true;
    gameOver = false;
    score = 0;
    frames = 0;
    bird.y = 150;
    bird.velocity = 0;
    pipes.position = [];
    gameOverScreen.style.display = 'none';
  }

  gameLoop();
});
