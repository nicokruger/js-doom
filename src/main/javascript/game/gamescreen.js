
GameScreen = function(width,height,data) {
    // QuadTree setup
    this.quadtree = setupQuadTree(0,0,4000,4000, 250, 250);


    this.width = width;
    this.height = height;
    this.setCenter(data.player1[0], data.player1[1]);
    $("#console").val($("console").val() + "\nPlayer start at " + data.player1[0] + "," + data.player1[1]);
    console.log("Player start at " + data.player1[0] + "," + data.player1[1]);
    // Load textures
    var tkeys = [];
    _.keys(data.texturedata).forEach(function (texturename) {
        tkeys.push(texturename);
    });
    for (var i = 0; i < tkeys.length; i++) {
        textureLoader.add(tkeys[i], data.texturedata[tkeys[i]]);
        $("#console").val($("#console").val() + "\nLoading texture " + tkeys[i]);
    }

    // Load level
    var that = this;
    // Load level
    var that=this;
    this.sectors = get_sectors(data);
    this.sectors.forEach(function (sector) {
        that.quadtree.add(SectorPlacer(sector));
    });
}

GameScreen.prototype.left = function () {
    this.x -= 32;
}

GameScreen.prototype.right = function () {
    this.x += 32;
}
GameScreen.prototype.up = function () {
    this.y -= 32;
}
GameScreen.prototype.down = function () {
    this.y += 32;
}

GameScreen.prototype.setCenter = function (x,y) {
    this.x = x - this.width / 2;
    this.y = y - this.height / 2;
}

GameScreen.prototype.draw = function (ctx) {
    if (!textureLoader.ready()) {
        console.log("Textureloader not ready... aborting draw");
        return;
    }

    ctx.font = "bold 12px sans-serif";
    ctx.fillStyle = "rgba(0,0,0,1.0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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

    var viewport = [this.x, this.y, this.x + this.width, this.y + this.height];
    var that = this;
    $("#viewport").html("Viewport: [" + that.x + "," + that.y + " x " + (that.x+that.width) + "," + (that.y+that.height));
    this.quadtree.forEach(Square(that.x,that.y,that.x + that.width, that.y + that.height), function (sector) {
        Timer.substart("sector rest");
        drawPoly(viewport, ctx, sector.label, sector.poly, "#0000ff");
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
    return viewport[3] + (-1 * (y - viewport[1]));
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



