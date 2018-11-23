// To actually be able to render graphics on the <canvas> element, first we have to grab a reference to it in JavaScript.
var canvas = document.getElementById("myCanvas");
// 2D rendering context, to paint to canvas
var ctx = canvas.getContext("2d");
var ballRadius = 10;
// define the position the circle is drawn at
var x = canvas.width/2;
var y = canvas.height-30;

// these control the speed of the game
var dx = 2;
var dy = -2;
// we need a paddle to hit the ball
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
// allow user to control the paddle
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;
var colorTurn = 0;
// form elements
var gameDifficulty = "easy";
var gameSize = "medium";
var ballColor = "#0095DD";
// Create a Boolean variable called paused and set it to true if the player presses p

var bricks = [];
var gameSize = document.getElementById("difficulty");
var gameSize = document.getElementById("size")
var userBallColor = document.getElementById("ballColor");
var brickColor = document.getElementById("brickColor");

for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.getElementById("submit").addEventListener("click", function(){
    updateGameSettings();
});

function updateGameSettings() {
    console.log("Updating game settings");
    // to change the difficulty of the game we'd update the speed value of the ball
    if (gameSize == "easy") {
        dx=2;
        dy=2;
    }
    else if (gameSize == "medium") {
        dx=10;
        dy=10;
    }
    else if (gameSize == "medium") {
        dx=16;
        dy=16;
    }
    dx = 10;
    dy = 10;
    document.getElementById("myCanvas").width = gameSize;
    // document.getElementById("myCanvas").style.height = "640";
}


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
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}  
function changeColor() {
    // change color
    ballColor = "#" + (Math.random()*0xFFFFFF<<0).toString(16);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}           
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}  
function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                // better understand this line!
                // this is finding the upper left corner of the brick
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                // ctx.beginPath();
                // Create gradient
                // console.log(brickX, 0, brickX+brickWidth,0);
                var grd = ctx.createLinearGradient(brickX, 0, brickX+brickWidth,0);
                grd.addColorStop(0,"green");
                grd.addColorStop(1,"blue");
                ctx.fillStyle = grd;
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
                // ctx.closePath();
            }
        }
    }
    
}
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}
// collision detection of bricks
function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score ++;
                    var colors = ["blue","purple","green", "orange"];
                    var color = colors[colorTurn];
                    drawBall(color);
                    colorTurn++;
                    if (colorTurn == colors.length-1) {
                        colorTurn = 0
                    }
                    if(score == brickRowCount*brickColumnCount) {
                        document.body.style.backgroundColor = "green";
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall()
    drawBricks();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    function togglePause() {
        if (!paused) {
            paused = true;
        } else if (paused) {
            paused = false;
        }
    }

    // collision detection + Game Over
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    }
    else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            document.getElementById("myCanvas").style.backgroundColor = "red";
            document.body.style.backgroundColor = "black";
            setTimeout(function () {
                    document.getElementById("myCanvas").style.backgroundColor = "#eee";
                    document.body.style.backgroundColor = "#eee";
            }, 1000);
            
            x = canvas.width/2;
            y = canvas.height-30;

            if(!lives) {
                alert("GAME OVER");
                x = canvas.width/2;
                y = canvas.height-30;
                document.location.reload();
            }
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }    
    x += dx;
    y += dy;    
    requestAnimationFrame(draw);        
}

// Randomly change ball color
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
draw();
// will execute color change every 1000 milliseconds
setInterval(changeColor, 1000);

// // red square
// ctx.beginPath();
// // x,y,w,h
// ctx.rect(200, 10, 50, 50);
// ctx.fillStyle = "#FF0000";
// ctx.fill();
// ctx.closePath();

// // draw green circle
// ctx.beginPath();
// // x,y,arc radius, direction of drawing(false for clockwise)
// ctx.arc(240, 160, 20, 0, Math.PI*2, false);
// ctx.fillStyle = "green";
// ctx.fill();
// ctx.closePath();

// // blue outline rectangle
// ctx.beginPath();
// ctx.rect(160, 80, 100, 40);
// ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
// ctx.stroke();
// ctx.closePath();