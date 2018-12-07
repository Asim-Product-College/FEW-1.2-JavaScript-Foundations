import Phaser from 'phaser';
import MyScene from './scene';

var config = {
    // automatically tries to use WebGL 
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    // The Scene itself has no fixed size and extends infinitely in all directions.
    scene: new MyScene()
};

const game = new Phaser.Game(config);