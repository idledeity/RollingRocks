
/** 
 * The Layer class is a lightweight wrapper around a Phaser.Group object, and manages a single graphics layer
 */
class Layer {
    /**
     * Constructor
     * @param {*} gameWorld - The game world this layer is a part of
     * @param {*} definition  - Definition for this layer
     */
    constructor(gameWorld, definition) {
        // Store a reference to the game world and layer definition
        this.gameWorld = gameWorld;
        this.definition = definition;

        // Create a new group for this layer in Phaser
        this.group = this.gameWorld.game.phaser.add.group();
        this.group.x = this.definition.position.x;
        this.group.y = this.definition.position.y;

        // Add all the images to the group
        this.images = [];
        if (this.definition.images != null) {
            for (let imageIdx = 0; imageIdx < this.definition.images.length; imageIdx++) {
                let imageInfo = this.definition.images[imageIdx];

                // Add the image to the group
                let image = this.group.create(imageInfo.offset.x, imageInfo.offset.y, imageInfo.sprite);

                // Apply any image scaling
                if (imageInfo.scale != null) {
                     image.scale.setTo(imageInfo.scale.x, imageInfo.scale.y);
                }

                // Apply any tint
                if (imageInfo.tint != null) {
                    image.tint = parseInt(imageInfo.tint);
                }

                // Store a reference to the image
                this.images.push(image);
            }
        }

        this.scale = 1.0 / Math.log2(this.definition.depth / gameWorld.background.defaultDepth);
    }

    /**
     * Per-frame update function for the layer
     */
    update() {
        // Get the camera position
        let cameraPos = this.gameWorld.game.camera.getPosition();

        // Adjust the group's X coordinate base
        this.group.x = (this.definition.position.x + (cameraPos.x * (1.0 - this.scale)));
        
        if (this.definition.depthAffectsY) {
            this.group.y = (this.definition.position.y + (cameraPos.y * (1.0 - this.scale)));
        }
    }
}