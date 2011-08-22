
GameScreen = function(width,height,data) {
    // QuadTree setup
    this.quadtree = setupQuadTree(0,0,4000,4000, 250, 250);

    this.x = data.player1[0] - width/2;
    this.y = data.player1[1] - height/2;
    if (this.x < 0) this.x = 0;
    if (this.y < 0) this.y = 0;
    this.width = width;
    this.height = height;
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

GameScreen.prototype.draw = function (ctx) {
    if (!textureLoader.ready()) {
        console.log("Textureloader not ready... aborting draw");
        return;
    }

    ctx.font = "bold 12px sans-serif";

    Timer.start("Sectordraw");
    var i = 0;
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

    this.quadtree.forEach(Square(that.x,that.y,that.x + that.width, that.y + that.height), function (sector) {
        Timer.substart("sector rest");
        drawPoly(viewport[0], viewport[1], ctx, sector.label, sector.poly, "#0000ff");
        Timer.subend();
    });

    Timer.end();
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



