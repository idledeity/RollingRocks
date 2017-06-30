
/**
 * Base class for the game camera
 */
class GameCamera {
    /**
     * Constructor
     * @param {GameWorld} gameWorld - The game world the camera will use
     * @param {Number} x - X coordinate of camera in world space
     * @param {Number} y - Y coordinate of camera in world space
     */
    constructor(gameWorld, x, y) {
        this.cameraPos = new Phaser.Point(x, y);
        this.gameWorld = gameWorld;
    }

    /**
     * Per-frame update for the camera
     * @param {Number} deltaTimeMS - The elapsed time from the previous simulation frame in milliseconds
     */
    update(deltaTimeMS) {
        // Nothing to do
    }

    /**
     * Returns the world position of the camera
     * @return {Phaser.Point} The world position of the camera
     */
    getPosition() {
        return this.cameraPos;
    }

    /**
     * Set the world position of the camera
     * @param {Phaser.Point} position - The world position of the camera 
     */
    setPosition(position) {
        this.cameraPos.x = x;
        this.cameraPos.y = y;
    }
}