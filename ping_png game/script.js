let board;
let boardwidth = window.innerWidth < 600 ? window.innerWidth * 0.9 : 500;
let boardheight = boardwidth;
let context;

const scoreLimit = 2; // Define the score limit

// Player settings
let playerwidth = 10;
let playerheight = boardheight / 10;
let playervelocityY = 0;

// Player 1
let player1 = {
    x: 10,
    y: boardheight / 2 - playerheight / 2,
    width: playerwidth,
    height: playerheight,
    VelocityY: playervelocityY
}

// Player 2
let player2 = {
    x: boardwidth - playerwidth - 10,
    y: boardheight / 2 - playerheight / 2,
    width: playerwidth,
    height: playerheight,
    VelocityY: playervelocityY
}

// Ball settings
let ballwidth = boardwidth / 50;
let ballheight = ballwidth;
let ball = {
    x: boardwidth / 2 - ballwidth / 2,
    y: boardheight / 2 - ballheight / 2,
    width: ballwidth,
    height: ballheight,
    VelocityX: 1,
    VelocityY: 2
}

// Scores
let player1score = 0;
let player2score = 0;

let gameOver = false; // To check if the game has ended

// Start game when the button is clicked
document.getElementById("startButton").addEventListener("click", function() {
    // Hide the start button
    this.style.display = "none";

    // Show the game board
    document.getElementById("board").style.display = "block";

    // Initialize the game
    startGame();
});

function startGame() {
    board = document.getElementById("board");
    board.height = boardheight;
    board.width = boardwidth;
    context = board.getContext("2d");

    // Draw initial players
    context.fillStyle = "skyblue";
    context.fillRect(player1.x, player1.y, player1.width, player1.height);
    context.fillRect(player2.x, player2.y, player2.width, player2.height);

    requestAnimationFrame(update);
    document.addEventListener("keyup", moveplayer);
}

function update() {
    if (gameOver) return; // Stop the game if gameOver is true

    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    // Draw player 1
    let nextplayer1y = player1.y + player1.VelocityY;
    if (!outofbound(nextplayer1y)) {
        player1.y = nextplayer1y;
    }
    context.fillStyle = "skyblue";
    context.fillRect(player1.x, player1.y, player1.width, player1.height);

    // Draw player 2
    let nextplayer2y = player2.y + player2.VelocityY;
    if (!outofbound(nextplayer2y)) {
        player2.y = nextplayer2y;
    }
    context.fillRect(player2.x, player2.y, player2.width, player2.height);

    // Ball movement
    context.fillStyle = "white";
    ball.x += ball.VelocityX;
    ball.y += ball.VelocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    // Ball collision with top and bottom boundaries
    if (ball.y <= 0 || ball.y + ball.height >= boardheight) {
        ball.VelocityY *= -1;
    }

    // Ball collision with paddles
    if (detectcollision(ball, player1)) {
        if (ball.x <= player1.x + player1.width) {
            ball.VelocityX *= -1;
        }
    } else if (detectcollision(ball, player2)) {
        if (ball.x + ballwidth >= player2.x) {
            ball.VelocityX *= -1;
        }
    }

    // Check if the ball leaves the screen (player scores)
    if (ball.x < 0) {
        player2score++;
        checkForWinner(); // Check for a winner after scoring
        resetgame(1);
    } else if (ball.x + ballwidth > boardwidth) {
        player1score++;
        checkForWinner(); // Check for a winner after scoring
        resetgame(-1);
    }

    // Display score
    context.font = "45px sans-serif";
    context.fillText(player1score, boardwidth / 5, 45);
    context.fillText(player2score, boardwidth * 4 / 5 - 45, 45);

    // Draw dotted center line
    for (let i = 0; i < board.height; i += 25) {
        context.fillRect(board.width / 2 - 10, i, 5, 5);
    }
}

// Function to check if a player has won
function checkForWinner() {
    if (player1score >= scoreLimit) {
        gameOver = true;
        displayWinner("Player 1");
    } else if (player2score >= scoreLimit) {
        gameOver = true;
        displayWinner("Player 2");
    }
}

// Function to display the winner
function displayWinner(winner) {
    // Clear the board and display the winner
    context.clearRect(0, 0, board.width, board.height);
    context.font = "50px sans-serif";
    context.fillStyle = "white";
    context.fillText(`${winner} Wins!`, boardwidth / 4, boardheight / 2);
}

// Out of bounds check
function outofbound(yposition) {
    return (yposition < 0 || yposition + playerheight > boardheight);
}

// Player movement
function moveplayer(e) {
    // Player 1 controls
    if (e.code == "KeyW") {
        player1.VelocityY = -2;
    } else if (e.code == "KeyS") {
        player1.VelocityY = 2;
    }

    // Player 2 controls
    if (e.code == "ArrowUp") {
        player2.VelocityY = -2;
    } else if (e.code == "ArrowDown") {
        player2.VelocityY = 2;
    }
}

// Collision detection
function detectcollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

// Reset game after a score
function resetgame(direction) {
    // Reset ball position and velocity
    ball = {
        x: boardwidth / 2 - ballwidth / 2,
        y: boardheight / 2 - ballheight / 2,
        width: ballwidth,
        height: ballheight,
        VelocityX: direction * 1, // Direction will be -1 or 1 based on who scored
        VelocityY: 2
    }
}