
class Rock extends GameObject {
    constructor(jsonFile, gameWorld, x, y) {
        super(jsonFile, gameWorld, x, y);

        // Enable input handling on the rock
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(this.onInputDownHandler, this);
        this.sprite.events.onInputUp.add(this.onInputUpHandler, this);

        this.forceArrow = {};
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
            let arrowVector = this.calculateArrowVector(this.gameWorld.game.phaser.input.mousePointer);

            // Check if the arrow vector has a non-zero magnitude
            let magnitude = arrowVector.getMagnitude();
            if (magnitude >= 0) {
                // Get the direction from the arrow vector
                let direction = arrowVector.clone();
                direction.divide(magnitude, magnitude);

                // Calculate the angle of the arrow vector
                let angle = Math.acos(direction.dot(new Phaser.Point(1, 0)));
                if (direction.y < 0) {
                    angle = angle * -1;
                }

                // Calculate the end position from the arrow vector and clicked position (start)
                let endPosition = arrowVector.clone();
                endPosition.add(clickedWorldPos.x, clickedWorldPos.y);

                // Update the sprite for the base arrow component (the shaft)
                this.forceArrow.baseSprite.scale.setTo(magnitude - this.forceArrow.tipSprite.width, this.definition.arrow.thickness);
                this.forceArrow.baseSprite.x = clickedWorldPos.x;
                this.forceArrow.baseSprite.y = clickedWorldPos.y;
                this.forceArrow.baseSprite.rotation = angle;

                // Update the sprite for the arrow tip component (arrow head)
                this.forceArrow.tipSprite.x = endPosition.x;
                this.forceArrow.tipSprite.y = endPosition.y;
                this.forceArrow.tipSprite.rotation = angle;

                // Make the sprites for the arrow component visible
                this.forceArrow.baseSprite.visible = true;
                this.forceArrow.tipSprite.visible = true;
            } else {
                // Hide the arrow if the magnitude of the arrow force is too low
                this.forceArrow.baseSprite.visible = false;
                this.forceArrow.tipSprite.visible = false;
            }
        }
    }

    /**
     * Per frame render function for any post render effects
     */
    render() {
        super.render();
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

        // Create the sprites for the arrow components
        this.forceArrow.baseSprite = this.gameWorld.game.phaser.add.sprite(this.sprite.x, this.sprite.y, this.definition.arrow.baseImage);
        this.forceArrow.baseSprite.anchor.setTo(0.0, 0.5);
        this.forceArrow.baseSprite.visible = false;
        this.forceArrow.tipSprite = this.gameWorld.game.phaser.add.sprite(this.sprite.x, this.sprite.y, this.definition.arrow.tipImage);
        this.forceArrow.tipSprite.anchor.setTo(1.0, 0.5);
        this.forceArrow.tipSprite.visible = false;

        // Add any tint
        if (this.definition.arrow.tint != null) {
            let tintValue = parseInt(this.definition.arrow.tint);
            this.forceArrow.baseSprite.tint = tintValue;
            this.forceArrow.tipSprite.tint = tintValue;
        }

        // Adjust the alpha
        if (this.definition.arrow.alpha != null) {
            this.forceArrow.baseSprite.alpha = this.definition.arrow.alpha;
            this.forceArrow.tipSprite.alpha = this.definition.arrow.alpha;
        }

        // Store the location where the rock was clicked
        this.clicked = true;
        this.clickedPos = this.getLocalFromWorld(pointerWorldPos.x, pointerWorldPos.y);
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

        // Generate a arrow vector from the clicked position and the current cursor position
        let arrowVector = this.calculateArrowVector(pointer);

        // Check if the arrow vector is non zero
        if (arrowVector.getMagnitudeSq() > 0) {
            // Generate a force vector from the arrow vector
            let forceScaleFactor = this.definition.arrow.maxForce / this.definition.arrow.lengthMax;
            arrowVector.multiply(forceScaleFactor, forceScaleFactor);
            Matter.Body.applyForce(this.rigidBody, clickedWorldPos, arrowVector);
        }

        // Clear the rock clicked flag and force line
        this.forceArrow.baseSprite.kill();
        this.forceArrow.baseSprite = null;
        this.forceArrow.tipSprite.kill();
        this.forceArrow.tipSprite = null;
        this.clicked = false;
    }

    /**
     * Calculates the current arrow vector betweent he rock's clicked position and the current cursor location
     * @param {Phaser.Point} cursorScreenPos - The current screen positin of the cursor
     * @returns {Phaser.Point} The current arrow vector
     */
    calculateArrowVector(cursorScreenPos) {
        let forceVector = new Phaser.Point(0, 0);
        if (!this.clicked) {
            return forceVector;
        }

        let arrowInfo = this.definition.arrow;

        // Get the current world position where the rock was clicked and update the line between there and the current moust cursor
        let clickedWorldPos = this.getWorldFromLocal(this.clickedPos.x, this.clickedPos.y);
        let pointerWorldPos = this.gameWorld.game.viewToWorld(cursorScreenPos);

        // Calculate the displacement between the cursor and rock position
        let displacement = Phaser.Point.subtract(pointerWorldPos, clickedWorldPos);
        let magnitude = displacement.getMagnitude(displacement);

        // Check if the magnitude of the displacement is above the minimum length threshold
        if  (magnitude >= arrowInfo.lengthMin) {
            // Calculate the direction unit vector of the arrow
            let direction = displacement.clone();
            direction.x = direction.x / magnitude;
            direction.y = direction.y / magnitude;

            // Calculate the angle of rotation of the direction vector
            let angle = Math.acos(direction.dot(new Phaser.Point(1, 0)));
            if (direction.y < 0) {
                angle = angle * -1;
            }

            // Calculate the length of the arrow
            let arrowLength = magnitude;
            if (magnitude > arrowInfo.lengthMax) {
                arrowLength = arrowInfo.lengthMax;
            }

            // Generate the force vector from the direction and length
            forceVector = direction;
            forceVector.multiply(arrowLength, arrowLength);
        }

        // Return the force vector
        return forceVector;
    }
}