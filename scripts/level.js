var doom;
if (!doom) doom = {}; // create top-level module
    
doom.get_sectors = function(leveldata) {

    var doom_sectors = leveldata.sectors;
    var doom_ssectors = leveldata.ssectors;
    var doom_vertices = _(leveldata.vertices).map(function (v) { return $V(v.x,v.y); });
    var doom_sidedefs = leveldata.sidedefs;
    var doom_linedefs = leveldata.linedefs;

    // Sidedef -> sector mapping
    var sidedefs_sectors = _(doom_sidedefs).chain().zip(_.range(doom_sidedefs.length)).reduce(function (o, sidedef) {
        o[sidedef[1]] = sidedef[0].sector;
        return o;
    }, {}).value();
    
    // create a list full of empty lists for all the sectors
    var sectors = _(_.range(_.max(_.values(sidedefs_sectors)) + 1)).map(function (x) { return [] });

    // go through all linedefs, and add vertices to sectors for both sidedefs
    _(doom_linedefs).each(function (linedef) {
        
        if (linedef.right != -1) {
            sectors[sidedefs_sectors[linedef.right]].push($L(doom_vertices[linedef.vx_b], doom_vertices[linedef.vx_a]));
        }
        if (linedef.left != -1) {
            sectors[sidedefs_sectors[linedef.left]].push($L(doom_vertices[linedef.vx_a], doom_vertices[linedef.vx_b]));
        }
    });
    
    return _(sectors).map(function (s) {
        var bsp = renderlib.bsp.create(s);
        
        var poly =  {
                edges: s,
                bsp: bsp,
                vertices: _(s).chain().map(function (x) { return x.origin }).uniq().value(),
                extremes: {
                    x1: -768,
                    x2: -256,
                    y1: 256,
                    y2: 768
                },
                width: -256 - -768,
                height: 768 - 256
            }
        poly["partition"] = function (line) {
            return renderlib.bsp.partition(poly, line)
        }
        return {
            tick: function (delta) {
            },
            poly: poly,
            texture: "doomlogo2",
            width: -256 - -768,
            height: 768 - 256
        }
    });
    
    /*var sectors = [];

    var that=this;

    leveldata["sectors"].forEach(function(sector) {
        var points = sector["points"].map(function (x) { return $V(x[0], x[1]) } );

        sectors.push(new Sector($P(points), sector["label"], sector["texture"]));
    });

    return sectors;*/
}
