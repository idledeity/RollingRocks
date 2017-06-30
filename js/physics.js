
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
                hasBounds: true,
            }
        });
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
        this.debugRenderer.bounds = Matter.Bounds.create(Matter.Vertices.create([
            { x: game.phaser.camera.x, y: game.phaser.camera.y },
            { x: game.phaser.camera.x + game.phaser.width, y: game.phaser.camera.y + game.phaser.height }
        ]));

        // Render the physics world as a post process step
        Matter.Render.world(this.debugRenderer);
    }

    /**
     * Adds a new matter-js physics body to the world
     * @param {Matter.Body} body - The new matter-js physics body to add to the physics world 
     */
    addBody(body) {
        Matter.World.add(this.physicsEngine.world, body);
    }
}