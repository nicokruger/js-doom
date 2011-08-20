function get_sectors(leveldata) {

    var sectors = [];

    var that=this;

    leveldata["sectors"].forEach(function(sector) {
        var points = sector["points"].map(function (x) { return $V(x[0], x[1]) } );

        sectors.push(new Sector($P(points), sector["label"], sector["texture"]));
    });

    return sectors;
}
