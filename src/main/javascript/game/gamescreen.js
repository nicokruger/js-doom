
GameScreen = function(src) {
    // QuadTree setup
    var bl = new Quad(250,250); var br = new Quad(750,250);
    var tr = new Quad(750,750); var tl = new Quad(250,750);
    this.quadtree = new QuadTree(500, 500, bl, br, tr, tl);

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
    this.quadtree.forEach(Square(0,500,500,1000), function (sector) {
        var tt1 = Date.now();
        sector.draw(ctx);
        var tt2 = Date.now();
        i++;
    });
    Timer.end();
    console.log("[ " + i + " sectors ]");
}


