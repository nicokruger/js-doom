var canvas, ctx;
var game;
var previousTime, currentTime, deltaTime;



function init() {

    textureLoader = new TextureLoader();

    canvas = document.getElementById("canvas");
    if (canvas && canvas.getContext) {
        ctx = canvas.getContext("2d");

        window.addEventListener('resize', windowResizeHandler, false);
        windowResizeHandler();

        //ctx.fillRect(0, 0, canvas.width, canvas.height);

        $.getJSON("data/map01.json", function(data) {
            $("#viewport").html("Level loaded");
            startGame(data);
        }).error(function(e) {
            $("#viewport").html("Error loading level: " + e.statusText);
        });
    }

}

function startGame(data) {
    game = new Game(canvas.width, canvas.height, data);

    requestAnimFrame(loop);
}

function left() {
    _.last(game.screenStack).left();
}

function right() {
    _.last(game.screenStack).right();
}
function up() {
    _.last(game.screenStack).up();
}
function down() {
    _.last(game.screenStack).down();
}

function set() {
    var a = _.last(game.screenStack);

    a.x = parseInt($("#viewportx").val());
    a.y = parseInt($("#viewporty").val());

}

function loadmap() {
    var map = $("#map").val();
    alert("Loading: " + map);

    $.getJSON(map, function(data) {
        $("#viewport").html("Level loaded");
        startGame(data);
    }).error(function(e) {
        $("#viewport").html("Error loading level: " + e.statusText);
    });

}

function documentMouseMoveHandler(e) {
    game.mouseMove(e.clientX, e.clientY);
}

function documentMouseDownHandler(e) {
    game.mouseDown(e.clientX, e.clientY);
    mouseDown = true;
}

function documentMouseUpHandler(e) {
    game.mouseUp(e.clientX, e.clientY);
    mouseDown = false;
}

function windowResizeHandler() {
    //canvas.width = window.innerWidth;
    //canvas.height = window.innerHeight;
}

hack = 16;

function loop() {
  game.draw(ctx);
  requestAnimFrame(loop);
}


