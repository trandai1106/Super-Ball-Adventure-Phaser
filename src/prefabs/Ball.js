import Phaser from '../lib/phaser.js'

export default class Ball extends Phaser.Physics.Matter.Sprite {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {string} texture
    */
    constructor(scene, x, y, options) {
       super(scene.matter.world, x, y, 'ball', null, options);
       scene.add.existing(this);
       this.setBounce(0.7)
       .setFriction(2, 0.01, 2)
       .setMass(0.5);
       this.body.slop = 0;
       this.body.inertia = 20;
    }
   
}