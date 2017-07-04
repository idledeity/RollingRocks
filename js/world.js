
/**
 * Primary class responsible for manageing the entire game world
 */
class GameWorld {
    /**
     * Constructor
     * @param {MainGame} game - The Game instance
     * @param {Number} worldWidth - The width of the game world
     * @param {Number} worldHeight - The height of the game world
     */
    constructor(game) {
        this.game = game;

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
        // Load the object's JSON definition
        this.definition = this.game.phaser.cache.getJSON(jsonFile);

        // Set the world extents
        this.worldWidth = this.definition.extents.max.x - this.definition.extents.min.x;
        this.worldHeight = this.definition.extents.max.y - this.definition.extents.min.y;
        this.game.phaser.world.setBounds(this.definition.extents.min.x, this.definition.extents.min.y, this.worldWidth, this.worldHeight);

        // Create the physics world
        this.physicsWorld.create(this.game.phaser.canvas, this.game.phaser.context, this.game.phaser.scale.viewportWidth, this.game.phaser.scale.viewportHeight);

        // Create the world background layers
        this.background = {};
        this.background.layers = [];
        if (this.definition.background != null) {
            this.background.defaultDepth = this.definition.background.defaultDepth;
            if (this.definition.background.layers) {
                for (let layerIdx = 0; layerIdx < this.definition.background.layers.length; layerIdx++) {
                    let layerDefinition = this.definition.background.layers[layerIdx];

                    // Create the layer
                    let layer = null;
                    if (layerDefinition.type === "particle-field") {
                        layer = new ParticleField(this, layerDefinition);
                    } else {
                        layer = new Layer(this, layerDefinition);
                    }

                    this.background.layers.push(layer);
                }
            }
        }

        // Create the height field
        if (this.definition.heightField != null && this.definition.heightField.points.length >= 2) {
            let fillColor = parseInt(this.definition.heightField.fillColor);

            var graphics = this.game.phaser.add.graphics(0, 0);
            graphics.beginFill(fillColor);
            graphics.lineStyle(1, fillColor, 1);
            graphics.moveTo(this.definition.heightField.points[0].x, this.definition.extents.max.y);
            graphics.lineTo(this.definition.heightField.points[0].x, this.definition.heightField.points[0].y);

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

                // Create a sprite for this segment
                let image = this.game.phaser.add.sprite(midway.x, midway.y, this.definition.heightField.image);
                image.scale.setTo(magnitude, 1);
                image.anchor.setTo(0.5, 0.5);
                image.rotation = angle;
                if (this.definition.heightField.tint) {
                    image.tint = parseInt(this.definition.heightField.tint);
                }

                graphics.lineTo(point2.x, point2.y);
            }

            graphics.lineTo(this.definition.heightField.points[this.definition.heightField.points.length - 1].x, this.definition.extents.max.y);
            graphics.lineTo(this.definition.heightField.points[0].x, this.definition.extents.max.y);

            graphics.endFill();
        }
    }

    /**
     * Update function called once each frame for any per-frame updating
     * @param {Number} deltaTimeMS - The elapsed time from the previous simulation frame in milliseconds
     */
    update(deltaTimeMS) {
        // Update the physics sim
        this.physicsWorld.update();

        // Update all the objects
        for (let objectIdx = 0; objectIdx < this.gameObjects.length; objectIdx++) {
            this.gameObjects[objectIdx].update(deltaTimeMS);
        }
    }

    /**
     * Update function called once each frame after the camera has been processed
     */
    updatePost() {
        for (let layerIdx = 0; layerIdx < this.definition.background.layers.length; layerIdx++) {
            this.background.layers[layerIdx].update();
        }
    }

    /**
     * Render function called once each frame after update() to handle and post rendering
     */
    render() {
        // Allow the physics sim to render anything it needs to
        this.physicsWorld.render(this.game);

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
        this.game.phaser.add.existing(gameObject.sprite);

        // If the game object has a rigid body, add that to the physics world
        if (gameObject.rigidBody != null) {
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