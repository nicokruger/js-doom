
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

    this.sectors = game.sectors;
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

GameScreen.prototype.setupViewport = function() {
    var sectors = [];
    this.quadtree.forEach(Square(this.x, this.y, this.x + this.width, this.y + this.height), function (sector) {
        sectors.push(sector);
    });
    
    this.viewport = new Viewport(sectors, this.x, this.y, this.x + this.width,  this.y + this.height);
    this.data = this.ctx.createImageData(this.viewport.width + 1, this.viewport.height);
}

GameScreen.prototype.left = function () {
    this.x -= 32;
    this.setupViewport();
}

GameScreen.prototype.right = function () {
    this.x += 32;
    this.setupViewport();
}
GameScreen.prototype.up = function () {
    this.y += 32;
    this.setupViewport();
}
GameScreen.prototype.down = function () {
    this.y -= 32;
    this.setupViewport();
}

GameScreen.prototype.setCenter = function (x,y) {
    this.x = x - this.width / 2;
    this.y = y - this.height / 2;
    this.setupViewport();
    
}

GameScreen.prototype.draw = function () {
    if (!textureLoader.ready()) {
        console.log("Textureloader not ready... aborting draw");
        return;
    }

    Timer.start("Sectordraw");

    var data = this.data;

    Timer.substart("singlebitmap craziness");
    this.viewport.singleBitmap(data);
    Timer.subend();

    Timer.substart("Put image buffer");
    this.ctx.putImageData(data, 0, 0);
    Timer.subend();
    
    /*
    var that = this;
    $("#viewport").html("Viewport: [" + that.x + "," + that.y + " x " + (that.x+that.width) + "," + (that.y+that.height));*/
    /*this.quadtree.forEach(Square(that.x,that.y,that.x + that.width, that.y + that.height), function (sector) {
        Timer.substart("sector rest");
        drawPoly(that.viewport, that.ctx, sector.label, sector.poly, "#0000ff");
        Timer.subend();
    });*/


    drawPoly(this.viewport, this.ctx, this.sectors[0].label, this.sectors[0].poly, "#0000ff");
    Timer.end();
}

