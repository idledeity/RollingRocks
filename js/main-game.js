
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

        // Create a new game world
        this.gameWorld = new GameWorld(this, 512, 600);
    }

    /**
     * Called before create() to request any assets that should are required
     */
    preload() {
        // Let the game world do any necessary preloading
        this.gameWorld.preload();

        // Load the world
        this.phaser.load.pack('test-world1', 'assets/packs/test-world1.json', null, this);

        // Load the rock assets
        this.phaser.load.pack('rock', 'assets/packs/rock.json', null, this);
    }

    /**
     * Called after preload() once assets have been loaded and before the main update/render functions for any asset dependent initialization
     */
    create() {
        // Set the background color on the canvas
        this.phaser.stage.backgroundColor = "#4488AA";
        
        this.phaser.world.setBounds(-2000, -2000, 4000, 4000);

        // Create the gameworld
        this.gameWorld.create('worlds/test-world1.json');

        // Create the rock
        this.rock = new Rock("objects/rock.json", this.gameWorld, 50, 50);
        this.gameWorld.addObject(this.rock);
        
        // Give the rock an initial kick to make things interesting
        Matter.Body.setAngularVelocity(this.rock.rigidBody, 0.35);

        // Create the cammera
        this.camera = new FreeCamera(this.gameWorld, 0, 0);
    }

    /**
     * Update function called once each frame for any per-frame updating
     */
    update() {
        // Update the game world
        this.gameWorld.update();

        // Update the camera
        this.camera.update();
        let cameraPos = this.camera.getPosition();
        this.phaser.camera.x = cameraPos.x;
        this.phaser.camera.y = cameraPos.y;
    }

    /**
     * Render function called once each frame after update() to handle and post rendering
     */
    render() {
        // Allow the gameworld to render anything it needs to
        this.gameWorld.render();
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
}

