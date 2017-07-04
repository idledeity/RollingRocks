
let screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
let screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

// Create a new Phaser Game instance
let RollingRockGame = new Phaser.Game(screenWidth, screenHeight, Phaser.AUTO, document.getElementById('game'), null, false, true);

// Add the main game state to the game and start it running!!
let mainGame = new MainGame(RollingRockGame);
mainGame.setDebugManager(new DebugManager(mainGame));

RollingRockGame.state.add('Game', mainGame);
RollingRockGame.state.start('Game');


window.onresize = function(event) {
    let screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    RollingRockGame.scale.setGameSize(screenWidth, screenHeight);
    RollingRockGame.scale.refresh();
}


