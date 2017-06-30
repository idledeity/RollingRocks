
/**
 * A free camera that allows the user to pan the camera with the arrow keys
 */
class FreeCamera extends GameCamera {
    /**
     * Constructor
     * @param {GameWorld} gameWorld - The game world the camera will use
     * @param {Number} x - X coordinate of camera in world space
     * @param {Number} y - Y coordinate of camera in world space
     */
    constructor(gameWorld, x, y) {
        super(gameWorld, x, y);

        // Create a cursor for accessing processing arrow key input
        this.cursors = gameWorld.game.phaser.input.keyboard.createCursorKeys();
    }

    /**
     * Per-frame update for the camera
     * @param {Number} deltaTimeMS - The elapsed time from the previous simulation frame in milliseconds
     */
    update(deltaTimeMS) {
        super.update();

        // Process arrow key input to pan the camera
        if (this.cursors.up.isDown)
        {
            this.cameraPos.y -= 4;
        }
        if (this.cursors.down.isDown)
        {
            this.cameraPos.y += 4;
        }
        if (this.cursors.left.isDown)
        {
            this.cameraPos.x -= 4;
        }
        if (this.cursors.right.isDown)
        {
            this.cameraPos.x += 4;
        }       
    }
}