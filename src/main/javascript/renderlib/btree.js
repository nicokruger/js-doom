var renderlib;
if (!renderlib) renderlib = {}; // initialise the top-level module if it does not exist

renderlib.bsp = (function() {
    
    // Helper Functions
    var find_v = function(l, v) {
        for (var i = 0; i < l.length; i++) {
            var x = l[i].x;
            var y = l[i].y;

            if ((Math.abs(v.x - x) < 0.0001) && (Math.abs(v.y - y) < 0.0001)) {
                return i;
            }
        }

        return -1;
    }
    
    var pos_partition = function(T, edge, partition_node) {
        if (T != null) {
            get_partition(T, edge, partition_node);
        } else {
            partition_node.pos.push(edge);
        }
    }

    var neg_partition = function (T, edge, partition_node) {
        if (T != null) {
            get_partition(T, edge, partition_node);
        } else {
            partition_node.neg.push(edge);
        }
    }

    var get_partition = function(T, edge, partition_node) {
        if (T == null)
            return;

        var classification = T.line.intersects(edge);

        if (classification == $L.INTERSECTS_FORWARD) {
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

        } else if (classification == $L.INTERSECTS_BACKWARD) {
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

        } else if (classification == $L.RIGHT) {
            pos_partition(T.positive, edge, partition_node);
        } else if (classification == $L.LEFT) {
            neg_partition(T.negative, edge, partition_node);
        } else if (classification == $L.COINCIDENT) {
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
        }
    }

    var bsp_gather_node = function(line, lines) {
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
             bsp_node.positive = renderlib.bsp.create(bsp_node.pos);
        if (bsp_node.neg.length > 0)
             bsp_node.negative = renderlib.bsp.create(bsp_node.neg);

        return bsp_node;
    }
    
    var classify = function(line, edge, bsp_node) {

        var classification = line.intersects(edge);

        if (classification == $L.INTERSECTS_FORWARD) {
            var I = line.intersection(edge);
            if (!edge.origin.equals(I)) {
                bsp_node.neg.push($L(edge.origin, I));
            }
            if (!I.equals(edge.end)) {
                bsp_node.pos.push($L(I, edge.end));
            }
        } else if (classification == $L.INTERSECTS_BACKWARD) {
            var I = line.intersection(edge);
            if (!edge.origin.equals(I)) {
                bsp_node.pos.push($L(edge.origin, I));
            }
            if (!I.equals(edge.end)) {
                bsp_node.neg.push($L(I, edge.end));
            }
        } else if (classification == $L.RIGHT) {
            bsp_node.pos.push(edge);
        } else if (classification == $L.LEFT) {
            bsp_node.neg.push(edge);
        } else if (classification == $L.COINCIDENT) {
            bsp_node.coincident.push(edge);
        }
    }
        
    
    // Exports
    return {
        create: function(lines) {
            var line = lines[0];

            return bsp_gather_node(line, lines);
        },
        
        partition: function(poly, edge) {

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

    }
})();


