
GameScreen = function(width,height,data,game) {
    var that = this;

    this.game = game;
    this.width = width;
    this.height = height;

    this.setCenter(game.x, game.y);

    textureLoader = new TextureLoader();
    _.keys(data.texturedata).forEach(function (texturename) {
        textureLoader.add(texturename, data.texturedata[texturename]);
        $("#console").val($("#console").val() + "\nLoading texture " + texturename);
    });

    // QuadTree setup
    this.quadtree = setupQuadTree(0,0,4000,4000, 250, 250);
    game.sectors.forEach(function (sector) {
        that.quadtree.add(SectorPlacer(sector));
    });

    this.canvas = document.getElementById("canvas");
    if (this.canvas && this.canvas.getContext) {
        this.ctx = canvas.getContext("2d");
    } else {
        alert("cannot find canvas");
    }

}

GameScreen.prototype.left = function () {
    this.x -= 32;
}

GameScreen.prototype.right = function () {
    this.x += 32;
}
GameScreen.prototype.up = function () {
    this.y += 32;
}
GameScreen.prototype.down = function () {
    this.y -= 32;
}

GameScreen.prototype.setCenter = function (x,y) {
    this.x = x - this.width / 2;
    this.y = y - this.height / 2;
}

GameScreen.prototype.draw = function () {
    if (!textureLoader.ready()) {
        console.log("Textureloader not ready... aborting draw");
        return;
    }

    this.ctx.font = "bold 12px sans-serif";
    this.ctx.fillStyle = "rgba(0,0,0,1.0)";
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    Timer.start("Sectordraw");

    /*var i = 0;
    var that = this;

    $("#viewport").html("Viewport: [" + that.x + "," + that.y + " x " + (that.x+that.width) + "," + (that.y+that.height));

    Timer.substart("get image buffer");
    var data = ctx.createImageData(this.width,this.height);
    Timer.subend();

    var viewport = [this.x, this.y, this.x + this.width, this.y + this.height];
    this.quadtree.forEach(Square(that.x,that.y,that.x + that.width, that.y + that.height), function (sector) {
        sector.draw(viewport, data);
    });

    Timer.substart("Put image buffer");
    ctx.putImageData(data, 0, 0);
    Timer.subend();
    */

    Timer.substart("get image buffer");
    var data = ctx.createImageData(this.width,this.height);
    Timer.subend();
    var viewport = [this.x, this.y, this.x + this.width, this.y + this.height];
    
    drawSector(viewport, game.sectors[8], data);
    
    Timer.substart("Put image buffer");
    ctx.putImageData(data, 0, 0);
    Timer.subend();
    
    var that = this;
    $("#viewport").html("Viewport: [" + that.x + "," + that.y + " x " + (that.x+that.width) + "," + (that.y+that.height));
    this.quadtree.forEach(Square(that.x,that.y,that.x + that.width, that.y + that.height), function (sector) {
        Timer.substart("rasterization");
        //drawSector(viewport, sector, data);
        Timer.subend();

        Timer.substart("sector rest");
        drawPoly(viewport, that.ctx, sector.label, sector.poly, "#0000ff");
        Timer.subend();
    });
    


    Timer.end();
}

/**
 * For testing only.
 */

function cartesian2screenx(x, viewport) {
    return x - viewport[0];
}
function cartesian2screeny(y, viewport) {
    return viewport[3] + (-1 * y);
}


Rasterizer = function(outsideImageData, y, ray, poly, extreme_x1, extreme_x2, width, height, viewport) {
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


function drawSector(viewport, sector, data) {

    // TODO: handle at some pre-processing step.
    if (sector.poly.width == 0 || sector.poly.height == 0) {
        return;
    }

    var rays = [];
    var x1 = sector.poly.extremes.x1;
    var y1 = sector.poly.extremes.y1;
    var width = sector.poly.width;
    var height = sector.poly.height;
    for (var y = 0; y < height; y++) {
        rays.push(sector.poly.partition($L($V(x1-1, y+y1), $V(x1+width+1, y+y1))))
    }

    y1 = _.max([y1, viewport[1]]);
    y2 = _.min([y1 + height, viewport[3]]);
    x1 = _.max([x1, viewport[0]]);
    x2 = _.min([x1 + width, viewport[2]]);
    width = viewport[2] - viewport[0];
    height = viewport[3] - viewport[1];

    var f = _.bind(Rasterizer, textureLoader.texture[sector.texture]);

    for (var y = y1; y < y2; y++) {
      //console.log(rays[y - sector.poly.extremes.y1] + " / " + y + " - " + sector.poly.extremes.y1);
      f(data, y - viewport[1], rays[y - sector.poly.extremes.y1], sector.poly, x1, x2, width, height, viewport);
    }
}

function drawPoly(viewport, ctx, label, poly, colour) {
    ctx.strokeStyle = colour;
    ctx.beginPath();
    poly.edges.forEach(function (edge) {
        ctx.moveTo(cartesian2screenx(edge.origin.x, viewport), cartesian2screeny(edge.origin.y, viewport));
        ctx.lineTo(cartesian2screenx(edge.end.x, viewport), cartesian2screeny(edge.end.y, viewport));
    });
    ctx.stroke();

    ctx.fillStyle = "rgba(220, 220, 220, 1)";
    ctx.font = "bold 12px sans-serif";
    var x = cartesian2screenx(poly.extremes.x1,viewport);
    var y = cartesian2screeny(poly.extremes.y1,viewport);

    ctx.fillText(label, x, y);

}



