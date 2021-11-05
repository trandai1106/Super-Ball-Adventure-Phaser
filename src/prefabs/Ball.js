import Phaser from '../lib/phaser.js'

export default class Ball extends Phaser.Physics.Arcade.Sprite {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {string} texture
    */
    constructor(scene, x, y) {
        super(scene, x, y, 'ball');
        
        // Add to world
        scene.physics.add.existing(this);
        scene.add.layer(this);

        this.body.setCircle(32);
        this.setGravityY(scene.gravity);
        this.setBounce(0.6);
    }
   
}