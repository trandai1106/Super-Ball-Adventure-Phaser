import Phaser from '../lib/phaser.js';

export default class Box extends Phaser.Physics.Matter.Image {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {string} texture
     * @param {number} radius
    */
    constructor(scene, x, y) {
        super(scene.matter.world, x, y, 'box', null, { 
            shape: scene.cache.json.get('box-shape').box,
            label: 'Box'
        });

        scene.add.existing(this);
        this.setBounce(0)
        .setFriction(0.01, 0.05, 2)
        .setMass(90);
        
        this.body.inertia = 100;
        this.body.slop = 0;
    }
}