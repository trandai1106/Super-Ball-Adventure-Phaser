import Phaser from '../lib/phaser.js';
import Ball from '../prefabs/Ball.js';
import Box from '../prefabs/Box.js';
import Dust from '../prefabs/Dust.js';

const RUN_FORCE = 0.06,
    MAX_RUN_SPEED = 5,
    MAX_ANGULAR_SPEED = 0.2,
    JUMP_SPEED = 11,
    groundFriction = 0.1;

export default class Play extends Phaser.Scene {
    onGround
    isClickLeft
    isClickRight

    constructor() {
        super("play");
    }
    
    init() {
        this.onGround = false;
        this.isClickLeft = false;
        this.isClickRight = false;
    }

    create() {
        const { width, height } = this.scale;

        this.matter.world.setBounds(-20, 0, 2220, 700);

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
        this.matter.world.convertTilemapLayer(this.groundLayer);
        this.matter.world.convertTilemapLayer(this.hillLayer);
        
        // map.setCollisionByExclusion([ -1, 0 ], true, false, "Ground");
        // map.setCollisionByExclusion([ -1, 0 ], true, false, "Hill");
        // Collision
        // this.setCollisionLayer(this.groundLayer, this.player);
        // this.setCollisionLayer(this.hillLayer, this.player);

        this.platform = this.matter.add.image(980, 530, '')
        .setOrigin(0)
        .setVisible(false)
        .setScale(65, 1)
        .setStatic(true)
        .setFriction(groundFriction, 0, 0);  
        this.boundLeft = this.matter.add.image(-14, 270, '')
        .setOrigin(0)
        .setVisible(false)
        .setScale(1, 20)
        .setStatic(true)
        .setFriction(groundFriction, 0, 0);  
        this.boundRight = this.matter.add.image(1934, 270, '')
        .setOrigin(0)
        .setVisible(false)
        .setScale(1, 20)
        .setStatic(true)
        .setFriction(groundFriction, 0, 0);  
        this.firstHillTop = this.matter.add.image(128, 272, '')
        .setOrigin(0)
        .setVisible(false)
        .setScale(8, 1)
        .setStatic(true)
        .setFriction(groundFriction, 0, 0);  
        this.firstHillRight = this.matter.add.image(240, 400, '')
        .setOrigin(0)
        .setVisible(false)
        .setScale(1, 8)
        .setStatic(true)
        .setFriction(groundFriction, 0, 0);  
        this.secondHillTop = this.matter.add.image(1794, 272, '')
        .setOrigin(0)
        .setVisible(false)
        .setScale(8, 1)
        .setStatic(true)
        .setFriction(groundFriction, 0, 0);  
        this.secondHillLeft = this.matter.add.image(1681, 400, '')
        .setOrigin(0)
        .setVisible(false)
        .setScale(1, 8)
        .setStatic(true)
        .setFriction(groundFriction, 0, 0);  


        this.player = new Ball(this, 350, 480, 32);

        this.box = new Box(this, 450, 453);

        this.setCollisionObject(this.box, this.player);

        this.setCollisionObject(this.platform, this.player);
        this.setCollisionObject(this.firstHillTop, this.player);
        this.setCollisionObject(this.secondHillTop, this.player);


        // GUI
        this.fullScreenButton = this.add.image(width * 0.95, height * 0.09, 'full-screen-button')
        .setScale(0.3)
        .setScrollFactor(0)
        .setInteractive();
        this.moveLeftButton = this.add.image(width * 0.09, height * 0.84, 'control-button')
        .setFlipX(true)
        .setScale(0.6)
        .setScrollFactor(0)
        .setInteractive();
        this.moveRightButton = this.add.image(width * 0.24, height * 0.84, 'control-button')
        .setScale(0.6)
        .setScrollFactor(0)
        .setInteractive();
        this.jumpButton = this.add.image(width * 0.9, height * 0.82, 'control-button')
        .setScale(0.74)
        .setAngle(-90)
        .setScrollFactor(0)
        .setInteractive();

        // Full screen button
        this.fullScreenButton.on('pointerdown', () => {
            if (!this.scale.isFullscreen) {
                this.scale.startFullscreen();
            }
            else {
                this.scale.stopFullscreen();
            }
        });
        // Move left button
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
        .setBounds(0, - height * 0.5, 1920, height * 2)
        .startFollow(this.player)
        .setDeadzone(this.scale.width * 0.1, this.scale.height * 0.35);
        // Fix bug line between tiles of tilemap
        this.cameras.main.roundPixels = true;
        // this.cameras.main.setZoom(0.3);

        // Moving handle
        this.cursors = this.input.keyboard.createCursorKeys();
        // this.add.image(0, 0, 'background-2').setOrigin(0).setAlpha(0.3);
    }

