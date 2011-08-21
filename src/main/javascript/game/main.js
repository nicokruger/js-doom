var canvas, ctx;
var game;
var previousTime, currentTime, deltaTime;



function init() {

    textureLoader = new TextureLoader();
    textureLoader.load("name", "data/tiles-64.xpm.png", 64, 64);
    textureLoader.load("flat5_5", "data/flat5_5.png", 256, 256);
    textureLoader.load("floor4_8", "data/floor4_8.png", 256, 256);
    textureLoader.load("flat18", "data/flat18.png", 256, 256);
    textureLoader.load("flat20", "data/flat20.png", 256, 256);
    textureLoader.load("flat14", "data/flat14.png", 256, 256);
    textureLoader.load("floor5_1", "data/floor5_1.png", 256, 256);
    textureLoader.load("floor5_2", "data/floor5_2.png", 256, 256);
    textureLoader.load("step2", "data/step2.png", 256, 256);
    textureLoader.load("floor1_1", "data/floor1_1.png", 256, 256);
    textureLoader.load("nukage3", "data/nukage3.png", 256, 256);
    textureLoader.load("floor7_1", "data/floor7_1.png", 256, 256);

/*
    canvas = document.getElementById("canvas");
*/
    if (canvas && canvas.getContext) {
        ctx = canvas.getContext("experimental-webgl");

        document.addEventListener('mousemove', documentMouseMoveHandler, false);
        document.addEventListener('mousedown', documentMouseDownHandler, false);
        document.addEventListener('mouseup', documentMouseUpHandler, false);

        window.addEventListener('resize', windowResizeHandler, false);
        windowResizeHandler();

        //ctx.fillRect(0, 0, canvas.width, canvas.height);

        game = new Game(canvas.width, canvas.height);
        game.init();
        loop();
    }

}

function left() {
    _.last(game.screenStack).left();
    loop();
}

function right() {
    _.last(game.screenStack).right();
    loop();
}
function up() {
    _.last(game.screenStack).up();
    loop();
}
function down() {
    _.last(game.screenStack).down();
    loop();
}

function set() {
    var a = _.last(game.screenStack);

    a.x = parseInt($("#viewportx").val());
    a.y = parseInt($("#viewporty").val());

    loop();
}

function documentMouseMoveHandler(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

function documentMouseDownHandler(e) {
    mouseDown = true;
}

function documentMouseUpHandler(e) {
    mouseDown = false;
}

function windowResizeHandler() {
    //canvas.width = window.innerWidth;
    //canvas.height = window.innerHeight;
}

hack = 16;

function loop() {
  //ctx.globalCompositeOperation = "copy";
  //ctx.fillStyle = "rgba(76,76,78,1.0)";
  //ctx.fillRect(0, 0, canvas.width, canvas.height);
  //ctx,globalCompositeOperation = "source-over";
  currentTime = (Date.now());
  thisFrame1 = currentTime;
  deltaTime = currentTime - previousTime;
  game.draw(ctx);
  frameTime = (Date.now()) - thisFrame1;
  previousTime = currentTime;
  console.log("Frame took: " + frameTime);
  //setTimeout(loop, 1000);
}


