/*jslint devel: true, es5: false, vars: true, white: false, fragment: false, maxerr: 500, indent: 4 */
Polygon = function(vertices) {
    // for easy drawing
    this.vertices = [];
    var bounds = {
        x1: 9999999,x2: -9999999,
        y1: 9999999,y2: -9999999
    }

    for (var i = 0; i < vertices.length; i++) {
        this.vertices[i] = vertices[i];
        if (vertices[i].x < bounds.x1) bounds.x1 = vertices[i].x;
        if (vertices[i].x > bounds.x2) bounds.x2 = vertices[i].x;
        if (vertices[i].y < bounds.y1) bounds.y1 = vertices[i].y;
        if (vertices[i].y > bounds.y2) bounds.y2 = vertices[i].y;
    }
    this.extremes = bounds;

    // get the edges
    this.edges = _.reduce(this.vertices, function(e, b) {
        if (!e[1].equals(b))
            e[0].push($L(e[1], b));
        return [e[0], b];
    }, [[], this.vertices[this.vertices.length-1]])[0];

    this.width = bounds.x2 - bounds.x1;
    this.height = bounds.y2 - bounds.y1;
}

function get_bb(vertices) {
    var bounds = {
        x1: 9999999,
        x2: -9999999,
        y1: 9999999,
        y2: -9999999
    }
    for (var i = 0; i < vertices.length; i++) {
        if (vertices[i].x < bounds.x1) bounds.x1 = vertices[i].x;
        if (vertices[i].x > bounds.x2) bounds.x2 = vertices[i].x;
        if (vertices[i].y < bounds.y1) bounds.y1 = vertices[i].y;
        if (vertices[i].y > bounds.y2) bounds.y2 = vertices[i].y;
    }

    return $BoundingBox($V(bounds.x1,bounds.y1), $V(bounds.x2,bounds.y1), $V(bounds.x2,bounds.y2), $V(bounds.x1,bounds.y2));
}

Polygon.prototype.area = function() {
    var verts = [];
    this.vertices.forEach(function (v) { verts.push(v); });
    verts.push(this.vertices[0]);

    var positive_diagonals = _.reduce(verts.slice(1,verts.length), function (a,b) {
        a[0] += a[1].x * b.y;
        a[1] = b;
        return a;
    }, [0, verts[0]])[0];

    var negative_diagonals = _.reduce(verts.slice(1,verts.length), function (a,b) {
        a[0] += a[1].y * b.x;
        a[1] = b;
        return a;
    }, [0, verts[0]])[0];

    return (positive_diagonals - negative_diagonals) / 2;
}


Polygon.prototype.partition = function(edge) {
    return partition(this, edge);
}

Polygon.prototype.intersection = function(that) {
    var segs = [];

    var me = this;
    that.edges.forEach(function(edge) {
        var partition_node = me.partition(edge);

        partition_node.neg.forEach(function(seg) {
            segs.push(seg);
        })

        partition_node.cosame.forEach(function(seg) {
            segs.push(seg);
        })
    });

    this.edges.forEach(function (edge) {
        var partition_node = that.partition(edge);

        partition_node.neg.forEach(function(seg) {
            segs.push(seg);
        });

        partition_node.cosame.forEach(function(seg) {
            segs.push(seg);
        });

    });

    var vertices = [];
    //console.log("Segs:");
    if (segs.length > 0) {
        var SS = order_edges(segs);
        SS.forEach(function (seg) {
            vertices.push(seg.origin);
        });
        vertices.push(SS[SS.length-1].end);
    };

    if (vertices.length > 0) {
        var P = $P(vertices);
        return P;
    } else {
        return null;
    }
}


$P = function(/* ...... */) {
    var p;
    if (arguments[0].push !== undefined) {
        p = new Polygon(arguments[0]);
    } else {
        p = new Polygon(arguments);
    }
    p.bsp = bsp(p.edges);
    p.bounds = get_bb(p.vertices);
    return p;
}

$BoundingBox = function(/* ....... */) {
    var p;
    if (arguments[0].push !== undefined) {
        p = new Polygon(arguments[0]);
    } else {
        p = new Polygon(arguments);
    }
    return p;
}

function bsp(lines) {
    var line = lines[0];

    return bsp_gather_node(line, lines);

}

function bsp_gather_node(line, lines) {

    var bsp_node = {};
    bsp_node.line = line;
    bsp_node.positive = null;
    bsp_node.negative = null;
    bsp_node.coincident = [];
    bsp_node.pos = [];
    bsp_node.neg = [];

    lines.forEach(function (edge) {
        classify(line, edge, bsp_node)
    });

    if (bsp_node.pos.length > 0)
         bsp_node.positive = bsp(bsp_node.pos);
    if (bsp_node.neg.length > 0)
         bsp_node.negative = bsp(bsp_node.neg);

    return bsp_node;
}

