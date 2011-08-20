
TextureLoader = function() {
    this.texture = {}
}

TextureLoader.prototype.load = function(name, image, width, height) {
    im = new Image();
    var that = this;
    im.onload = function(ev) {
        var element = document.getElementById("canvas");
        var ctx = document.createElement("canvas").getContext("2d");
        ctx.canvas.width = width;
        ctx.canvas.height = height;

        im = ev.target;

        ctx.drawImage(im, 0, 0);

        that.texture[name] = {
            repeat: new TextureRepeat(ctx.getImageData(0,0,width,height), width, height)
        }
    }
    im.src = image;
}


TextureRepeat = function(imageData, width, height) {
    this.imageData = imageData;
    this.width = width;
    this.height = height;
}

TextureRepeat.prototype.rasterize = function(data, y, ray, poly) {
    var ty = y % this.height;
    var x1 = poly.extremes.x1;
    var y1 = poly.extremes.y1;
    for (var i = 0; i < ray.neg.length; i++) {
        var seg = ray.neg[i];
        var rx1 = Math.round(seg.origin.x, 0);
        var rx2 = Math.round(seg.end.x, 0);
        for (var scanx = rx1; scanx < rx2; scanx++) {
            var x = (scanx-x1);
            var tx = x % this.width;
            var index = (x + y * poly.width) * 4;
            var tindex = (tx + ty*this.width) * 4;
            data.data[index + 0] = this.imageData.data[tindex + 0];
            data.data[index + 1] = this.imageData.data[tindex + 1];
            data.data[index + 2] = this.imageData.data[tindex + 2];
            data.data[index + 3] = 255;
        }
    }
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
