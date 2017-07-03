
/**
 * Class for managing the game's physics world (using matter-js)
 */
class GamePhysics {
    /**
     * Constructor
     */
    constructor() {
        // Nothing to do
    }

    /**
     * Called after preload() once assets have been loaded and before the main update/render functions for any asset dependent initialization
     * @param {DOM.Element} canvas - The canvas DOM element where the scene is being rendered
     * @param {} context - The context for the DOM canvas element
     * @param {Number} worldWidth - The width of the physics world
     * @param {Number} worldHeight - The height of the physics world
     */
    create(canvas, context, worldWidth, worldHeight) {
        // Create the physics egnine
        this.physicsEngine = Matter.Engine.create();

        // Create a renderer for physics debug rendering
        this.debugRenderer = Matter.Render.create({
            //element: document.body,
            canvas: canvas,
            context:context,
            engine: this.physicsEngine,
            options: {
                width: worldWidth,
                height: worldHeight,
                clearCanvas: false,
                wireframes: false,
                hasBounds: true,
            }
        });
        this.debugRenderEnabled = false;
    }

    /**
     * Update function called once each frame for any per-frame updating
     * @param {Number} deltaTimeMS - The elapsed time from the previous simulation frame in milliseconds
     */
    update(deltaTimeMS) {
        // Update the matter-js physics engine
        Matter.Engine.update(this.physicsEngine, deltaTimeMS);
    }

    /**
     * Render function called once each frame after update() to handle and post rendering
     */
    render(game) {
        // Hadle rendering the physics debug rendering if enabled
        if (this.debugRenderEnabled) {
            // Update the bounds for the debug rendered based on the current camera position
            this.debugRenderer.bounds = Matter.Bounds.create(Matter.Vertices.create([
                { x: game.phaser.camera.x, y: game.phaser.camera.y },
                { x: game.phaser.camera.x + game.phaser.width, y: game.phaser.camera.y + game.phaser.height }
            ]));

            // Render the physics world as a post process step
            Matter.Render.world(this.debugRenderer);
        }
    }

    /**
     * Adds a new matter-js physics body to the world
     * @param {Matter.Body} body - The new matter-js physics body to add to the physics world
     */
    addBody(body) {
        Matter.World.add(this.physicsEngine.world, body);
    }

    /**
     * Returns whether or not the physics debug render is enabled
     * @return {Boolean} True if the debug render is enabled, False if it is not
     */
    getDebugRenderEnabled() {
        return this.debugRenderEnabled;
    }

    /**
     * Sets the physics debug render to enabled or disabled
     * @param {Boolean} enabled - Whether the physics debug render should be enabled
     */
    setDebugRenderEnabled(enabled) {
        this.debugRenderEnabled = enabled;
    }
}