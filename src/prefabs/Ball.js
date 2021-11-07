import Phaser from '../lib/phaser.js';
import GroundSensor from './GroundSensor.js';

export default class Ball extends Phaser.Physics.Matter.Sprite {
    groundSensor

    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {string} texture
     * @param {number} radius
    */
    constructor(scene, x, y, radius) {
        super(scene.matter.world, x, y, 'ball', null, {
            shape: {
                type: 'circle',
                radius: radius
            }
        });
        scene.add.existing(this);
        this.setBounce(0)
        .setFriction(2, 0.02, 0.5)
        .setMass(15);
        this.body.slop = 0;
        this.body.inertia = 200;

        this.groundSensor = new GroundSensor(scene, x, y, this);
    }

    centerOfGravity() {
        return { x: this.body.position.x, y: this.body.position.y - 0.1 }
    }
   
    _update() {
        this.groundSensor.x = this.x;
        this.groundSensor.y = this.y + this.height * 0.5;
    }
}