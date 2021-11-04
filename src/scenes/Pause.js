import Phaser from '../lib/phaser.js';

export default class Pause extends Phaser.Scene {
    resumeButton

    constructor() {
        super("pause");
    }

    create() {
        const { width, height } = this.scale;
        
        this.resumeButton = this.add.image(width * 0.945, height * 0.08, 'resume-button');
        this.resumeButton.setInteractive();
        this.resumeButton.on('pointerover', ()=>{
            this.resumeButton.setTexture('resume-button-hover');
        });
        this.resumeButton.on('pointerdown', ()=>{
            this.resumeButton.setTexture('resume-button-click');
        });
        this.resumeButton.on('pointerup', ()=>{
            this.resumeButton.setTexture('resume-button');
            this.scene.bringToTop('play');
            this.scene.resume('play');
        });
        this.resumeButton.on('pointerout', ()=>{
            this.resumeButton.setTexture('resume-button');
        });
    }
}