

var SCREEN_WIDTH = 1024;
var SCREEN_HEIGHT = 1024;

var canvas, ctx;
var game;
var previousTime, currentTime, deltaTime;
var gamescreen;
var draw= false;
var renderer = null;
        

function init() {
    loadmap();
}

    
function loadmap() {
    var map = $("#map").val();

    $.getJSON(map, function(data) {
        $("#viewport").html("Level loaded");
        game = new Game(data);
        
        createrenderer();
        
        gamescreen = new GameScreen(SCREEN_WIDTH, SCREEN_HEIGHT, data, game, renderer.create);
        

        requestAnimFrame(loop);
    }).error(function(e) {
        $("#viewport").html("Error loading level: " + e.statusText);
    });

}

function createrenderer() {
    var r = $("#renderer").val();

    if (renderer != null) {
        renderer.cleanup();
    };
    
    // this builds up a string which calls a renderer creation function
    eval("renderer = " + r + "(game, " + SCREEN_WIDTH + ", " + SCREEN_HEIGHT + ");");
}

function changerenderer() {
    createrenderer();
    gamescreen.viewportCreator = renderer.create;
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
}

function set() {
    game.setCenter(parseInt($("#viewportx")), parseInt($("#viewporty")));
}

var prevTime = (new Date()).getTime();
function loop() {
    if (draw) {
        var elapsedTime = (new Date()).getTime() - prevTime;
        if (elapsedTime > 100) { // 10 FPS
            gamescreen.tick();
            prevTime = (new Date()).getTime();
        }
        gamescreen.draw();
   }
    
    requestAnimFrame(loop);
}



$(init());
