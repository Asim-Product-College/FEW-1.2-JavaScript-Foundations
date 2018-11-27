// Asim Zaidi

// giving up on this project for now - going to simply book a meeting with Dani and figure out hwo to 
// get particle js to work iwth nOde.

class ParticleJS {
    // constructor defines the canvas, ctx, width, height
    // instantiates other objects and on interval, draws.
    constructor() {
        this.canvas = document.getElementById("ballCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        const { width, height } = this.canvas;
        this.ball = new Ball();
        setInterval(() => {
            this.draw();
        }, 10);
    }

    // Draw method clears the ctx and draws the elements.
    // sets an x and y within the canvas and moves the ball, then draws.
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // settings these here so we balls generate at a new x and y each
        this.ball.moveBall();
        this.ball.drawBall(this.ctx);
    }
}

// Defines properties shared by all sprites
class Sprite extends ParticleJS {
    constructor() {
        this.x = Math.floor(Math.random() * super.canvas.width);
        this.y = Math.floor(Math.random() * super.canvas.height);
    }
}

class Ball extends Sprite {
    constructor() {
        super()
        this.radius = 15;
        // dx & dy are basically the amount at which x and y will move at each frame.
        this.dx = 2;
        this.dy = -2;

        // this.x = this.x;
        // this.y = this.y;
        this.colors = ["blue", "red", "green", "yellow", "purple", "orange"];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    };
    drawBall(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
        ctx.fill();
        ctx.closePath();
    }
    moveBall() {
        this.x += this.dx;
        this.y += this.dy;
    }
};

// create a func that instatiates ball objects for me and setting stuff for them.

// es6 syntax to call draw one time to start the engine and do it over and over again.

    // random x and y position
    // random moving direction
// call ball class 20 times


ParticleJS = new ParticleJS();