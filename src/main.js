import Phaser from './lib/phaser.js';

import Preload from './scenes/Preload.js';
import Play from './scenes/Play.js';
import Pause from './scenes/Pause.js';

export default new Phaser.Game({
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    backgroundColor: '#f4cca1',
    // pixelArt: 'true',
    scene: [
        Preload,
        Play,
        Pause
    ],
    physics: {
        default: 'matter',
        matter: {
            debug: true,
            gravity: {
                y: 20
            }
        }
    }
});