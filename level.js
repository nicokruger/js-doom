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
        
    return  _(doom_ssectors).map(function (ssector) {
        
        var seg2sector = _.chain(_.range(ssector.seg_a, ssector.seg_a + ssector.numsegs)).map(function (i) {
            return leveldata.segs[i];
        }).filter(function (seg) {
            return seg.line != 65535;
        }).map(function (seg) {
            if (seg.side === 0) {
                return leveldata.sidedefs[leveldata.linedefs[seg.line].right].sector;
            } else {
                return leveldata.sidedefs[leveldata.linedefs[seg.line].left].sector;
            }
        }).value();

        var segs = [];
        var sector;
        for (var i = 0; i < ssector.numsegs; i++) {
            segs.push(doom_segs[ssector.seg_a + i]);
        }

        return {
            // vx_b -> vx_a so ssectors are counter-clockwise
            edges: _(segs).map(function (seg) { return $L(doom_vertices[seg.vx_b], doom_vertices[seg.vx_a]); }),
            sector: leveldata.sectors[seg2sector[0]],
            vertices: _(segs).map(function (seg) {
                return doom_vertices[seg.vx_a];
            })
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
    return leveldata.sectors;
};
