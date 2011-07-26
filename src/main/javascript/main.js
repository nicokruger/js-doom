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
        loop();
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
    drawPoly(ctx, P1, "#ff00ff");
    if (hack == 26) {
        hack = 26;
    }
    var P2 = circle_to_poly([150.0, 150.0], 50.0, 64);

/*    hack += 1;
    var I1 = P1.intersection(P2);
    if (I1.area() < 10) {
        alert("failed at: " + hack);
    } else {
        drawPoly(ctx, I1, "#ff00ff");
        drawPoly(ctx, P2, "#ffff00");
    };                       */

    drawTexture(ctx, P2, "");

/*    ctx.fillStyle = "rgba(220, 220, 220, 1)";
    ctx.font = "bold 12px sans-serif";
    console.log("V: " + hack);
    ctx.fillText("[" + hack +"]", 400, 400);*/

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


  function drawTexture(ctx, poly, colour) {
      var width = 100;
      var height = 100;
      var data = ctx.createImageData(width,height);

      for (var y = 0; y < 100; y++) {
          var ray = poly.partition($L($V(50, 100 + y), $V(250, 100 + y)));

          ray.neg.forEach (function (seg) {
              for (var x = seg.origin.x; x < seg.end.x; x++) {
                var index = (x + y * width) * 4;
                data.data[index + 0] = 255;
                data.data[index + 1] = 255;
                data.data[index + 2] = 0;
                data.data[index + 3] = 128;
              }
          })
      }

      ctx.putImageData(data, 10, 10);
    }

//var timer = setInterval(loop, 100000);
init();
