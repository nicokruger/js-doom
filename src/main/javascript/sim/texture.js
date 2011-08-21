
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

TextureRepeat.prototype.rasterize = function(outsideImageData, y, ray, poly, extreme_x1, extreme_x2, width, height, viewport) {
    var ty = (y + viewport[1]) % this.height;
    var x1 = (poly.extremes.x1 + 0.5) << 0;
    var y1 = (poly.extremes.y1 + 0.5) << 0;
    var data = outsideImageData.data;
    var thisdata = this.imageData.data;
    for (var i = 0; i < ray.neg.length; i++) {
        var seg = ray.neg[i];
        var rx1 = (0.5 + seg.origin.x) << 0;
        var rx2 = (0.5 + seg.end.x) << 0;
        rx1 = _.max([rx1, extreme_x1]);
        rx2 = _.min([rx2, extreme_x2]);
        for (var scanx = rx1; scanx < rx2; scanx++) {
            var x = (scanx - viewport[0]);
            var tx = scanx % this.width;
            var index = (x + y * width) * 4;
            var tindex = (tx + ty*this.width) * 4;
            data[index + 0] = thisdata[tindex + 0];
            data[index + 1] = thisdata[tindex + 1];
            data[index + 2] = thisdata[tindex + 2];
            data[index + 3] = 255;
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


