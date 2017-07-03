
// Create a new Phaser Game instance
let RollingRockGame = new Phaser.Game(512, 600, Phaser.CANVAS, document.getElementById('game'), null, false, true);

// Add the main game state to the game and start it running!!
RollingRockGame.state.add('Game', new MainGame(RollingRockGame));
RollingRockGame.state.start('Game');

