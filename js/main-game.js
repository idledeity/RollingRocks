
/**
 * Class for the main game state/loop
 */
class MainGame {
    /**
     * Constructor
     * @param {Phaser.Game} phaser - The Phaser game instnace
     */
    constructor(phaser) {
        this.phaser = phaser;
        this.debugManager = null;
    }

    /**
     * Called before create() to request any assets that should are required
     */
    preload() {
        // Create a new game world
        this.gameWorld = new GameWorld(this);

        // Let the game world do any necessary preloading
        this.gameWorld.preload();

        // Load the world
        this.phaser.load.pack('test-world1', 'assets/packs/test-world1.json', null, this);

        // Load the rock assets
        this.phaser.load.pack('rock', 'assets/packs/rock.json', null, this);

        // Let the debug manager preload anything
        if (this.debugManager != null) {
            this.debugManager.preload();
        }
    }

    /**
     * Called after preload() once assets have been loaded and before the main update/render functions for any asset dependent initialization
     */
    create() {
        // Set the background color on the canvas
        this.phaser.stage.backgroundColor = "#4488AA";

        // Create the gameworld
        this.gameWorld.create('worlds/test-world1.json');

        // Create the rock
        this.rock = new Rock("objects/rock.json", this.gameWorld, 50, 50);
        this.gameWorld.addObject(this.rock);

        // Give the rock an initial kick to make things interesting
        Matter.Body.setAngularVelocity(this.rock.rigidBody, 0.35);

        // Create the cammera
        this.defaultCamera = new SpringCamera(this.gameWorld, 0, 0);
        this.defaultCamera.setFollowTarget(this.rock);
        this.defaultCamera.setOffset(new Phaser.Point(0, -100));
        this.setActiveCamera(this.defaultCamera);

        // Let the debug manager create anything
        if (this.debugManager != null) {
            this.debugManager.create();
        }
    }

    /**
     * Update function called once each frame for any per-frame updating
     */
    update() {
        // Let the debug manager update anything
        if (this.debugManager != null) {
            this.debugManager.update(this.phaser.time.physicsElapsedMS);
        }

        // Update the game world
        this.gameWorld.update(this.phaser.time.physicsElapsedMS);

        // Update the camera
        this.activeCamera.update(this.phaser.time.physicsElapsedMS);
        let cameraPos = this.activeCamera.getPosition();
        this.phaser.camera.x = cameraPos.x - this.phaser.width * 0.5;
        this.phaser.camera.y = cameraPos.y - this.phaser.height * 0.5;


        // Do the post update for the game world
        this.gameWorld.updatePost(this.phaser.time.physicsElapsedMS);
    }

    /**
     * Render function called once each frame after update() to handle and post rendering
     */
    render() {
        // Allow the gameworld to render anything it needs to
        this.gameWorld.render();

        // Let the debug manager render anything
        if (this.debugManager != null) {
            this.debugManager.render();
        }
    }

    /**
     * Transform a point from the view coordinates to world coordinates
     * @param {Phaser.Point} viewPosition - Point in view space
     * @return {Phaser.Point} The point in world space
     */
    viewToWorld(viewPosition) {
        return new Phaser.Point(viewPosition.x + this.phaser.camera.x, viewPosition.y + this.phaser.camera.y);
    }

    /**
     * Transform a point from world coordinates to view coordinatess
     * @param {Phaser.Point} worldPosition - Point in world space
     * @return {Phaser.Point} The point in view space
     */
    worldToView(worldPosition) {
        return new Phaser.Point(viewPosition.x - this.phaser.camera.x, viewPosition.y - this.phaser.camera.y);
    }

    /**
     * Returns the game world
     * @return {GameWorld} The game world for the game
     */
    getWorld() {
        return this.gameWorld;
    }

    /**
     * Returns the active camera
     * @return {Camera} The active game camera
     */
    getActiveCamera() {
        return this.activeCamera;
    }

    /**
     * Set the game's active camera
     * @param {Camera} camera - The camera that should be used as the game's active camera
     */
    setActiveCamera(camera) {
        this.activeCamera = camera;
    }

    /**
     * Restore's the game's active camera to the default camera
     */
    restoreDefaultCamera() {
        this.activeCamera = this.defaultCamera;
    }

    /**
     * Set the debug manager for the game
     * @param {DebugManager} debugManager - The debug manager to use
     */
    setDebugManager(debugManager) {
        this.debugManager = debugManager;
    }
}

