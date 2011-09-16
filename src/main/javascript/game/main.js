var canvas, ctx;
var game;
var previousTime, currentTime, deltaTime;
var gamescreen;
var draw= false;

function init() {
    canvas = document.getElementById("canvas");
    if (canvas && canvas.getContext) {
        ctx = canvas.getContext("2d");

        loadmap();
    }
}

function loadmap() {
    var map = $("#map").val();

    $.getJSON(map, function(data) {
        $("#viewport").html("Level loaded");
        game = new Game(data);

        gamescreen = new GameScreen(256, 256, data, game, __useNoClosuresViewport);

        requestAnimFrame(loop);
    }).error(function(e) {
        $("#viewport").html("Error loading level: " + e.statusText);
    });

}

function __useNoClosuresViewport(sectors,x1,y1,x2,y2) {
    return new ViewportNoClosures(sectors, x1, y1, x2, y2);
}
function __useClosuresViewport(sectors, x1, y1, x2, y2) {
    return new ViewportClosures(sectors, x1, y1, x2, y2);
}

function changerenderer() {
    var renderer = $("#renderer").val();
    
    if (renderer == "NoClosures") {
        gamescreen.viewportCreator =  __useNoClosuresViewport;
    } else {
        gamescreen.viewportCreator =  __useClosuresViewport;
    };
    
    gamescreen.setupViewport();
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


