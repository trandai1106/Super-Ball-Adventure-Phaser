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
        .setFriction(0.2, 0.1, 0.2)
        .setMass(35);
        
        this.body.inertia = 20;

        for (var i = 0; i < this.body.parts.length; i++) {
            this.body.parts[i].slop = 0;
        }
    }
}