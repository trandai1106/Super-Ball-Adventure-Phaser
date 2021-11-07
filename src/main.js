import Phaser from './lib/phaser.js';

import Preload from './scenes/Preload.js';
import Play from './scenes/Play.js';

export default new Phaser.Game({
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    backgroundColor: '#f4cca1',
    roundPixels: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    input: {
        activePointers: 3,
    },
    scene: [
        Preload,
        Play
    ],
    physics: {
        default: 'matter',
        matter: {
            // debug: true
        }
    }
});