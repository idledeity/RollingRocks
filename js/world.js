
/**
 * Primary class responsible for manageing the entire game world
 */
class GameWorld {
    /**
     * Constructor
     * @param {Phaser.Game} phaserGame - The Phaser Game instance
     * @param {Number} worldWidth - The width of the game world
     * @param {Number} worldHeight - The height of the game world
     */
    constructor(phaserGame, worldWidth, worldHeight) {
        this.phaserGame = phaserGame;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;

        // Create the physics world
        this.physicsWorld = new GamePhysics();

        // Initialize the array of game objects
        this.gameObjects = [];
    }

    /**
     * Called before create() to request any assets that should are required
     */
    preload() {
    }

    /**
     * Called after preload() once assets have been loaded and before the main update/render functions for any asset dependent initialization
     */
    create() {
        this.physicsWorld.create(this.phaserGame.canvas, this.phaserGame.context, this.worldWidth, this.worldHeight);
    }

    /**
     * Update function called once each frame for any per-frame updating
     */
    update() {
        // Update the physics sim
        this.physicsWorld.update(this.phaserGame.time.physicsElapsedMS);

        // Update all the objects
        for (let objectIdx = 0; objectIdx < this.gameObjects.length; objectIdx++) {
            this.gameObjects[objectIdx].update();
        }
    }

    /**
     * Render function called once each frame after update() to handle and post rendering
     */
    render() {
        // Allow the physics sim to render anything it needs to
        this.physicsWorld.render();
    }

    /** 
     * Adds a new game object to the game world
     * @param {GameObject} gameObject - The new game object to add to the world
     */
    addObject(gameObject) {
        this.gameObjects.push(gameObject);

        // Add the sprite to the phaser game
        this.phaserGame.add.existing(gameObject.sprite);

        // If the game object has a rigid body, add that to the physics world
        if (gameObject.rigidBody !== null) {
            this.physicsWorld.addBody(gameObject.rigidBody);
        }
    }

    /**
     * Returns the physics world beign used by this game world
     * @return {GamePhysics} A reference to the game's physics world
     */
    getPhysicsWorld() {
        return this.physicsWorld;
    }
}