import { mainScene } from './scenes/main_scene.js';
import { initializeCombatLogElement } from './utils/ui_logger.js'; // Import the initializer

const config = {
    type: Phaser.AUTO,
    title: 'Overlord Rising', // Keep title/description or update? Using existing for now.
    description: '',
    parent: 'game-canvas', // Change parent to match the new index.html structure
    width: 800, // Adjust dimensions to match the previous attempt's canvas size
    height: 600,
    backgroundColor: '#000000',
    pixelArt: false, // Keep pixelArt setting
    scene: [
        mainScene // Use the new mainScene
    ],
    scale: {
        mode: Phaser.Scale.FIT, // Keep scaling mode
        autoCenter: Phaser.Scale.CENTER_BOTH // Keep centering
    },
};

window.onload = () => {
    // Initialize DOM-dependent utilities before starting Phaser
    // This ensures 'combat-log' element is found by ui_logger.js when it's first needed.
    initializeCombatLogElement();

    const game = new Phaser.Game(config);
};