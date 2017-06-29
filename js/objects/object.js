
/**
* A class representing a basic game object containing a sprite and collision
*/
class GameObject {
    /**
     * Constructor
     * @param {String} jsonFile - Name of the JSON file containing the description of this object's properties 
     * @param {*} gameWorld  - The Gameworld where the object should be create
     * @param {*} x - The X coordinate where the object should be created
     * @param {*} y - The Y coordinate where the object should be created
     */
    constructor(jsonFile, gameWorld, x, y) {
        this.gameWorld = gameWorld;
        
        // Load the object's JSON definition
        this.definition = gameWorld.phaserGame.cache.getJSON(jsonFile);

        // Initialize the object's sprite
        if (this.definition.sprite !== null) {
            this.sprite = new Phaser.Sprite(gameWorld.phaserGame, x, y, this.definition.sprite);
        }

        // Initialize the object's collision
        if (this.definition.collision !== null) {
            if (this.definition.collision.verticies !== null) {
                this.rigidBody = Matter.Bodies.fromVertices(x, y, Matter.Vertices.create(this.definition.collision.verticies));
            }

            // Adjust the anchor of the sprite to the center of mass of the collision body
            let centerOfMassOffset = Matter.Vector.sub(this.rigidBody.position, this.rigidBody.bounds.min);
            let boundExtents = Matter.Vector.sub(this.rigidBody.bounds.max, this.rigidBody.bounds.min);
            let anchorX = centerOfMassOffset.x / boundExtents.x;
            let anchorY = centerOfMassOffset.y / boundExtents.y;
            this.sprite.anchor.setTo(anchorX, anchorY);
        }
    }

    /**
     * Per frame update function for the object
     */
    update() {
        // Update the sprite's transform to follow the physic's rigid body transform
        if (this.rigidBody !== null) {
            this.sprite.x = this.rigidBody.position.x;
            this.sprite.y = this.rigidBody.position.y;
            this.sprite.rotation = this.rigidBody.angle;
        }
    }

    /**
     * Per frame render function for any post render effects
     */
    render() {
        // Nothing to do
    }

    /**
     * Helper function to convert world coordinates into this object's local coordinate space
     * @param {Number} worldX - The world X coordinate
     * @param {Number} worldY - The world Y coordinate
     * @return {Phaser.Point} The position of the point in local object space
     */
    getLocalFromWorld(worldX, worldY) {
        // Transform the world position by the sprite's position
        let transformPos = new Phaser.Point((worldX - this.sprite.world.x), (worldY - this.sprite.world.y));

        // Create a rotation matrix and rotate the transform point
        let rotationMatrix = new Phaser.Matrix();
        rotationMatrix.rotate(this.sprite.rotation);
        let localPos = rotationMatrix.applyInverse(transformPos);

        // Apply the sprite's offset to the local position
        localPos.add(this.sprite.offsetX, this.sprite.offsetY);

        // Return the final local position
        return localPos;
    }

    /**
     * Helper function to convert from a point in local object space to world space
     * @param {Number} localX - The local X coordinate
     * @param {Number} localY - The local Y coordinate
     * @return {Phaser.Point} The position of the point in world space
     */
    getWorldFromLocal(localX, localY) {
        // Transform the local point by the sprite's offset
        let transformPos = new Phaser.Point((localX - this.sprite.offsetX), (localY - this.sprite.offsetY));

        // Create a rotation matrix from the sprite's current rotation value and rotate the transform point
        let rotationMatrix = new Phaser.Matrix();
        rotationMatrix.rotate(this.sprite.rotation);
        let worldPos = rotationMatrix.apply(transformPos);
        
        // Add the sprite's translation to the final world position
        worldPos.add(this.sprite.position.x, this.sprite.position.y);

        // Return the final world position
        return worldPos;
    }
}