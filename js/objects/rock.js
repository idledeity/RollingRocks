
class Rock extends GameObject {
    constructor(jsonFile, gameWorld, x, y) {
        super(jsonFile, gameWorld, x, y);

        // Enable input handling on the rock
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(this.onInputDownHandler, this);
        this.sprite.events.onInputUp.add(this.onInputUpHandler, this);
    }

    /**
     * Per frame update function for the object
     * @param {Number} deltaTimeMS - The elapsed time from the previous simulation frame in milliseconds
     */
    update(deltaTimeMS) {
        super.update(deltaTimeMS);

        // Update the force line if the rock has been clicked
        if (this.clicked) {
            // Get the current world position where the rock was clicked and update the line between there and the current moust cursor
            let clickedWorldPos = this.getWorldFromLocal(this.clickedPos.x, this.clickedPos.y);
            let pointerWorldPos = this.gameWorld.game.viewToWorld(this.gameWorld.game.phaser.input.mousePointer);

            this.forceLine.setTo(clickedWorldPos.x, clickedWorldPos.y, pointerWorldPos.x, pointerWorldPos.y)
        }
    }

    /**
     * Per frame render function for any post render effects
     */
    render() {
        super.render();

        // If the rock has been clicked, render the force line
        if (this.clicked) {
            this.gameWorld.game.phaser.debug.geom(this.forceLine);
        }
    }

    /**
     * Callback function for when the rock object has been clicked
     * @param {Phaser.Object} clickedObj - The Phaser entity that was clicked (aka the rock!)
     * @param {Phaser.Pointer} pointer - The pointer that clicked the rock
     */
    onInputDownHandler(clickedObj, pointer) {
        // Convert the pointer position to world coordinates
        let pointerWorldPos = this.gameWorld.game.viewToWorld(pointer);

        // Do a finer check to see if the rock was actually clicked
        if (!Matter.Vertices.contains(this.rigidBody.vertices, pointerWorldPos)) {
            return;
        }

        // Store the location where the rock was clicked
        this.clicked = true;
        this.clickedPos = this.getLocalFromWorld(pointerWorldPos.x, pointerWorldPos.y);
        this.forceLine = new Phaser.Line(pointerWorldPos.x, pointerWorldPos.y, pointerWorldPos.x, pointerWorldPos.y);
    }

    /**
     * Callback function for when the rock object has been un-clicked
     * @param {Phaser.Object} clickedObj - The Phaser entity that was clicked (aka the rock!)
     * @param {Phaser.Pointer} pointer - The pointer that clicked the rock
     */
    onInputUpHandler(clickedObj, pointer) {
        // If the rock hasn't previously been clicked, then nothing to do
        if (!this.clicked) {
            return;
        }

        // Transform the stored rock clicked position into a world position
        let clickedWorldPos = this.getWorldFromLocal(this.clickedPos.x, this.clickedPos.y);

        // Convert the pointer position to world coordinates
        let pointerWorldPos = this.gameWorld.game.viewToWorld(pointer);

        // Generate a force from the clicked position and the current cursor position
        let force = Phaser.Point.subtract(pointerWorldPos, clickedWorldPos);
        force.divide(1000, 1000); // scale the force
        Matter.Body.applyForce(this.rigidBody, clickedWorldPos, force);

        // Clear the rock clicked flag and force line
        this.clicked = false;
        this.forceLine = null;
    }
}