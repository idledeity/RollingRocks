
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
        this.flyCamEnabled = true;
        this.showCameraPosition = true;
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
        // Register a key for toggling the fly camera
        this.toggleFlyCamButton = this.game.phaser.input.keyboard.addKey(Phaser.Keyboard.F);
        this.toggleFlyCamButton.onDown.add(this.toggleFlyCam, this);

        // Register a key for toggling physics debug rendering
        this.togglePhysicsDebugButton = this.game.phaser.input.keyboard.addKey(Phaser.Keyboard.P);
        this.togglePhysicsDebugButton.onDown.add(this.togglePhysicsDebug, this);
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
        let lineStartY = 20;
        let lineHeight = 20;

        // Display the FPS (frames per second)
        if (this.showFPS) {
            let text =  "FPS: " + parseFloat(1000 / this.game.phaser.time.elapsedMS).toFixed(1);
            this.game.phaser.debug.text(text, 10, lineStartY, "#ffffff" );
            lineStartY = lineStartY + lineHeight;
        }

        // Display the FPS (frames per second)
        if (this.showCameraPosition) {
            let cameraPosition = this.game.getActiveCamera().getPosition();
            let text =  "Camera Position: (" + parseFloat(cameraPosition.x).toFixed(2) + ", " + parseFloat(cameraPosition.y).toFixed(2) + ")";
            this.game.phaser.debug.text(text, 10, lineStartY, "#ffffff" );
            lineStartY = lineStartY + lineHeight;
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

    /**
     * Toggles the physics world debug rendering
     */
    togglePhysicsDebug() {
        this.game.getWorld().getPhysicsWorld().setDebugRenderEnabled(!this.game.getWorld().getPhysicsWorld().getDebugRenderEnabled());
    }
}