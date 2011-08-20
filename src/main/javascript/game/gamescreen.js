
GameScreen = function(width,height,src) {
    // QuadTree setup
    var bl = new Quad(250,250); var br = new Quad(750,250);
    var tr = new Quad(750,750); var tl = new Quad(250,750);
    this.quadtree = setupQuadTree(0,0,4000,4000, 50, 50);

    this.x = 0;
    this.y = 600;
    this.width = 800;
    this.height = 800;
    // Load level
    var that = this;
    $.getJSON("data/doom.json", function(data) {
        that.sectors = get_sectors(data);
        that.sectors.forEach(function (sector) {
            that.quadtree.add(SectorPlacer(sector));
        });
    }).error(function(e) {
        alert("error:" + e.statusText);
    });
}

GameScreen.prototype.draw = function (ctx) {
    ctx.font = "bold 12px sans-serif";

    Timer.start("Sectordraw");
    var i = 0;
    var that = this;

    $("#viewport").html("Viewport: [" + that.x + "," + that.y + " x " + (that.x+that.width) + "," + (that.y+that.height));

    this.quadtree.forEach(Square(that.x,that.y,that.x + that.width, that.y + that.height), function (sector) {
        var tt1 = Date.now();
        sector.draw(that.x, that.y, ctx);
        var tt2 = Date.now();
        i++;
    });
    Timer.end();
    console.log("[ " + i + " sectors ]");
}


