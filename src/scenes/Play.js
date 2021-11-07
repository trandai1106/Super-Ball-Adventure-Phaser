import Phaser from '../lib/phaser.js';
import Ball from '../prefabs/Ball.js';
import Box from '../prefabs/Box.js';

const RUN_FORCE = 0.05,
    MAX_RUN_SPEED = 6,
    JUMP_SPEED = 12;

export default class Play extends Phaser.Scene {
    isStanding
    isClickLeft
    isClickRight

    constructor() {
        super("play");
    }
    
    init() {
        this.isStanding = false;
        this.isClickLeft = false;
        this.isClickRight = false;
    }

    create() {
        const { width, height } = this.scale;

        this.matter.world.setBounds(0, 0, 1920, 700);

        // Create background
        this.background = this.add.tileSprite(0, 0, 0, 0, 'background')
        .setOrigin(0, 0.1)
        .setDisplaySize(960, 922)
        .setScrollFactor(0);
        
        // Tilemap
        const map = this.make.tilemap({ key: 'map-01' });
        const tileset = map.addTilesetImage('tileset', 'tileset');

        // Ground layer
        this.groundLayer = map.createLayer('Ground', tileset, 0, 0)
        .setOrigin(0);
        // Hill layer
        this.hillLayer = map.createLayer('Hill', tileset, 0, 0)
        .setOrigin(0);
        
        map.setCollisionByExclusion([ -1, 0 ], true, false, "Ground");
        map.setCollisionByExclusion([ -1, 0 ], true, false, "Hill");
        
        this.matter.world.convertTilemapLayer(this.groundLayer);
        this.matter.world.convertTilemapLayer(this.hillLayer);

        this.player = new Ball(this, 250, 240, 32);

        this.box = new Box(this, 350, 240);

        this.setCollisionObject(this.box, this.player);

        // Collision
        this.setCollisionLayer(this.groundLayer, this.player);
        this.setCollisionLayer(this.hillLayer, this.player);

        // GUI
        this.moveLeftButton = this.add.image(width * 0.09, height * 0.84, 'control-button')
        .setFlipX(true)
        .setScale(0.6)
        .setScrollFactor(0);
        this.moveRightButton = this.add.image(width * 0.24, height * 0.84, 'control-button')
        .setScale(0.6)
        .setScrollFactor(0);
        this.jumpButton = this.add.image(width * 0.9, height * 0.82, 'control-button')
        .setScale(0.74)
        .setAngle(-90)
        .setScrollFactor(0);

        // Move left button
        this.moveLeftButton.setInteractive();
        this.moveLeftButton.on('pointerdown', () => {
            this.isClickLeft = true;
            this.moveLeftButton.setAlpha(0.5);
        });
        this.moveLeftButton.on('pointerup', () => {
            this.isClickLeft = false;
            this.moveLeftButton.setAlpha(1);
            
        });
        this.moveLeftButton.on('pointerout', () => {
            this.isClickLeft = false;
            this.moveLeftButton.setAlpha(1);
        });
        // Move right button
        this.moveRightButton.setInteractive();
        this.moveRightButton.on('pointerdown', () => {
            this.isClickRight = true;
            this.moveRight();
            this.moveRightButton.setAlpha(0.5);
        });
        this.moveRightButton.on('pointerup', () => {
            this.isClickRight = false;
            this.moveRightButton.setAlpha(1);
        });
        this.moveRightButton.on('pointerout', () => {
            this.isClickRight = false;
            this.moveRightButton.setAlpha(1);
        });
        // Jump button
        this.jumpButton.setInteractive();
        this.jumpButton.on('pointerdown', () => {
            this.jump();
            this.jumpButton.setAlpha(0.5);
        });
        this.jumpButton.on('pointerup', () => {
            this.jumpButton.setAlpha(1);
        });
        this.jumpButton.on('pointerout', () => {
            this.jumpButton.setAlpha(1);
        });

        // Bound the camera, follow the player
        this.cameras.main
        .setBounds(0, 0, 1920, height * 1)
        .startFollow(this.player)
        .setDeadzone(this.scale.width * 0.3, this.scale.height * 0.5);
        // Fix bug line between tiles of tilemap
        this.cameras.main.roundPixels = true;
        // this.cameras.main.setZoom(0.3);

        // Moving handle
        this.cursors = this.input.keyboard.createCursorKeys();
        // this.add.image(0, 0, 'background-2').setOrigin(0).setAlpha(0.3);
    }

    update() {
        this.player._update();

        // Scroll the background
        this.background.tilePositionX = this.cameras.main.scrollX;
        this.background.tilePositionY = this.cameras.main.scrollY;

        if (this.cursors.left.isDown || this.isClickLeft) {
            this.moveLeft();
        }
        else if (this.cursors.right.isDown || this.isClickRight) {
            this.moveRight();
        }
        else {
            this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown) {
            this.jump();
        }
    }

    setCollisionLayer(_layer, _player) {
        _layer.forEachTile((tile) => {
            if (tile.index != -1) {
                tile.physics.matterBody.setFriction(0);
                const _body = tile.physics.matterBody.body;
                _player.groundSensor.setOnCollideWith(_body.parts, (part) => {
                    if (!this.isStanding) {
                        this.isStanding = true;
                        this.sound.play('land', {
                            volume: 0.5
                        });
                    }
                });
                
                for (var i = 0; i < _body.parts.length; i++) {
                    _body.parts[i].slop = 0;
                }
            }
        });
    }

    setCollisionObject(_object, _player) {
        _player.groundSensor.setOnCollideWith(_object.body.parts, (part) => {
            if (!this.isStanding) {
                this.isStanding = true;
                this.sound.play('land', {
                    volume: 0.5
                });
            }
        });
    }

    moveLeft() {
        if (this.player.body.velocity.x < - MAX_RUN_SPEED) {
            this.player.body.velocity.x = - MAX_RUN_SPEED;
            return;
        }
        this.player.applyForceFrom( 
            this.player.centerOfGravity(), 
            {x: - RUN_FORCE, y: 0.01}
        );
    }
    
    moveRight() {
        if (this.player.body.velocity.x > MAX_RUN_SPEED) {
            this.player.body.velocity.x = MAX_RUN_SPEED;
            return;
        }
        this.player.applyForceFrom( 
             this.player.centerOfGravity(), 
            {x: RUN_FORCE, y: 0.01}
        );
    }

    jump() {
        if (this.isStanding) {
            this.isStanding = false;
            this.sound.play('jump', {
                volume: 0.5
            });
            this.player.setVelocityY(- JUMP_SPEED);
        }
    }
}