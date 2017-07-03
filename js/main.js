
// Create a new Phaser Game instance
let RollingRockGame = new Phaser.Game(512, 600, Phaser.CANVAS, document.getElementById('game'), null, false, true);

// Add the main game state to the game and start it running!!
let mainGame = new MainGame(RollingRockGame);
mainGame.setDebugManager(new DebugManager(mainGame));

RollingRockGame.state.add('Game', mainGame);
RollingRockGame.state.start('Game');

