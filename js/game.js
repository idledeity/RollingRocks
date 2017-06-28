
let Game = {};
Game.init = function(){
    // Response to messages without focus
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
    game.load.pack('rock', 'assets/packs/rock.json', null, this);
};

Game.create = function(){
    game.stage.backgroundColor = "#4488AA";

    // Store a reference to the phaser game instance
    Game.phaserGame = game;

    // Create the game's physics
    Game.physics = {};
    Game.physics.engine = Matter.Engine.create();

    // Create a renderer for physics debug rendering
    Game.matterRender = Matter.Render.create({
        //element: document.body,
        canvas: game.canvas,
        context: game.context,
        engine: Game.physics.engine,
        options: {
            width: 512,
            height: 600,
            clearCanvas: false,
        }
    });

    Game.objects = [];

    // Create a static physics shape for the ground
    Game.ground = Matter.Bodies.rectangle(500, 800, 8100, 600, { isStatic: true });
    Matter.World.add(Game.physics.engine.world, Game.ground);

    // Create the rock
    Game.rock = new GameObject("objects/rock.json", this, 50, 50);
    Game.objects.push(Game.rock);

    // Enable input handling on the rock
    Game.rock.sprite.inputEnabled = true;
    Game.rock.sprite.events.onInputDown.add(Game.handleRockClicked, this);
    Game.rock.sprite.events.onInputUp.add(Game.handleRockUnclicked, this);
    
    // Give the rock an initial kick to make things interesting
    Matter.Body.setAngularVelocity(Game.rock.rigidBody, 0.35);
};

Game.update = function() {
    // Update physics
    Matter.Engine.update(Game.physics.engine, game.time.physicsElapsedMS);

    // Update objects
    for (objectIdx = 0; objectIdx < Game.objects.length; objectIdx++) {
        Game.objects[objectIdx].update();
    }

    // Update the force line
    if (Game.rockClicked) {
        let worldPos = Game.rock.getWorldFromLocal(Game.rockClickedPos.x, Game.rockClickedPos.y);

        Game.forceLine.setTo(worldPos.x, worldPos.y, Game.input.mousePointer.x, Game.input.mousePointer.y)
    }
}

Game.render = function() {
    if (Game.rockClicked) {
        game.debug.geom(Game.forceLine);
    }

    // Render the physics world as a post process step
    Matter.Render.world(Game.matterRender);
}

Game.handleRockClicked = function(clickedObj, pointer) {
    // Do a finer check to see if the rock was actually clicked
    if (!Matter.Vertices.contains(Game.rock.rigidBody.vertices, pointer)) {
        return;
    }

    // Store the location where the rock was clicked
    Game.rockClicked = true;
    Game.rockClickedPos = Game.rock.getLocalFromWorld(pointer.x, pointer.y);
    Game.forceLine = new Phaser.Line(pointer.x, pointer.y, pointer.x, pointer.y);
}

Game.handleRockUnclicked = function(clickedObj, pointer) {
    if (!Game.rockClicked) {
        return;
    }

    // Transform the stored rock clicked position into a world position
    let worldPos = Game.rock.getWorldFromLocal(Game.rockClickedPos.x, Game.rockClickedPos.y);
    
    // Generate a force from the clicked position and the current cursor position
    let force = Phaser.Point.subtract(pointer, worldPos); 
    force.divide(1000, 1000); // scale the force
    Matter.Body.applyForce(Game.rock.rigidBody, worldPos, force);
    
    Game.rockClicked = false;
    Game.forceLine = null;
}
