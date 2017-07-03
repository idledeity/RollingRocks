
/**
 * Class for managing debug settings
 */
class DebugManager {
    /**
     * Constructor
     * @param {MainGame} game - Reference to the main game
     */
    constructor(game) {
        this.game = game;

        this.showFPS = true;
        this.flyCamEnabled = false;
    }

    /**
     * Called before create() to request any assets that should are required
     */
    preload() {
        // Nothing to do
    }


    /**
     * Called after preload() once assets have been loaded and before the main update/render functions for any asset dependent initialization
     */
    create() {
        console.log(this.game.phaser.input);

        this.toggleFlyCamKey = this.game.phaser.input.keyboard.addKey(Phaser.Keyboard.F);
        this.toggleFlyCamKey.onDown.add(this.toggleFlyCam, this);
    }

    /**
     * Update function called once each frame for any per-frame updating
     * @param {Number} deltaTimeMS - The elapsed time from the previous simulation frame in milliseconds
     */
    update() {
        // Nothing to do
    }

    /**
     * Render function called once each frame after update() to handle and post rendering
     */
    render() {
        // Display the FPS (frames per second)
        if (this.showFPS) {
            let text =  "FPS: " + parseFloat(1000 / this.game.phaser.time.elapsedMS).toFixed(1);
            this.game.phaser.debug.text(text, 10, 20, "#ffffff" );
        }
    }

    /**
     * Enable or Disable the debug "fly" camera
     * @param {Boolean} enable - True to enable the debug fly camera, False to disable it
     */
    flyCamSetEnabled(enable) {
        // Check if the fly cam is changing
        if (enable === this.flyCamEnabled) {
            return;
        }

        // Enable or disable the fly camera
        if (enable) {
            // Handle setting up the new free camera
            const activeCamera = this.game.getActiveCamera();
            let cameraPos = new Phaser.Point(0, 0);
            if (activeCamera != null) {
                cameraPos = activeCamera.getPosition();
            }

            this.game.setActiveCamera(new FreeCamera(this.game.getWorld(), cameraPos.x, cameraPos.y));
        } else {
            // Reset the default camera
            this.game.restoreDefaultCamera();
        }

        // Record the state of the fly cam
        this.flyCamEnabled = enable;
    }

    /**
     * Toggles the current state of the fly camera
     */
    toggleFlyCam() {
        // Toggle the fly camera
        this.flyCamSetEnabled(!this.flyCamEnabled);
    }
}