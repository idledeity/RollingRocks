
let Game = {};
Game.init = function(){
    // Response to messages without focus
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
    game.load.image('rock','assets/sprites/rock.png'); // this will be the sprite of the players
};

Game.create = function(){
    game.stage.backgroundColor = "#4488AA";

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

    // Create a static physics shape for the ground
    Game.ground = Matter.Bodies.rectangle(500, 800, 8100, 600, { isStatic: true });
    Matter.World.add(Game.physics.engine.world, Game.ground);

    // Create the rock
    Game.rock = {};
    Game.rock.collisionBody = Matter.Bodies.fromVertices(200, 100, Matter.Vertices.create([
        { x: 4, y: 75 },
        { x: 2, y: 73 },
        { x: 0, y: 67 },
        { x: 0, y: 54 },
        { x: 2, y: 46 },
        { x: 6, y: 34 },
        { x: 8, y: 22 },
        { x: 10, y: 18 },
        { x: 12, y: 16 },
        { x: 14, y: 12 },
        { x: 18, y: 8 },
        { x: 23, y: 8 },
        { x: 30, y: 4 },
        { x: 40, y: 2 },
        { x: 44, y: 0 },
        { x: 73, y: 0 },
        { x: 83, y: 4 },
        { x: 85, y: 6 },
        { x: 87, y: 18 },
        { x: 89, y: 24 },
        { x: 91, y: 28 },
        { x: 99, y: 36 },
        { x: 101, y: 40 },
        { x: 103, y: 46 },
        { x: 103, y: 61 },
        { x: 95, y: 69 },
        { x: 32, y: 69 },
        { x: 31, y: 73 },
        { x: 29, y: 75 }
    ]));
    Matter.World.add(Game.physics.engine.world, Game.rock.collisionBody);
    Game.rock.sprite = game.add.sprite(100, 200,'rock');
    Game.rock.sprite.inputEnabled = true;
    Game.rock.sprite.events.onInputDown.add(Game.handleRockClicked, this);
    Game.rock.sprite.events.onInputUp.add(Game.handleRockUnclicked, this);
    
    // Adjust the anchor of the sprite to the center of mass of the collision body
    let centerOfMassOffset = Matter.Vector.sub(Game.rock.collisionBody.position, Game.rock.collisionBody.bounds.min);
    let boundingExtends = Matter.Vector.sub(Game.rock.collisionBody.bounds.max, Game.rock.collisionBody.bounds.min);
    let anchorX = centerOfMassOffset.x / boundingExtends.x;
    let anchorY = centerOfMassOffset.y / boundingExtends.y;
    Game.rock.sprite.anchor.setTo(anchorX, anchorY);

    // Give the rock an initial kick to make things interesting
    Matter.Body.setAngularVelocity(Game.rock.collisionBody, 0.35);
};

Game.update = function() {
    // Update physics
    Matter.Engine.update(Game.physics.engine, game.time.physicsElapsedMS);

    // Move the sprite coordinates to the physics coordinates
    Game.rock.sprite.x = Game.rock.collisionBody.position.x;
    Game.rock.sprite.y = Game.rock.collisionBody.position.y;
    Game.rock.sprite.angle = Game.rock.collisionBody.angle * 180 / 3.14;

    // Update the force line
    if (Game.rockClicked) {
        let localPos = new Phaser.Point(Game.rockClickedPos.x, Game.rockClickedPos.y);
        localPos.subtract(Game.rock.sprite.offsetX, Game.rock.sprite.offsetY);
        let rotationMatrix = new Phaser.Matrix();
        rotationMatrix.rotate(Game.rock.sprite.rotation);
        let transformPos = rotationMatrix.apply(localPos);
        let worldPos = Phaser.Point.add(transformPos, Game.rock.sprite.position);

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
    if (!Matter.Vertices.contains(Game.rock.collisionBody.vertices, pointer)) {
        return;
    }

    // Transform from the click position in world coordinates to the object's local coordinates
    let worldPos = new Phaser.Point(pointer.x, pointer.y);
    let transformPos = Phaser.Point.subtract(worldPos, clickedObj.world);
    let rotationMatrix = new Phaser.Matrix();
    rotationMatrix.rotate(clickedObj.rotation);
    let localPos = rotationMatrix.applyInverse(transformPos);
    localPos.add(Game.rock.sprite.offsetX, Game.rock.sprite.offsetY);

    // Store the location where the rock was clicked
    Game.rockClicked = true;
    Game.rockClickedPos = localPos;
    Game.forceLine = new Phaser.Line(pointer.x, pointer.y, pointer.x, pointer.y);
}

Game.handleRockUnclicked = function(clickedObj, pointer) {
    if (!Game.rockClicked) {
        return;
    }

    // Transform the stored rock clicked position into a world position
    let localPos = new Phaser.Point(Game.rockClickedPos.x, Game.rockClickedPos.y);
    localPos.subtract(Game.rock.sprite.offsetX, Game.rock.sprite.offsetY);
    let rotationMatrix = new Phaser.Matrix();
    rotationMatrix.rotate(Game.rock.sprite.rotation);
    let transformPos = rotationMatrix.apply(localPos);
    let worldPos = Phaser.Point.add(transformPos, Game.rock.sprite.position);
    
    // Generate a force from the clicked position and the current cursor position
    let force = Phaser.Point.subtract(pointer, worldPos); 
    force.divide(1000, 1000); // scale the force
    Matter.Body.applyForce(Game.rock.collisionBody, worldPos, force);
    
    Game.rockClicked = false;
    Game.forceLine = null;
}
