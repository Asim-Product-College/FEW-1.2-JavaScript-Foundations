import { Scene } from 'phaser';

class MyScene extends Scene {
    constructor() {
        super()
        this.score = 0
        
    }
    
    preload () {
    // first param aka asset key is a link to the loaded asset and is what you'll use in your code when creating Game Objects.
    // This will load in 5 assets: 4 images and a sprite sheet.
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude', 
            'assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    create () {
        this.add.image(400, 300, 'sky');
        
        // new Static Physics Group
        // In Arcade Physics there are two types of physics bodies: Dynamic and Static. A dynamic body is one that can move around via forces such as velocity or acceleration. It can bounce and collide with other objects and that collision is influenced by the mass of the body and other elements.
        // In stark contrast, a Static Body simply has a position and a size. It isn't touched by gravity, you cannot set velocity on it and when something collides with it, it never moves. Static by name, static by nature. And perfect for the ground and platforms that we're going to let the player run around on.
        // But what is a Group? As their name implies they are ways for you to group together similar objects and control them all as one single unit. You can also check for collision between Groups and other game objects. Groups are capable of creating their own Game Objects via handy helper functions like create. A Physics Group will automatically create physics enabled children, saving you some leg-work in the process.
        this.platforms = this.physics.add.staticGroup();
    
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');
    
        // add signifies that this is a Dynamic physics body
        this.player = this.physics.add.sprite(100, 450, 'dude');
    
        // slight bounce value of 0.2.
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });
        
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    
        this.cursors = this.input.keyboard.createCursorKeys();
    
        this.bombs = this.physics.add.group();
    
        // configuration object has 3 parts
        // texture key to be the star image
        // sets the repeat value to be 11.
        // set x and y and distance between each.
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
    
        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
    
        
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.player, this.stars, this.collectStar, null, this);
    }
    
    update() {
        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-160);
    
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(160);
    
            this.player.anims.play('right', true);
        }
        else
        {
            this.player.setVelocityX(0);
    
            this.player.anims.play('turn');
        }
    
        if (this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-330);
        }
    }

    collectStar(player, stars) {
        //  star has its physics body disabled and its parent Game Object is made inactive and invisible, which removes it from display. Running the game now gives us a player that can dash about, jump, bounce off the platforms and collecting the stars that fall from above. 
        stars.disableBody(true, true);

        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        if (this.stars.countActive(true) === 0)
        {
            //  A new batch of stars to collect
            this.stars.children.iterate(function (child) {

                child.enableBody(true, child.x, 0, true, true);

            });

            var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            this.bomb = this.bombs.create(x, 16, 'bomb');
            this.bomb.setBounce(1);
            this.bomb.setCollideWorldBounds(true);
            this.bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            this.bomb.allowGravity = false;
        }
    }

    hitBomb (player, bomb) {
        this.physics.pause();

        this.player.setTint(0xff0000);

        this.player.anims.play('turn');

        this.gameOver = true;
    }
}

export default MyScene 