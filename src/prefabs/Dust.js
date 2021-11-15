import Phaser from '../lib/phaser.js';

export default class Dust extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, scale) {
        super(scene, x, y, '');

        scene.add.layer(this);
        this.setOrigin(0.5);

        this.setScale(scale * 0.5, scale * 0.3);
        this.anims.play('anim-dust');

        setTimeout(() => {
            this.destroy();
        }, 1500);
    }
}