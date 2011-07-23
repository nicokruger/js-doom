Polygon = function(vertices) {
    // for easy drawing
    this.vertices = vertices

    // get the edges
    this.edges = reduce(this.vertices, function(e, b) {
        e[0].push($L(e[1], b));
        return [e[0], b];
    }, [[], this.vertices[this.vertices.length-1]])[0]

    this.bsp = bsp(this.edges)
}

Polygon.prototype.partition = function(edge) {
    return partition(this, edge);
}

$P = function(/* ...... */) {
    var p = new Polygon(arguments);
    return p;
}

function bsp(lines) {
    var line = lines[0]

    return bsp_gather_node(line, lines);

}

function bsp_gather_node(line, lines) {

    var bsp_node = {}
    bsp_node.line = line
    bsp_node.positive = null
    bsp_node.negative = null
    bsp_node.coincident = []
    bsp_node.pos = []
    bsp_node.neg = []

    lines.forEach(function (edge) {
        classify(line, edge, bsp_node)
    })

    if (bsp_node.pos.length > 0)
         bsp_node.positive = bsp(bsp_node.pos)
    if (bsp_node.neg.length > 0)
         bsp_node.negative = bsp(bsp_node.neg)

    return bsp_node;
}

function classify(line, edge, bsp_node) {

    classification = line.intersects(edge);

    if (classification == Line.INTERSECTS_FORWARD) {
        var I = line.intersection(edge);
        bsp_node.neg.push($L(edge.origin, I))
        bsp_node.pos.push($L(I, edge.end));
    } else if (classification == Line.INTERSECTS_BACKWARD) {
        var I = line.intersection(edge);
        bsp_node.pos.push($L(edge.origin, I))
        bsp_node.neg.push($L(I, edge.end));
    } else if (classification == Line.RIGHT) {
        bsp_node.pos.push(edge);
    } else if (classification == Line.LEFT) {
        bsp_node.neg.push(edge);
    } else if (classification == Line.COINCIDENT) {
        bsp_node.coincident.push(edge);
    }


}

function partition(poly, edge) {

    partition_node = {
        pos: [],
        neg: [],
        cosame: [],
        codiff : []
    }
    T = poly.bsp;

    get_partition(T, edge, partition_node);

    return partition_node;
}

function get_partition(T, edge, partition_node) {

    if (T == null)
        return;

    classification = T.line.intersects(edge);

    if (classification == Line.INTERSECTS_FORWARD) {
        var I = T.line.intersection(edge);
        var first = $L(edge.origin, I)
        var second = $L(I, edge.end);

        pos_partition(T.positive, second, partition_node);
        neg_partition(T.negative, first, partition_node);

    } else if (classification == Line.INTERSECTS_BACKWARD) {
        var I = T.line.intersection(edge);
        var first = $L(edge.origin, I)
        var second = $L(I, edge.end);

        pos_partition(T.positive, first, partition_node);
        neg_partition(T.negative, second, partition_node);

    } else if (classification == Line.RIGHT) {
        pos_partition(T.positive, edge, partition_node);
    } else if (classification == Line.LEFT) {
        neg_partition(T.negative, edge, partition_node);
    } else if (classification == Line.COINCIDENT) {
        /*A = []
        T.coincident.forEach(function (EE) {
            var I = edge.intersection(EE)

        })*/

        // Iterate through the rest of the edges

    }
}

function pos_partition(T, edge, partition_node) {

    if (T != null && T.positive != null) {
        get_partition(T.positive, edge, partition_node);
    } else {
        partition_node.pos.push(edge);
    }
}

function neg_partition(T, edge, partition_node) {

    if (T != null && T.negative != null) {
        get_partition(T.negative, edge, partition_node);
    } else {
        partition_node.neg.push(edge);
    }

}