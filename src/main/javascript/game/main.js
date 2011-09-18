

var SCREEN_WIDTH = 1024;
var SCREEN_HEIGHT = 1024;

var canvas, ctx;
var game;
var previousTime, currentTime, deltaTime;
var gamescreen;
var draw= false;
var old_renderer = null;

var renderer = null;

function init() {
    canvas = document.getElementById("canvas");
    if (canvas && canvas.getContext) {
        ctx = canvas.getContext("2d");

        loadmap();
    }
}

Renderer2D = function(width,height) {
    $("#gamescreenarea").append("<canvas id=\"canvas\" width=\"" + width + "\" height=\"" + height + "\" />");
    var ctx = document.getElementById("canvas").getContext("2d");
    var data = ctx.createImageData(width + 1, height + 1);
    
    return {
        cleanup: function() {
            $("#canvas").remove();
        },
        
        create: function(sectors, x1, y1, x2, y2) {
            return new Viewport(sectors, x1, y1, x2, y2, data,document.getElementById("canvas").getContext("2d"));
        }
    }
        
};
    
RendererGL = function(width,height) {
    $("#gamescreenarea").append("<canvas id=\"canvas\" width=\"" + width + "\" height=\"" + height + "\" />");

    var  tmpctx = document.createElement("canvas").getContext("2d");
    tmpctx.canvas.width = this.width;
    tmpctx.canvas.height = this.height;    
    var data = ctx.createImageData(width + 1, height + 1);
    
    return {
        cleanup: function() {
            $("#canvas").remove();
        },
        
        create: function(sectors, x1, y1, x2, y2) {
            return new ViewportGL(sectors, x1, y1, x2, y2, data);
        }
    }
        
};

RendererCanvas = function(width,height) {
    $("#gamescreenarea").append("<canvas id=\"canvas\" width=\"" + width + "\" height=\"" + height + "\" />");
    
    return {
        cleanup: function() {
            $("#canvas").remove();
        },
        
        create: function(sectors, x1, y1, x2, y2) {
            return new ViewportCanvas(sectors, x1, y1, x2, y2, document.getElementById("canvas").getContext("2d"));
        }
    }
};

function loadmap() {
    var map = $("#map").val();

    $.getJSON(map, function(data) {
        $("#viewport").html("Level loaded");
        game = new Game(data);

        renderer = Renderer2D(SCREEN_WIDTH,SCREEN_HEIGHT);
        
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
    
    eval("renderer = " + r + "(" + SCREEN_WIDTH + ", " + SCREEN_HEIGHT + ");");
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
    //requestAnimFrame(loop);
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