function classify(line, edge, bsp_node) {

    var classification = line.intersects(edge);

    if (classification == Line.INTERSECTS_FORWARD) {
        var I = line.intersection(edge);
        if (!edge.origin.equals(I)) {
            bsp_node.neg.push($L(edge.origin, I));
        }
        if (!I.equals(edge.end)) {
            bsp_node.pos.push($L(I, edge.end));
        }
    } else if (classification == Line.INTERSECTS_BACKWARD) {
        var I = line.intersection(edge);
        if (!edge.origin.equals(I)) {
            bsp_node.pos.push($L(edge.origin, I));
        }
        if (!I.equals(edge.end)) {
            bsp_node.neg.push($L(I, edge.end));
        }
    } else if (classification == Line.RIGHT) {
        bsp_node.pos.push(edge);
    } else if (classification == Line.LEFT) {
        bsp_node.neg.push(edge);
    } else if (classification == Line.COINCIDENT) {
        bsp_node.coincident.push(edge);
    }


}

function partition(poly, edge) {

    var partition_node = {
        pos: [],
        neg: [],
        cosame: [],
        codiff : []
    }
    var T = poly.bsp;

    get_partition(T, edge, partition_node);

    return partition_node;
}

function get_partition(T, edge, partition_node) {

    if (T == null)
        return;

    var classification = T.line.intersects(edge);

    if (classification == Line.INTERSECTS_FORWARD) {
        var I = T.line.intersection(edge);
        
        if (I == null) {
            console.log("IT IS NULL: " + I.x + " / " + I.y);
            console.log("            " + edge.origin.x + ":" + edge.origin.y + " - " + edge.end.x + "/" + edge.end.y)
        }

        if (!I.equals(edge.end)) {
            var second = $L(I, edge.end);
            pos_partition(T.positive, second, partition_node);
        }
        if (!edge.origin.equals(I)) {
            var first = $L(edge.origin, I)
            neg_partition(T.negative, first, partition_node);
        }

    } else if (classification == Line.INTERSECTS_BACKWARD) {
        var I = T.line.intersection(edge);

        if (I == null) {
            console.log("IT IS NULL: " + I.x + " / " + I.y);
            console.log("            " + edge.origin.x + ":" + edge.origin.y + " - " + edge.end.x + "/" + edge.end.y)
        }
        
        if (!edge.origin.equals(I)) {
            var first = $L(edge.origin, I)
            pos_partition(T.positive, first, partition_node);
        }
        if (!I.equals(edge.end)) {
            var second = $L(I, edge.end);
            neg_partition(T.negative, second, partition_node);
        }

    } else if (classification == Line.RIGHT) {
        pos_partition(T.positive, edge, partition_node);
    } else if (classification == Line.LEFT) {
        neg_partition(T.negative, edge, partition_node);
    } else if (classification == Line.COINCIDENT) {
        T.coincident.forEach(function (EE) {
            var I = EE.coincident_segment(edge)

            // Check the direction of the line
            var coinc = $L(I[0], I[1])

            if  (coinc.canonical().dot(edge.canonical()) > 0) {
                partition_node.cosame.push($L(I[0], I[1]))
            } else {
                partition_node.codiff.push($L(I[0], I[1]))
            }



        })

        // Iterate through the rest of the edges

    }
}

function pos_partition(T, edge, partition_node) {

    if (T != null) {
        get_partition(T, edge, partition_node);
    } else {
        partition_node.pos.push(edge);
    }
}

function neg_partition(T, edge, partition_node) {

    if (T != null) {
        get_partition(T, edge, partition_node);
    } else {
        partition_node.neg.push(edge);
    }

}


function order_edges(edges) {
    if (edges.length == 0) {
        return [];
    }
    var edge_links_forward = {};
    var edge_links_backward = {};

    var vertices = [];
    edges.forEach(function (edge) {
        edge_links_forward[hash_vertex(edge.origin)] = edge.end;
        edge_links_backward[hash_vertex(edge.end)] = edge.origin;
        vertices.push(edge.origin);
        vertices.push(edge.end);
    })

    var new_edges = [];
    var v = edges[0].end;
    // Rewind
    var visited = [];
    while (edge_links_backward[hash_vertex(v)] != null && visited.indexOf(v) == -1) {
        visited.push(v);
        v = edge_links_backward[hash_vertex(v)];
    }
    var end = edge_links_forward[hash_vertex(v)];


    var finished = [];

    while (end != null && finished.indexOf(end) == -1) {
        var L = $L(v, end);
        finished.push(v);
        finished.push(end);

        new_edges.push(L);

        var tmp = end;
        v = end;
        end = edge_links_forward[hash_vertex(tmp)];

    }

    return new_edges;
}

function hash_vertex(v) {
    return [Math.round(v.x * 1000, 0), Math.round(v.y * 1000, 0)]
}
function find_v(l, v) {
    for (var i = 0; i < l.length; i++) {
        var x = l[i].x;
        var y = l[i].y;

        if ((Math.abs(v.x - x) < 0.0001) && (Math.abs(v.y - y) < 0.0001)) {
            return i;
        }
    }

    return -1;
}
