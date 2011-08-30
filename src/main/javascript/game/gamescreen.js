
GameScreen = function(width,height,data,game) {
    var that = this;

    this.game = game;
    this.width = width;
    this.height = height;

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
    
    this.setCenter(game.x, game.y);

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
    this.viewport = new Viewport(this.quadtree, this.x, this.y, this.x + this.width, this.y + this.width);
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

    Timer.substart("Put image buffer");
    this.ctx.putImageData(this.viewport.singleBitmap(), 0, 0);
    Timer.subend();
    
    var that = this;
    $("#viewport").html("Viewport: [" + that.x + "," + that.y + " x " + (that.x+that.width) + "," + (that.y+that.height));
    this.quadtree.forEach(Square(that.x,that.y,that.x + that.width, that.y + that.height), function (sector) {
        Timer.substart("rasterization");
        //drawSector(viewport, sector, data);
        Timer.subend();

        Timer.substart("sector rest");
        drawPoly(that.viewport, that.ctx, sector.label, sector.poly, "#0000ff");
        Timer.subend();
    });
    
    Timer.end();
}


Scanner = function(poly) {
    // Partitioning
    var rays = [];
    var x1 = poly.extremes.x1;
    var y1 = poly.extremes.y1;
    var width = poly.width;
    var height = poly.height;
    
    // All of the following partitions MUST be succesful - we are after all restricting
    // our scanlines to the extreme bounds of the polygon.
    
    // bottom - handled seperately
    var l = poly.partition($L($V(x1-1, y1), $V(x1+width+1, y1))).cosame;
    if (l.length > 0) {
        rays.push(l);
    }
    
    // middle part - iterate through "inner" part of polygon
    for (var y = 1; y <= height-1; y++) {
        rays.push(poly.partition($L($V(x1-1, y+y1), $V(x1+width+1, y+y1))).neg);
    }
    
    //top - reverse it, because it is in the opposite direction than the scanline
    l = poly.partition($L($V(x1-1, y1+height), $V(x1+width+1, y1+height))).codiff;
    if (l.length > 0) {
        rays.push([$L(l[0].end, l[0].origin)]);
    }    
    return rays;
 }


Pixeler = function(viewport, data) {
    return function(x1,x2,y) {
        var si1 = (x1 - viewport.x1 + (y - viewport.y1) * data.width)  * 4;
        var si2 = (x2 - viewport.x1 + (y - viewport.y1) * data.width)  * 4;
        for (var x = si1; x  <= si2; x++) {
                data.imageData[x] = 255;
                data.imageData[x + 1] = 255;
                data.imageData[x + 2] = 255;
                data.imageData[x + 3] = 255;
        }
    }
}

Bounder = function(viewport, poly, rays, f) {
    
    var y1 = _.max([poly.extremes.y1, viewport.y1]);
    var y2 = _.min([poly.extremes.y2, viewport.y2]);
    
    for (var y = y1; y <= y2; y++) {
        //Rasterizer(textureLoader.texture[sector.texture], data, y - this.y1, partition[y - sector.poly.extremes.y1], sector.poly, x1, x2, sector.poly.width, sector.poly.height, this);
        //f(texture, data, 
        f(_.max([rays[y][0].origin.x, viewport.x1]), _.min([rays[y][0].end.x, viewport.x2]), y);
    }
}

SectorDraw = function(viewport, poly, partition) {
    
    return Looper(sector, x1, y1, x2, y2);
}

Viewport = function(quadtree,x1,y1,x2,y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    
    this.sectors = []; var that=this;
    quadtree.forEach(Square(x1, y1, x1, y1), function (sector) {
        that.sectors.push(SectorDraw(that, sector, Scanner(sector)));
    });
}

Viewport.prototype.cartesian2screenx = function(x) {
    return x - this.x1;
}
Viewport.prototype.cartesian2screeny = function(y) {
    return this.y2 + (-1 * y);
}

Viewport.prototype.singleBitmap = function () {
    Timer.substart("create image buffer");
    var data = ctx.createImageData(this.x2 - this.x1,this.y2 - this.y1);
    Timer.subend();
    
    //for (var i = 0; i < this.sectors.length; i++) {
    this.sectors[0](data);
    //}
    
    return data;
}


function drawPoly(viewport, ctx, label, poly, colour) {
    ctx.strokeStyle = colour;
    ctx.beginPath();
    for (var i = 0; i < poly.edges.length; i++) {
        ctx.moveTo(viewport.cartesian2screenx(poly.edges[i].origin.x), viewport.cartesian2screeny(poly.edges[i].origin.y));
        ctx.lineTo(viewport.cartesian2screenx(poly.edges[i].end.x), viewport.cartesian2screeny(poly.edges[i].end.y));
    }
    ctx.stroke();

    ctx.fillStyle = "rgba(220, 220, 220, 1)";
    ctx.font = "bold 12px sans-serif";
    var x = viewport.cartesian2screenx(poly.extremes.x1);
    var y = viewport.cartesian2screeny(poly.extremes.y1);

    ctx.fillText(label, x, y);

}



