
/**
 * Class for the main game state/loop
 */
class MainGame {
    /**
     * Constructor
     * @param {Phaser.Game} phaserGame - The Phaser game instnace
     */
    constructor(phaserGame) {
        this.phaserGame = phaserGame;

        // Create a new game world
        this.gameWorld = new GameWorld(phaserGame, 512, 600);
    }

    /**
     * Called before create() to request any assets that should are required
     */
    preload() {
        // Let the game world do any necessary preloading
        this.gameWorld.preload();

        // Load the rock assets
        this.phaserGame.load.pack('rock', 'assets/packs/rock.json', null, this);
    }

    /**
     * Called after preload() once assets have been loaded and before the main update/render functions for any asset dependent initialization
     */
    create() {
        // Set the background color on the canvas
        this.phaserGame.stage.backgroundColor = "#4488AA";
        
        // Create the gameworld
        this.gameWorld.create();

        // Create a static physics shape for the ground
        this.ground = Matter.Bodies.rectangle(500, 800, 8100, 600, { isStatic: true });
        this.gameWorld.getPhysicsWorld().addBody(this.ground);

        // Create the rock
        this.rock = new GameObject("objects/rock.json", this, 50, 50);
        this.gameWorld.addObject(this.rock);

        // Enable input handling on the rock
        this.rock.sprite.inputEnabled = true;
        this.rock.sprite.events.onInputDown.add(this.handleRockClicked, this);
        this.rock.sprite.events.onInputUp.add(this.handleRockUnclicked, this);
        
        // Give the rock an initial kick to make things interesting
        Matter.Body.setAngularVelocity(this.rock.rigidBody, 0.35);
    }

    /**
     * Update function called once each frame for any per-frame updating
     */
    update() {
        // Update the game world
        this.gameWorld.update();

        // Update the force line if the rock has been clicked
        if (this.rockClicked) {
            // Get the current world position where the rock was clicked and update line between there and the current moust cursor 
            let worldPos = this.rock.getWorldFromLocal(this.rockClickedPos.x, this.rockClickedPos.y);
            this.forceLine.setTo(worldPos.x, worldPos.y, this.phaserGame.input.mousePointer.x, this.phaserGame.input.mousePointer.y)
        }        
    }

    /**
     * Render function called once each frame after update() to handle and post rendering
     */
    render() {
        // Allow the gameworld to render anything it needs to
        this.gameWorld.render();

        // If the rock has been clicked, render the force line
        if (this.rockClicked) {
            this.phaserGame.debug.geom(this.forceLine);
        }
    }

    /**
     * Callback function for when the rock object has been clicked
     * @param {Phaser.Object} clickedObj - The Phaser entity that was clicked (aka the rock!)
     * @param {Phaser.Pointer} pointer - The pointer that clicked the rock 
     */
    handleRockClicked(clickedObj, pointer) {
        // Do a finer check to see if the rock was actually clicked
        if (!Matter.Vertices.contains(this.rock.rigidBody.vertices, pointer)) {
            return;
        }

        // Store the location where the rock was clicked
        this.rockClicked = true;
        this.rockClickedPos = this.rock.getLocalFromWorld(pointer.x, pointer.y);
        this.forceLine = new Phaser.Line(pointer.x, pointer.y, pointer.x, pointer.y);
    }

    /**
     * Callback function for when the rock object has been un-clicked
     * @param {Phaser.Object} clickedObj - The Phaser entity that was clicked (aka the rock!)
     * @param {Phaser.Pointer} pointer - The pointer that clicked the rock 
     */
    handleRockUnclicked(clickedObj, pointer) {
        // If the rock hasn't previously been clicked, then nothing to do
        if (!this.rockClicked) {
            return;
        }

        // Transform the stored rock clicked position into a world position
        let worldPos = this.rock.getWorldFromLocal(this.rockClickedPos.x, this.rockClickedPos.y);
        
        // Generate a force from the clicked position and the current cursor position
        let force = Phaser.Point.subtract(pointer, worldPos); 
        force.divide(1000, 1000); // scale the force
        Matter.Body.applyForce(this.rock.rigidBody, worldPos, force);
        
        // Clear the rock clicked flag and force line
        this.rockClicked = false;
        this.forceLine = null;
    }
}

