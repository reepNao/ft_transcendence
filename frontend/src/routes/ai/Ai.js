import { navigateTo } from "../../utils/navTo.js";

export async function fetchAi() {
    if (!localStorage.getItem("access_token")) {
        console.log("No access token found");
        navigateTo("/login");
    } else {
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const scoreBoard = document.getElementById('scoreBoard');
        const startButton = document.getElementById('startButton');

        const paddleHeight = 100;
        const paddleWidth = 10;
        const ballSize = 10;

        let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
        let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
        let ballX = canvas.width / 2;
        let ballY = canvas.height / 2;
        let ballSpeedX = 5;
        let ballSpeedY = 5;

        let leftScore = 0;
        let rightScore = 0;

        let gameRunning = false;

        function drawRect(x, y, width, height, color) {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, width, height);
        }

        function drawCircle(x, y, radius, color) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2, false);
            ctx.fill();
        }

        function drawNet() {
            for (let i = 0; i < canvas.height; i += 40) {
                drawRect(canvas.width / 2 - 1, i, 2, 20, '#fff');
            }
        }

        function draw() {
            // Clear canvas
            drawRect(0, 0, canvas.width, canvas.height, '#000');

            // Draw paddles
            drawRect(0, leftPaddleY, paddleWidth, paddleHeight, '#fff');
            drawRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight, '#fff');

            // Draw ball
            drawCircle(ballX, ballY, ballSize, '#fff');

            // Draw net
            drawNet();
        }

        function update() {
            // Move ball
            ballX += ballSpeedX;
            ballY += ballSpeedY;

            // Ball collision with top and bottom walls
            if (ballY - ballSize < 0 || ballY + ballSize > canvas.height) {
                ballSpeedY = -ballSpeedY * 1.05;
            }

            // Ball collision with paddles
            if (
                (ballX - ballSize < paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) ||
                (ballX + ballSize > canvas.width - paddleWidth && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight)
            ) {
                ballSpeedX = -ballSpeedX * 1.05;
            }

            // Score points
            if (ballX < 0) {
                rightScore++;
                resetBall();
            } else if (ballX > canvas.width) {
                leftScore++;
                resetBall();
            }

            // Update score display
            scoreBoard.textContent = `Player 1: ${leftScore} | AI: ${rightScore}`;

            // Check for game over
            if (leftScore === 5 || rightScore === 5) {
                const winner = leftScore === 5 ? "Player 1" : "AI";
                alert(`Game Over! ${winner} wins!`);
                leftScore = 0;
                rightScore = 0;
                gameRunning = false;
                startButton.style.display = 'block';
                navigateTo("/ai");
            }
        }

        function resetBall() {
                ballX = canvas.width / 2;
                ballY = canvas.height / 2;
                ballSpeedX = -ballSpeedX;
                ballSpeedY = Math.random() > 0.5 ? 5 : -5;
        }


        function gameLoop() {
            if (gameRunning) {
                handleInput();
                update();
                draw();
                requestAnimationFrame(gameLoop);
            }
        }

        // Keyboard controls
        const keys = {};

        document.addEventListener('keydown', (e) => {
            keys[e.key] = true;
        });

        document.addEventListener('keyup', (e) => {
            keys[e.key] = false;
        });

        function handleInput() {
            // Left paddle
            if (keys['w'] && leftPaddleY > 0) {
                leftPaddleY -= 5;
            }
            if (keys['s'] && leftPaddleY < canvas.height - paddleHeight) {
                leftPaddleY += 5;
            }

            // AI controlled right paddle
            const aiSpeed = 5 + Math.random() * 2; // AI speed varies between 3 and 5
            if (rightPaddleY + paddleHeight / 2 < ballY) {
                rightPaddleY += aiSpeed;
            } else if (rightPaddleY + paddleHeight / 2 > ballY) {
                rightPaddleY -= aiSpeed;
            }

            // Ensure AI paddle stays within canvas bounds
            if (rightPaddleY < 0) {
                rightPaddleY = 0;
            } else if (rightPaddleY > canvas.height - paddleHeight) {
                rightPaddleY = canvas.height - paddleHeight;
            }
        }

        startButton.addEventListener('click', () => {
            if (!gameRunning) {
                gameRunning = true;
                leftScore = 0;
                rightScore = 0;
                startButton.style.display = 'none';
                scoreBoard.textContent = `Player 1: ${leftScore} | AI: ${rightScore}`;
                resetBall();
                gameLoop();
            }
        });

        draw();
    }
}

