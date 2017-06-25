
var Game = {};
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
    Game.rock.collisionBody = Matter.Bodies.fromVertices(200, 200, Matter.Vertices.create([
        { x: 0, y: 7 }, 
        { x: 4, y: 3 }, 
        { x: 35, y: 3 },
        { x: 37, y: 0 },
        { x: 49, y: 0 },
        { x: 51, y: 4 },
        { x: 51, y: 10 },
        { x: 47, y: 21 },
        { x: 47, y: 26 },
        { x: 42, y: 33 },
        { x: 29, y: 37 },
        { x: 15, y: 37 },
        { x: 9, y: 34 },
        { x: 9, y: 29 },
        { x: 6, y: 23 },
        { x: 2, y: 19 },
        { x: 0, y: 14 },
    ]));
    Matter.World.add(Game.physics.engine.world, Game.rock.collisionBody);
    Game.rock.sprite = game.add.sprite(100, 200,'rock');
    
    // Adjust the anchor of the sprite to the center of mass of the collision body
    let centerOfMassOffset = Matter.Vector.sub(Game.rock.collisionBody.position, Game.rock.collisionBody.bounds.min);
    let boundingExtends = Matter.Vector.sub(Game.rock.collisionBody.bounds.max, Game.rock.collisionBody.bounds.min);
    var anchorX = centerOfMassOffset.x / boundingExtends.x;
    var anchorY = centerOfMassOffset.y / boundingExtends.y;
    Game.rock.sprite.anchor.setTo(anchorX, anchorY);

    // Give the rock an initial kick to make things interesting
    Matter.Body.setAngularVelocity(Game.rock.collisionBody, 0.25);
};

Game.update = function(){
    // Update physics
    Matter.Engine.update(Game.physics.engine, game.time.physicsElapsedMS);

    // Move the sprite coordinates to the physics coordinates
    Game.rock.sprite.x = Game.rock.collisionBody.position.x;
    Game.rock.sprite.y = Game.rock.collisionBody.position.y;
    Game.rock.sprite.angle = Game.rock.collisionBody.angle * 180 / 3.14;
}

Game.render = function(){
    // Render the physics world as a post process step
    Matter.Render.world(Game.matterRender);
}
