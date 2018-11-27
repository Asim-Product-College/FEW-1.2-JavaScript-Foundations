/*
    The classes below define objects that make the game of breakout. 
    
    Most of the objects are displayed on the canvas at an x and y position. 
    The Sprite class owns these properties and the other classes gain these
    properties by extending Sprite. 
    All classes that draw something to the screen implement a render method. 
    This method takes a canvas context as a parameter and draws the object
    on to this context. 
    The Bricks class owns an array of Bricks which it renders by looping 
    through the array and calling render on each brick. 
    The label class holds a text string which is redners to the screen. 
    The GameLabel class extends Label to render a text string with a 
    value. This simplifies rendering the score and lives. 
    The Game class creates all of the objects and manages the game. 
    */

class Sprite {
    constructor() {
      this.x = 0
      this.y = 0
    }
  }

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

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

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

class Game {
    constructor() {
        this.canvas = document.getElementById("myCanvas");
        this.ctx = this.canvas.getContext("2d");
        // this takes the canvas object and if it has any of these properties(width, etc) we can now ref them as width, etc.. sike atually not use this.canvas.property
        // this is BLOCK scoped!
        const { width, height } = this.canvas;
        // instantiate games objects here!
        this.ball = new Ball(12, "#1C1C1C");
        // this.ball.x = width / 2
        // this.ball.y = height-30;
        // paddle bricks, etc.
        this.bricks = new Bricks();
        this.bricks.brickRowCount = 3;
        this.bricks.brickColumnCount = 5;
        this.bricks.brickWidth = 75;
        this.bricks.brickHeight = 20;
        this.bricks.brickPadding = 10;
        this.bricks.brickOffsetTop = 30;
        this.bricks.brickOffsetLeft = 30;
        this.bricks.bricks = [];
        for(let c = 0; c<this.bricks.brickColumnCount; c++) {
            this.bricks.bricks[c] = [];
            for(let r = 0; r<this.bricks.brickRowCount; r++) {
                this.bricks.bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }

        // this.bricks.bricks = [];
        // for(var c=0; c<this.bricks.brickColumnCount; c++) {
        //     this.bricks.bricksbricks[c] = [];
        //     for(var r=0; r<this.brickRowCount; r++) {
        //         this.bricks.bricksbricks[c][r] = { x: 0, y: 0 };
        //     }
        // }
        // es6 syntax to call draw one time to start the engine and do it over and over again.
        setInterval(() => {
            this.draw();
            // do other stuff
        }, 10);
    }

    draw() {
        // clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ball.moveBall();
        this.ball.drawBall(this.ctx);
        // this.paddle.drawPaddle(this.ctx, this.canvas.height);
        drawPaddle();
        this.bricks.drawBricks(ctx);
        // check for collisions
        this.checkForWallBallBounce();
        this.checkForPaddleMovement(); 
        this.checkForBricksCollision();          
    }

    checkForBricksCollision() {
        for(let c = 0; c < this.bricks.brickColumnCount; c++) {
            for(let r = 0; r < this.bricks.brickRowCount; r++) {
                let b = this.bricks.bricks[c][r];
                if(b.status == 1) {
                    if(this.ball.x > b.x && this.ball.x < b.x + this.bricks.brickWidth && this.ball.y > b.y && this.ball.y < b.y + this.bricks.brickHeight) {
                        this.ball.dy = -this.ball.dy;
                        b.status = 0;
                    }
                }
            }
        }
    }
    checkForWallBallBounce() {
        // 
        if (this.ball.x + this.ball.dx > this.canvas.width - this.ball.radius || this.ball.x + this.ball.dx < this.ball.radius) {
            this.ball.dx = -this.ball.dx;
        }
        if (this.ball.y + this.ball.dy < this.ball.radius) {
            this.ball.dy = -this.ball.dy;
        }
        else if (this.ball.y + this.ball.dy > canvas.height - this.ball.radius) {
            if(this.ball.x > paddleX && this.ball.x < paddleX + paddleWidth) {
                if(this.ball.x= this.ball.x-paddleHeight) {
                    this.ball.dy = -this.ball.dy;
                } else {
                alert("GAME OVER");
                document.location.reload();
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

class Ball extends Sprite {
    constructor(radius, color) {
        this.radius = radius;
        this.color = color;
        // dx & dy are basically the amount at which x and y will move at each frame.
        this.dx = 2;
        this.dy = -2;
        // this.x = 0;
        // this.y = 0;
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
class Bricks extends Sprite {
    constructor(brickRowCount, brickColumnCount, brickWidth, brickHeight,
                brickPadding, brickOffsetTop, brickOffsetLeft, bricks, brickX) {
        super()
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

game = new Game();