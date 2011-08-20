Sector = function (poly, label, texture) {

    this.texture = texture;
    this.poly = poly;
    this.label = label;

    this.width = poly.width;
    this.height = poly.height;
    this.x1 = poly.extremes.x1;
    this.y1 = poly.extremes.y1;

    this.rays = [];
    for (var y = 0; y < this.height; y++) {
        this.rays.push(poly.partition($L($V(this.x1-1, y+this.y1), $V(this.x1+this.width+1, y+this.y1))))
    }

    this.ctx = document.createElement("canvas").getContext("2d");
    this.ctx.canvas.width = this.width;
    this.ctx.canvas.height = this.height;

}

Sector.prototype.updateComponents = function(x) {
}

Sector.prototype.draw = function(viewport_x, viewport_y, ctx) {

    // TODO: handle at some pre-processing step.
    if (this.width == 0 || this.height == 0) {
        return;
    }

    Timer.substart("get image buffer");
    var data = this.ctx.createImageData(this.width,this.height);
    Timer.subend();

    Timer.substart("rasterization");
    for (var y = 0; y < this.height; y++) {
      textureLoader.texture[this.texture].repeat.rasterize(data, y, this.rays[y], this.poly);
    }
    Timer.subend();

    Timer.substart("Put image buffer");
    this.ctx.putImageData(data, 0, 0);
    Timer.subend();
    Timer.substart("Draw image onto screen")
    ctx.drawImage(this.ctx.canvas, this.x1 - viewport_x , this.y1 - viewport_y);
    Timer.subend();

    Timer.substart("sector rest");
    drawPoly(viewport_x, viewport_y, ctx, this.label, this.poly, "#0000ff");
    Timer.subend();
}

function drawTexture(ctx, poly, texture) {

  var width = poly.width;
  var height = poly.height;
  var x1 = poly.extremes.x1;
  var y1 = poly.extremes.y1;

  // TODO: handle at some pre-processing step.
  if (width == 0 || height == 0) {
    return;
  }

  Timer.substart("retrieve image buffer");
  var data = ctx.getImageData(x1,y1, width,height);
  Timer.subend();

  for (var y = 0; y < height; y++) {
      Timer.substart("partition");
      var ray = poly.partition($L($V(x1-1, y+y1), $V(x1+width+1, y+y1)));
      Timer.subend();

      Timer.substart("rasterizing");
      texture.rasterize(data, y, ray, poly);
      Timer.subend();
  }

  Timer.substart("put image buffer");
  ctx.putImageData(data, x1, y1);
  Timer.subend();
}

/**
 * For testing only.
 */
function drawPoly(viewport_x, viewport_y, ctx, label, poly, colour) {
    ctx.strokeStyle = colour;
    ctx.beginPath();
    poly.edges.forEach(function (edge) {
        ctx.moveTo(edge.origin.x - viewport_x, edge.origin.y - viewport_y);
        ctx.lineTo(edge.end.x - viewport_x, edge.end.y - viewport_y);
    });
    ctx.stroke();

    ctx.fillStyle = "rgba(220, 220, 220, 1)";
    ctx.font = "bold 12px sans-serif";
    var x = poly.extremes.x1 - viewport_x;
    var y = poly.extremes.y1 - viewport_y;

    ctx.fillText(label, x, y);

}


