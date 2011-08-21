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
    this.ctx.canvas.width = 256;
    this.ctx.canvas.height = 256;

}

Sector.prototype.updateComponents = function(x) {
}

Sector.prototype.draw = function(viewport, ctx) {

    // TODO: handle at some pre-processing step.
    if (this.width == 0 || this.height == 0) {
        return;
    }

    var y1 = _.max([this.y1, viewport[1]]);
    var y2 = _.min([this.y1 + this.height, viewport[3]]);
    var x1 = _.max([this.x1, viewport[0]]);
    var x2 = _.min([this.x1 + this.width, viewport[2]]);

    Timer.substart("get image buffer");
    var data = this.ctx.createImageData(256,256);
    for (var i = 0; i < data.data.length; i++)
        data.data[i] = 255;

    Timer.subend();

    Timer.substart("rasterization");
    for (var y = y1 - this.y1; y < y2 - this.y1; y++) {
      textureLoader.texture[this.texture].repeat.rasterize(data,
        y, this.rays[y],
        this.poly, x1, x2);
    }
    Timer.subend();

    Timer.substart("Put image buffer");

/*
    this.ctx = document.createElement("canvas").getContext("2d");
    this.ctx.canvas.width = 256;
    this.ctx.canvas.height = 256;
    var data = this.ctx.createImageData(this.width,this.height);
    for (var i = 0; i < data.data.length; i++)
        data.data[i] = 129;
*/
    this.ctx.putImageData(data, 0, 0);

    Timer.subend();

    var img = new Image();
    img.src = this.ctx.canvas.toDataURL();

    return img;
    /*
    Timer.subend();
    Timer.substart("Draw image onto screen")
    ctx.drawImage(this.ctx.canvas, this.x1 - viewport[0] , this.y1 - viewport[1]);
    Timer.subend();

    Timer.substart("sector rest");
    drawPoly(viewport[0], viewport[1], ctx, this.label, this.poly, "#0000ff");
    Timer.subend();
*/
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


