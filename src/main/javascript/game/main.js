

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

Renderer2D = function(game,width,height) {
    $("#gamescreenarea").append("<canvas id=\"canvas2d\" width=\"" + width + "\" height=\"" + height + "\" />");
    var ctx = $("#canvas2d")[0].getContext("2d");
    var data = ctx.createImageData(width + 1, height + 1);
    
    return {
        cleanup: function() {
            $("#canvas2d").remove();
        },
        
        create: function(sectors, x1, y1, x2, y2) {
            return new Viewport2D(sectors, x1, y1, x2, y2, data,ctx);
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

RendererFullCanvas = function(game,width,height) {
    var game_width = game.extents.x2 - game.extents.x1 + width;
    var game_height = game.extents.y2 - game.extents.y1 + height;
    
    var prev_gamescreen_width = $("#gamescreenarea").width();
    var prev_gamescreen_height = $("#gamescreenarea").height();
    var prev_gamescreen_scroll = $("#gamescreenarea").css("overflow");
    
    $("#gamescreenarea").css("overflow", "scroll");
    $("#gamescreenarea").width(width);
    $("#gamescreenarea").height(height);
    
    $("#gamescreenarea").append("<canvas id=\"canvas\" width=\"" + game_width + "\" height=\"" + game_height + "\"></canvas></div>");

    return {
        cleanup: function() {
            $("#canvas").remove();
            $("#gamescreenarea").css("overflow", prev_gamescreen_scroll);
            $("#gamescreenarea").width(prev_gamescreen_width);
            $("#gamescreenarea").height(prev_gamescreen_height);
        },
        
        create: function(sectors, x1, y1, x2, y2) {
            var half_viewportwidth = Math.round(width/2, 0);
            var half_viewportheight = Math.round(height/2, 0);
            var c2s = new Cartesian2Screen(game.extents.x1 - half_viewportwidth, 
                game.extents.y1 - half_viewportheight, 
                game.extents.x2 + half_viewportwidth, 
                game.extents.y2 + half_viewportheight);
            return new ViewportFullCanvas(sectors, c2s, x1,y2, $("#canvas")[0].getContext("2d"));
        }
    }
};
            
RendererBackingCanvas = function(game,width,height) {
    var extents_width = game.extents.x2 - game.extents.x1 + width;
    var extents_height = game.extents.y2 - game.extents.y1 + height;
    $("#gamescreenarea").append("<canvas id=\"canvas\" width=\"" + width + "\" height=\"" + height + "\" />");
    $("#gamescreenarea").append("<canvas id=\"canvas_hidden\" width=\"" + extents_width +"\" height=\"" + extents_height + "\" style=\"display: none\"/>");
    
    return {
        cleanup: function() {
            $("#canvas").remove();
            $("#canvas_hidden").remove();
        },
        
        create: function(sectors, x1, y1, x2, y2) {
            var half_viewportwidth = Math.round(width/2, 0);
            var half_viewportheight = Math.round(height/2, 0);
            var c2s = new Cartesian2Screen(game.extents.x1 - half_viewportwidth, 
                game.extents.y1 - half_viewportheight, 
                game.extents.x2 + half_viewportwidth, 
                game.extents.y2 + half_viewportheight);
            return new ViewportBackingCanvas(sectors, x1,y1, x2, y2,
                c2s,
                document.getElementById("canvas").getContext("2d"),
                document.getElementById("canvas_hidden").getContext("2d"));
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
