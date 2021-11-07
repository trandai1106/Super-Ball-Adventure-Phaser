import Phaser from '../lib/phaser.js';

export default class Preload extends Phaser.Scene {
    title
    progressBar
    processBarBorder
    progressText

    constructor() {
        super("preload");
    }

    preload() {
        // Title
        const style = { color: '#000000', fontSize: 50, fontFamily: 'monospace' };
        const { width, height } = this.scale;
        this.title = this.add.text(width * 0.5, height * 0.2, 'Super Ball Adventure', style)
        .setOrigin(0.5);
        this.progressText = this.add.text(width * 0.5, height * 0.4, 'Loading 0%', style)
        .setOrigin(0.5);
        
        // Loading bar
        this.progressBar = this.add.graphics({x: width * 0.3, y: height * 0.6});
        // this.progressBar.setOrigin(0.5);
        this.processBarBorder = this.add.graphics({x: width * 0.3, y: height * 0.6});
        // this.processBarBorder.setOrigin(0.5);
        this.processBarBorder.lineStyle(4, '0x000000', 1);
        this.processBarBorder.strokeRect(0, 0, width * 0.4, 30);

        // Load the background image
        this.load.image('background', 'assets/sprites/environment/background/background.png');
        this.load.image('background-2', 'assets/sprites/environment/background/scs.jpg');

        // Load the ball image
        this.load.image('ball', 'assets/sprites/ball/ball.png');
        
        // Load object images
        this.load.image('box', 'assets/sprites/environment/object/box.png');
        this.load.json('box-shape', 'assets/sprites/environment/object/box-shape.json');

        // Load GUI
        this.load.image('control-button', 'assets/sprites/gui/btnControl.png');
        this.load.image('full-screen-button', 'assets/sprites/gui/btnFullScreen.png');

        // Load platform tilemap
        this.load.tilemapTiledJSON('map-01', 'assets/sprites/environment/tile/map-01.json');
        this.load.image('tileset', 'assets/sprites/environment/tile/tileset.png');

        // Sound effect
        this.load.audio('jump', 'assets/sounds/jump.wav');
        this.load.audio('land', 'assets/sounds/land.wav');

        // Loading statement
        this.load.on('progress', (val) => {
            // Text
            this.progressText.text = 'Loading ' + (Math.round(val * 100)) + '%';
            // Bar
            this.progressBar.clear();
            this.progressBar.fillStyle('0x444444', 1);
            this.progressBar.fillRect(0, 0, val * width * 0.4, 30);
        }, this);
    }

    create() {
        // Delay and change scene
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.start('play');
            },
            callbackScope: this
        });
    }
}