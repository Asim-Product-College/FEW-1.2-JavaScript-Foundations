// Some global variables to make things easier.
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;

// key function listeners
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Functions for when user presses keys to move paddle
function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

// function to draw that paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

class Ball {
    constructor(radius, color, x, y) {
        this.radius = radius;
        this.color = color;
        // dx & dy are basically the amount at which x and y will move at each frame.
        this.dx = 2;
        this.dy = -2;
        this.x = x;
        this.y = y;
    }
    drawBall(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
        ctx.fill();
        ctx.closePath();
    }
    moveBall() {
        this.x += this.dx;
        this.y += this.dy;
        // this.drawBall(ctx,x,y);
    }
}

// Defines a brick
class Bricks {
    constructor(brickRowCount, brickColumnCount, brickWidth, brickHeight,
                brickPadding, brickOffsetTop, brickOffsetLeft, bricks, brickX) {
        this.status = 1;
        this.brickRowCount = brickRowCount;
        this.brickColumnCount = brickColumnCount
        this.brickWidth = brickWidth
        this.brickHeight = brickHeight;
        this.brickPadding = brickPadding;
        this.brickOffsetTop = brickOffsetTop;
        this.brickOffsetLeft = brickOffsetLeft;
        this.bricks = bricks;
        this.brickX = 0;
        this.brickY = 0;
    }

    drawBricks(ctx) {

        for(let c = 0; c < this.brickColumnCount; c++) {
            // this.bricks[c] = [];
            for(let r = 0; r < this.brickRowCount; r++) {
                if(this.bricks[c][r].status == 1) {
                    this.brickX = (c*(this.brickWidth+this.brickPadding))+this.brickOffsetLeft;
                    this.brickY = (r*(this.brickHeight+this.brickPadding))+this.brickOffsetTop;                
                    this.bricks[c][r].x = this.brickX; //the coordinates of brick
                    this.bricks[c][r].y = this.brickY;

                    ctx.beginPath();
                    ctx.rect(this.brickX, this.brickY, this.brickWidth, this.brickHeight);
                    ctx.fillStyle = "#0095DD";
                    ctx.fill();
                    ctx.closePath();
                }
                // console.log("bricks c:", this.bricks[c][r].x);
                // console.log("bricks r:", this.bricks[c][r].y);
                // console.log("brickX:", this.brickX);
                // console.log("brickY:", this.brickY);
            }
        }
    }

}

// Game class that creates Ball object,
class Game {
    constructor() {
        // this takes the canvas object and if it has any of these properties(width, etc) we can now ref them as width, etc.. sike atually not use this.canvas.property
        // this is BLOCK scoped!
        const { width, height } = canvas;
        // instantiate ball object with ball radius, color, x and y.
        this.ball = new Ball(12, "#1C1C1C", width / 2, height-30);
        this.lives = 3
        this.score = 0

        // instantiate Bricks object
        this.bricks = new Bricks();
        // set brick properties
        this.bricks.brickRowCount = 3;
        this.bricks.brickColumnCount = 5;
        this.bricks.brickWidth = 75;
        this.bricks.brickHeight = 20;
        this.bricks.brickPadding = 10;
        this.bricks.brickOffsetTop = 30;
        this.bricks.brickOffsetLeft = 30;
        this.bricks.bricks = [];
        // for look to create the columns and rows of bricks
        for(let c = 0; c<this.bricks.brickColumnCount; c++) {
            this.bricks.bricks[c] = [];
            for(let r = 0; r<this.bricks.brickRowCount; r++) {
                this.bricks.bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }
        // es6 syntax to call draw one time to start the engine and do it over and over again.
        setInterval(() => {
            this.draw();
            // do other stuff
        }, 10);
        // this.draw()
    }
    // draw function draw ball and paddle
    draw() {
        // clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.ball.drawBall(ctx);
        drawPaddle();
        this.bricks.drawBricks(ctx);

        this.ball.moveBall();
        // check for collisions
        this.checkForWallBallBounce();
        this.checkForPaddleMovement();
        this.checkForBricksCollision();

        // requestAnimationFrame(this.update.bind(this))
    }
    
    // brick collision detection 
    checkForBricksCollision() {
        const {ball, bricks } = this
        for(let c = 0; c < bricks.brickColumnCount; c++) {
            for(let r = 0; r < bricks.brickRowCount; r++) {
                const brick = bricks.bricks[c][r];
                if(brick.status == 1) {
                    if(ball.x > brick.x && ball.x < brick.x + bricks.brickWidth && ball.y > brick.y && ball.y < brick.y + brick.brickHeight) {
                        ball.dy = -ball.dy;
                        brick.status = 0;
                        this.score += 1;
                        if (this.score == bricks.rows * bricks.cols) {
                            alert("YOU WIN, CONGRATULATIONS!");
                            document.location.reload();
                          }
                    }
                }
            }
        }
    }

    // wall bounce collision is broken from bottom and staggering on sides.
    checkForWallBallBounce() {
        const { ball, paddle } = this
        if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
            ball.dx = -ball.dx;
        }
        if (ball.y + ball.dy < ball.radius) {
            ball.dy = -ball.dy;
        }
        else if (ball.y + ball.dy > canvas.height - ball.radius) {
            if(ball.x > paddleX && ball.x < paddleX + paddleWidth) {
                if(ball.x= ball.x-paddleHeight) {
                    ball.dy = -ball.dy;
                } else {
                    lives--;
                    if (!this.lives) {
                        alert("GAME OVER!")
                    }
                    else {
                        ball.x = canvas.width/2;
                        ball.y = canvas.height-30;
                        ball.dx = 3;
                        ball.dy = -3;
                        paddleX = (canvas.width - paddleWidth) / 2;
                    }
                }
            }
        }
    }

    checkForPaddleMovement() {
        if(rightPressed && paddleX < canvas.width-paddleWidth) {
            paddleX += 7;
        }
        else if(leftPressed && paddleX > 0) {
            paddleX -= 7;
        }
    }
}

game = new Game();