    update() {
        this.player._update();
        // if (this.player.body.velocity.y > 0.01) {
        //     this.onGround = false;
        // }

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
            this.player.setAngularVelocity(this.player.body.angularVelocity * 0.9);
            // this.player.body.angularVelocity = 0;
        }

        if (this.cursors.up.isDown) {
            this.jump();
        }

        // this.player.body.angularVelocity = this.player.body.velocity.x/this.player.body.circleRadius;
        // console.log(this.player.body.angularVelocity)
        // console.log(this.player.body.velocity.x)
        this.position = this.player.body.position.y;
    }

    // setCollisionLayer(_layer, _player) {
    //     _layer.forEachTile((tile) => {
    //         if (tile.index != -1) {
    //             const _body = tile.physics.matterBody.body;
    //             _player.groundSensor.setOnCollideWith(_body.parts, (part) => {
    //                 if (!this.onGround) {
    //                     this.onGround = true;
    //                     this.sound.play('land', {
    //                         volume: 0.5
    //                     });
    //                 }
    //             });
                
    //             for (var i = 0; i < _body.parts.length; i++) {
    //                 _body.parts[i].slop = 0;
    //                 _body.parts[i].friction = 100;
    //             }

    //             // Tile at left and right of hill
    //             // if ([11, 16, 17, 26, 27, 32].includes(tile.index)) {
    //             //     tile.physics.matterBody.setFriction(0.1);
    //             // }
    //         }
    //     });
    // }

    setCollisionObject(_object, _player) {
        _player.groundSensor.setOnCollideWith(_object.body.parts, (part) => {
            console.log(this.player.y)
            console.log(this.player.y + this.player.body.circleRadius)
            // if (!this.onGround) {
                this.onGround = true;
                this.sound.play('land', {
                    volume: Math.abs(this.player.body.velocity.y/20)
                });
                new Dust(
                    this, 
                    this.player.x,  
                    this.position + this.player.body.circleRadius * 2,
                    Math.abs(this.player.body.velocity.y/20)
                );
            // }
        });
    }

    moveLeft() {
        // console.log(this.player.body.angularVelocity)
        if (this.player.body.angularVelocity < - MAX_ANGULAR_SPEED) {
            this.player.body.angularVelocity = - MAX_ANGULAR_SPEED;
            return;
        }

        if (this.player.body.velocity.x < - MAX_RUN_SPEED) {
            this.player.body.velocity.x = - MAX_RUN_SPEED;
            return;
        }
        // this.player.setVelocityX(-5)
        this.player.applyForceFrom( 
            this.player.centerOfGravity(this.onGround), 
            {x: - RUN_FORCE, y: 0}
        );
    }
    
    moveRight() {
        // console.log(this.player.body.angularVelocity)
        if (this.player.body.angularVelocity > MAX_ANGULAR_SPEED) {
            this.player.body.angularVelocity = MAX_ANGULAR_SPEED;
            return;
        }

        if (this.player.body.velocity.x > MAX_RUN_SPEED) {
            this.player.body.velocity.x = MAX_RUN_SPEED;
            return;
        }
        // this.player.setVelocityX(5)
        this.player.applyForceFrom( 
             this.player.centerOfGravity(this.onGround), 
            {x: RUN_FORCE, y: 0}
        );
    }

    jump() {
        if (this.onGround) {
            this.onGround = false;
            this.sound.play('jump', {
                volume: 0.5
            });
            new Dust(
                this, 
                this.player.x,  
                this.position + this.player.body.circleRadius, 
                0.8
            );
            this.player.setVelocityY(- JUMP_SPEED);
        }
    }
}