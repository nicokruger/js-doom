var canvas, ctx;
var game;
var previousTime, currentTime, deltaTime;
textureLoader = new TextureLoader();
textureLoader.load("name", "textures/tiles-64.xpm.png", 64, 64);


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
    var P1 = $P($V(100,100), $V(200,100), $V(200,200),$V(100,200));
    drawPoly(ctx, P1, "#ff00ff");
    if (hack == 26) {
        hack = 26;
    }
    var P2 = circle_to_poly([150.0, 150.0], 32, 32);

    drawTexture(ctx, P2, textureLoader.texture["name"]);
    drawPoly(ctx, P2, "#ffff00");

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


  function drawTexture(ctx, poly, texture) {

      var width = poly.width;
      var height = poly.height;
      var data = ctx.createImageData(width,height);

      var x1 = poly.extremes.x1;
      var y1 = poly.extremes.y1;

      for (var y = 0; y < height; y++) {
          var ray = poly.partition($L($V(x1-1, y+y1), $V(x1+width+1, y+y1)));

          ray.neg.forEach (function (seg) {
                ctx.strokeStyle = "#00ff00";
                ctx.beginPath();
                ctx.moveTo(seg.origin.x, y);
                ctx.lineTo(seg.end.x, y);
                ctx.stroke();

              var rx1 = Math.round(seg.origin.x, 0);
              var rx2 = Math.round(seg.end.x, 0);

              for (var scanx = rx1; scanx < rx2; scanx++) {
                var x = scanx-x1;
                var index = (x + y * width) * 4;

                data.data[index + 0] = texture.r(x,y);
                data.data[index + 1] = texture.g(x,y);
                data.data[index + 2] = texture.b(x,y);
                data.data[index + 3] = 255;
              }
          })
      }

      ctx.putImageData(data, x1, y1);

    }

var timer = setInterval(loop, 1000);
init();
