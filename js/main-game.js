
/**
 * Class for the main game state/loop
 */
class MainGame {
    /**
     * Constructor
     * @param {Phaser.Game} phaserGame - The Phaser game instnace
     */
    constructor(phaserGame) {
        this.phaserGame = phaserGame;

        // Create a new game world
        this.gameWorld = new GameWorld(phaserGame, 512, 600);
    }

    /**
     * Called before create() to request any assets that should are required
     */
    preload() {
        // Let the game world do any necessary preloading
        this.gameWorld.preload();

        // Load the rock assets
        this.phaserGame.load.pack('rock', 'assets/packs/rock.json', null, this);
    }

    /**
     * Called after preload() once assets have been loaded and before the main update/render functions for any asset dependent initialization
     */
    create() {
        // Set the background color on the canvas
        this.phaserGame.stage.backgroundColor = "#4488AA";
        
        // Create the gameworld
        this.gameWorld.create();

        // Create a static physics shape for the ground
        this.ground = Matter.Bodies.rectangle(500, 800, 8100, 600, { isStatic: true });
        this.gameWorld.getPhysicsWorld().addBody(this.ground);

        // Create the rock
        this.rock = new Rock("objects/rock.json", this, 50, 50);
        this.gameWorld.addObject(this.rock);
        
        // Give the rock an initial kick to make things interesting
        Matter.Body.setAngularVelocity(this.rock.rigidBody, 0.35);
    }

    /**
     * Update function called once each frame for any per-frame updating
     */
    update() {
        // Update the game world
        this.gameWorld.update();    
    }

    /**
     * Render function called once each frame after update() to handle and post rendering
     */
    render() {
        // Allow the gameworld to render anything it needs to
        this.gameWorld.render();
    }

}

