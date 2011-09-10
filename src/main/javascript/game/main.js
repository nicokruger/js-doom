var canvas, ctx;
var game;
var previousTime, currentTime, deltaTime;
var gamescreen;
var draw= false;

function init() {
    canvas = document.getElementById("canvas");
    if (canvas && canvas.getContext) {
        ctx = canvas.getContext("2d");

        loadMap();
    }
}

function loadMap() {
    var map = $("#map").val();
    alert("Loading: " + map);

    $.getJSON(map, function(data) {
        $("#viewport").html("Level loaded");
        game = new Game(data);

        gamescreen = new GameScreen(canvas.width, canvas.height, data, game);

        requestAnimFrame(loop);
    }).error(function(e) {
        $("#viewport").html("Error loading level: " + e.statusText);
    });

}

function left() {
    gamescreen.left();
}
function right() {
    gamescreen.right();
}
function up() {
    gamescreen.up();
}
function down() {
    gamescreen.down();
}

function d() {
    draw = !draw;
    //requestAnimFrame(loop);
}

function set() {
    game.setCenter(parseInt($("#viewportx")), parseInt($("#viewporty")));
}

function loop() {
    if (draw) gamescreen.draw();
    
    requestAnimFrame(loop);
}


