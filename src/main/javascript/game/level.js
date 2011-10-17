var doom;
if (!doom) doom = {}; // create top-level module
    
doom.get_polygons = function(leveldata) {

    var doom_sectors = leveldata.sectors;
    var doom_ssectors = leveldata.ssectors;
    var doom_vertices = leveldata.vertexes;
    
    var ssectors = _.map(doom_ssectors, function (doom_ssector) {
            _.map(doom_ssector.segs, function(seg) {
                
            });
    });
    
    return ssectors;
    
    /*var sectors = [];

    var that=this;

    leveldata["sectors"].forEach(function(sector) {
        var points = sector["points"].map(function (x) { return $V(x[0], x[1]) } );

        sectors.push(new Sector($P(points), sector["label"], sector["texture"]));
    });

    return sectors;*/
}
