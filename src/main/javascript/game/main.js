

var SCREEN_WIDTH = 1024;
var SCREEN_HEIGHT = 1024;

var canvas, ctx;
var game;
var previousTime, currentTime, deltaTime;
var gamescreen;
var draw= false;
var old_renderer = null;

var renderer;
        

function init() {
    renderer = Renderer2D(game, SCREEN_WIDTH,SCREEN_HEIGHT);
    loadmap();
}

Renderer2D = function(game,width,height) {
    $("#gamescreenarea").append("<canvas id=\"canvas2d\" width=\"" + width + "\" height=\"" + height + "\" />");
    var ctx = $("#canvas2d")[0].getContext("2d");
    var data = ctx.createImageData(width + 1, height + 1);
    
    return {
        cleanup: function() {
            $("#canvas2d").remove();
        },
        
        create: function(sectors, x1, y1, x2, y2) {
            return new Viewport(sectors, x1, y1, x2, y2, data,ctx);
        }
    }
        
};
    
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

RendererCanvas = function(game,width,height) {
    $("#gamescreenarea").append("<div id=\"viewport\" width=\"" + width + "\" height=\"" + height + "\" ><canvas id=\"canvas\" width=\"" + (game.extents.x2 - game.extents.x1)+ "\" height=\"" + (game.extents.y2 - game.extents.y1) + "\"></canvas></div>");
    
    return {
        cleanup: function() {
            $("#canvas").remove();
        },
        
        create: function(sectors, x1, y1, x2, y2) {
            var width = game.extents.x2 - game.extents.x1;
            var height = game.extents.y2 - game.extents.y1;
            $("#viewport").scrollTop(y1);
            $("#viewport").scrollLeft(x1);
            return new ViewportCanvas(sectors, game.extents.x1, game.extents.x2, game.extents.y1, game.extents.y2, 
                $("#canvas")[0].getContext("2d"));
        }
    }
};

function loadmap() {
    var map = $("#map").val();

    $.getJSON(map, function(data) {
        $("#viewport").html("Level loaded");
        game = new Game(data);

        gamescreen = new GameScreen(SCREEN_WIDTH, SCREEN_HEIGHT, data, game, renderer.create);
        

        requestAnimFrame(loop);
    }).error(function(e) {
        $("#viewport").html("Error loading level: " + e.statusText);
    });

}

function changerenderer() {
    
    var r = $("#renderer").val();

    if (renderer != null) {
        renderer.cleanup();
    };
    
    // this builds up a string which calls a renderer creation function
    eval("renderer = " + r + "(game, " + SCREEN_WIDTH + ", " + SCREEN_HEIGHT + ");");
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

function loop() {
    if (draw) gamescreen.draw();
    
    requestAnimFrame(loop);
}


