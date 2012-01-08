/*jslint devel: true, es5: false, vars: true, white: false, fragment: false, maxerr: 500, indent: 4 */

$P = (function() {
    
    // these are the publicly exported symbols in this module
    var exports = function(/* ...... */) {
        var p;
        if (arguments[0].push !== undefined) {
            p = new Polygon(arguments[0]);
        } else {
            p = new Polygon(arguments);
        }
        p.bsp = renderlib.bsp.create(p.edges);
        p.bounds = get_bb(p.vertices);
        return p;
    }

    exports.order_edges =function(edges) {
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
    
    // These are local to the module
    var Polygon = function(vertices) {
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
        return renderlib.bsp.partition(this, edge);
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
            var SS = $P.order_edges(segs);
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

    var $BoundingBox = function(/* ....... */) {
        var p;
        if (arguments[0].push !== undefined) {
            p = new Polygon(arguments[0]);
        } else {
            p = new Polygon(arguments);
        }
        return p;
    }

    var hash_vertex = function(v) {
        return [Math.round(v.x * 1000, 0), Math.round(v.y * 1000, 0)]
    }

    var get_bb = function(vertices) {
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


    return exports;
    
})();
