var canvas, ctx;
var game;
var previousTime, currentTime, deltaTime;

function init() {
    canvas = document.getElementById("canvas");
    if (canvas && canvas.getContext) {
        ctx = canvas.getContext("2d");

        document.addEventListener('mousemove', documentMouseMoveHandler, false);
        document.addEventListener('mousedown', documentMouseDownHandler, false);
        document.addEventListener('mouseup', documentMouseUpHandler, false);

        window.addEventListener('resize', windowResizeHandler, false);
        windowResizeHandler();

        ctx.fillRect(0, 0, canvas.width, canvas.height);

        game = new Game();
        game.init();
    }
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
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

hack = 16;

function loop() {
  ctx.fillStyle = "rgba(76,76,78,0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  currentTime = (Date.now());
  deltaTime = currentTime - previousTime;
    var P1 = $P($V(100,200), $V(200,200), $V(200,300),$V(100,300));
    var P2 = circle_to_poly([100.0, 229.0], 120.0, hack);
    hack += 1;
    var I1 = P1.intersection(P2);
    if (I1.area() < 10) {
        alert("failed at: " + hack);
    } else {
        drawPoly(ctx, I1, "#ff00ff");
        drawPoly(ctx, P2, "#ffff00");
    };

  if (hack > 29) { hack = 29 };
  previousTime = currentTime;
}

  function drawPoly(ctx, poly, colour) {

    ctx.strokeStyle = colour;
    ctx.beginPath();
    poly.edges.forEach(function (edge) {
        ctx.moveTo(edge.origin.x, edge.origin.y);
        ctx.lineTo(edge.end.x, edge.end.y);
    });
    ctx.stroke();
  }

var timer = setInterval(loop, 1000);
init();
