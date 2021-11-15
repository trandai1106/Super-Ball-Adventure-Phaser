import Phaser from '../lib/phaser.js';

export default class GroundSensor extends Phaser.Physics.Matter.Image {

    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {string} texture
    */
    constructor(scene, x, y, parent) {
        super(scene.matter.world, x, y + parent.height * 0.5, 'ball', null, {
            isSensor: true
        }).setScale(0.1, 0.5)
        .setVisible(false);
        scene.add.existing(this);
    }
}