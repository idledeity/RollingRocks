
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
    create(jsonFile) {
        // Create the physics world
        this.physicsWorld.create(this.phaserGame.canvas, this.phaserGame.context, this.worldWidth, this.worldHeight);

        // Load the object's JSON definition
        this.definition = this.phaserGame.cache.getJSON(jsonFile);

        // Add collision for the world heightfield, if there is one
        if (this.definition.heightField !== null) {
            // Iterate over each position in the heightfield
            for (let pointIdx = 0; pointIdx < (this.definition.heightField.points.length - 1); pointIdx++) {
                // Get the current and next points in the height field
                let point1 = this.definition.heightField.points[pointIdx];
                let point2 = this.definition.heightField.points[pointIdx + 1];

                // Calculate the distance between the two points and the midway point so we can create a static rectangle collision body for this segment
                let displacement = Matter.Vector.sub(point2, point1);
                let magnitude = Matter.Vector.magnitude(displacement);
                let midway = Matter.Vector.mult(Matter.Vector.add(point1, point2), 0.5);
                let segmentCollision = Matter.Bodies.rectangle(midway.x, midway.y, magnitude, this.definition.heightField.thickness, { isStatic: true });

                // Calculate the angle above the horizontal between the two point and use that to rotate the new collision for this segment
                let angle = ((magnitude > 0.0) ? Math.asin(displacement.y / magnitude) : 0); // avoid DBZ
                Matter.Body.rotate(segmentCollision, angle);

                // Add the new segment collision to the physics world
                this.physicsWorld.addBody(segmentCollision);
            }
        }
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

        // Render all the objects
        for (let objectIdx = 0; objectIdx < this.gameObjects.length; objectIdx++) {
            this.gameObjects[objectIdx].render();
        }
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