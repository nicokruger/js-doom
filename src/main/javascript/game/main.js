

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

    
RendererGL = function(game,width,height) {
    $("#gamescreenarea").append("<canvas id=\"canvasgl\" width=\"" + width + "\" height=\"" + height + "\" />");

    var canvas = $("#canvasgl")[0];
    
    var  tmpctx = document.createElement("canvas").getContext("2d");
    tmpctx.canvas.width = width + 1;
    tmpctx.canvas.height = height + 1;    
    var data = tmpctx.createImageData(width + 1, height + 1);
    
    return {
        cleanup: function() {
            $("#canvasgl").remove();
        },
        
        create: function(sectors, x1, y1, x2, y2) {
            return new ViewportGL(sectors, x1, y1, x2, y2, data, canvas);
        }
    }
        
};
            

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
