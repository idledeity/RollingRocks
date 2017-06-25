
var game = new Phaser.Game(512, 600, Phaser.CANVAS, document.getElementById('game'));
game.state.add('Game', Game);
game.state.start('Game');

