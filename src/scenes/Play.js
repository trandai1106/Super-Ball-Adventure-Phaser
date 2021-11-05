import Phaser from '../lib/phaser.js';
import Ball from '../prefabs/Ball.js';

const RUN_SPEED = 400,
    JUP_SPEED = 200;

export default class Play extends Phaser.Scene {
    gravity = 500

    isStanding

    constructor() {
        super("play");
    }
    
    init() {
        this.isStanding = false;
    }

    create() {
        const { width, height } = this.scale;

        // Create background
        this.background = this.add.tileSprite(0, 0, width, height, 'background')
        .setOrigin(0, 0)
        .setScrollFactor(0)
        // .setVisible(0);
        
        // Tilemap
        const map = this.make.tilemap({ key: 'map-01' });
        const tileset = map.addTilesetImage('tile', 'tileset');
        // map.setCollisionByExclusion([ -1, 0 ]);

        // Ground layer
        this.groundLayer = map.createLayer('Ground', tileset, 0, 0)
        .setOrigin(0)
        .setScale(3)
        // .setVisible(0);
        
        this.groundCollider = this.physics.add.image(0, 336, 'tile-collider')
        .setOrigin(0)
        .setImmovable(true)
        .setScale(50, 1)
        .setVisible(0);
        this.groundCollider2 = this.physics.add.image(1436, 560, 'tile-collider')
        .setScale(14, 1)
        .setAngle(45)
        .setFriction(0.2)
        .setVisible(0);

        this.player = new Ball(this, 250, 240);

        // // Collision
        // this.groundLayer.forEachTile((tile) => {
        //     if (tile.index == 1) console.log(tile)
        //     if (0 <= tile.index && tile.index <= 2) {                    
        //         tile.physics.matterBody.setOnCollideWith(this.player, () => {
        //             this.isStanding = true;
        //         });
        //     }
        //     else if (tile.index != -1) {
        //         tile.physics.matterBody.setFriction(0);
        //     }
        // });

        this.physics.add.collider(this.player, this.groundCollider, () => {
            if (this.player.body.onFloor()) this.isStanding = true;
        });

        // GUI
        this.pauseButton = this.add.image(width * 0.945, height * 0.08, 'pause-button')
        .setScrollFactor(0)
        .setVisible(0);
        this.pauseButton.setInteractive();
        this.pauseButton.on('pointerover', () => {
            this.pauseButton.setTexture('pause-button-hover');
        });
        this.pauseButton.on('pointerdown', () => {
            this.pauseButton.setTexture('pause-button-click');
        });
        this.pauseButton.on('pointerup', () => {
            this.pauseButton.setTexture('pause-button');
            this.scene.pause();
            this.sound.pauseAll();
            this.scene.bringToTop('pause');
            this.scene.launch('pause', {
                sceneKey: 'level-01'
            });
        });
        this.pauseButton.on('pointerout', () => {
            this.pauseButton.setTexture('pause-button');
        });

        // Bound the camera, follow the player
        this.cameras.main
        // .setBounds(0, 0, 3000, 580)
        .startFollow(this.player)
        .setDeadzone(this.scale.width * 0.3, this.scale.height * 0.5);
        // Fix bug line between tiles of tilemap
        this.cameras.main.roundPixels = true;
        // this.cameras.main.setZoom(0.5);

        // Moving handle
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // Scroll the background
        this.background.tilePositionX = this.cameras.main.scrollX;

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(- RUN_SPEED);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(RUN_SPEED);
        }
        else {
            this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.isStanding) {
            this.isStanding = false;
            this.player.setVelocityY(- JUP_SPEED);
        }
    }
}