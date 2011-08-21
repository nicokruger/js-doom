
GameScreen = function(width,height,data) {
    // QuadTree setup
    this.quadtree = setupQuadTree(0,0,4000,4000, 250, 250);

    this.x = 0;
    this.y = 600;
    this.width = width;
    this.height = height;
    // Load level
    var that = this;
/*
    $.getJSON("data/map01.json", function(data) {
        that.sectors = get_sectors(data);
        that.sectors.forEach(function (sector) {
            that.quadtree.add(SectorPlacer(sector));
        });
    }).error(function(e) {
        alert("error:" + e.statusText);
    });
*/
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

GameScreen.prototype.draw = function (ctx) {
    ctx.font = "bold 12px sans-serif";

    Timer.start("Sectordraw");
    var i = 0;
    var that = this;

    $("#viewport").html("Viewport: [" + that.x + "," + that.y + " x " + (that.x+that.width) + "," + (that.y+that.height));

    var viewport = [this.x, this.y, this.x + this.width, this.y + this.height];
    this.quadtree.forEach(Square(that.x,that.y,that.x + that.width, that.y + that.height), function (sector) {
        var tt1 = Date.now();
        sector.draw(viewport, ctx);
        var tt2 = Date.now();
        i++;
    });
    Timer.end();
    console.log("[ " + i + " sectors ]");
}


