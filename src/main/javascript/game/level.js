function get_zones(leveldata) {

    var zones = [];

    var that=this;

    leveldata["zones"].forEach(function(zone) {
        var pops = zone["pops"];
        var points = zone["points"].map(function (x) { return $V(x[0], x[1]) } );

        zones.push(new Zone($P(points), zone["label"], 1.0, pops, zone["texture"]));
    });

    return zones;
}
