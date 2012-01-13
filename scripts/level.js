var doom;
if (!doom) doom = {}; // create top-level module

doom.get_nodes = function (leveldata) {
    var c = function(node) {
        if (typeof(node) === "number") {
            return node;
        } else {
            return {
                left: c(node.left),
                right: c(node.right),
                partition: $L($V(node.partition[0],node.partition[1]), $V(node.partition[0] + node.partition[2],node.partition[1] + node.partition[3])),
                rightBB: {
                    x1:node.rightBB[0],
                    y1:node.rightBB[1],
                    x2:node.rightBB[2],
                    y2:node.rightBB[3]
                },
                leftBB: {
                    x1:node.leftBB[0],
                    y1:node.leftBB[1],
                    x2:node.leftBB[2],
                    y2:node.leftBB[3]
                }
            };
        }
    };

    return c(leveldata.nodes);
};

doom.get_ssectors = function (leveldata) {
    var doom_ssectors = leveldata.ssectors;
    var doom_segs = leveldata.segs;
    var doom_vertices = _(leveldata.vertices).map(function (v) { return $V(v.x,v.y); });
    var doom_sidedefs = leveldata.linedefs;
    var ssectors =  _(doom_ssectors).map(function (ssector) {
        var segs = [];
        var sector;
        for (var i = 0; i < ssector.numsegs; i++) {
            if (doom_segs[ssector.seg_a])
            segs.push(doom_segs[ssector.seg_a + i]);
        }

        return _(segs).map(function (seg) {
            return  $L(doom_vertices[seg.vx_a], doom_vertices[seg.vx_b]);
        });
    });



    return _(ssectors).map(function (s) {
        return {
            //bsp: renderlib.bsp.create(s),
            edges: s,
            vertices: _(s).chain().map(function (x) { return x.origin; }).uniq().value(),
            extremes: {
                x1: -768,
                x2: -256,
                y1: 256,
                y2: 768
            },
            width: -256  + 768,
            height: 768 - 256
        };
    });
};

doom.get_linedefs = function (leveldata) {
    var doom_linedefs = leveldata.linedefs;
    var doom_vertices = _(leveldata.vertices).map(function (v) { return $V(v.x,v.y); });
    return _(doom_linedefs).map(function (linedef) {
        return $L(doom_vertices[linedef.vx_a], doom_vertices[linedef.vx_b]);
    });
};

doom.get_sectors = function(leveldata) {

    var doom_sectors = leveldata.sectors;
    var doom_segs = leveldata.segs;
    var doom_vertices = _(leveldata.vertices).map(function (v) { return $V(v.x,v.y); });
    var doom_sidedefs = leveldata.sidedefs;
    var doom_linedefs = leveldata.linedefs;

    // Sidedef -> sector mapping
    var sidedefs_sectors = _(doom_sidedefs).chain().zip(_.range(doom_sidedefs.length)).reduce(function (o, sidedef) {
        o[sidedef[1]] = sidedef[0].sector;
        return o;
    }, {}).value();
    
    // create a list full of empty lists for all the sectors
    var sectors = _(_.range(_.max(_.values(sidedefs_sectors)) + 1)).map(function (x) { return []; });

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
                vertices: _(s).chain().map(function (x) { return x.origin; }).uniq().value(),
                extremes: {
                    x1: -768,
                    x2: -256,
                    y1: 256,
                    y2: 768
                },
                width: -256  + 768,
                height: 768 - 256
            };
        poly["partition"] = function (line) {
            return renderlib.bsp.partition(poly, line);
        };
        return poly;
    });
    
    /*var sectors = [];

    var that=this;

    leveldata["sectors"].forEach(function(sector) {
        var points = sector["points"].map(function (x) { return $V(x[0], x[1]) } );

        sectors.push(new Sector($P(points), sector["label"], sector["texture"]));
    });

    return sectors;*/
}
