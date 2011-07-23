Polygon = function(vertices) {
    // for easy drawing
    this.vertices = vertices

    // get the edges
    this.edges = reduce(this.vertices, function(e, b) {
        e[0].push($L(e[1], b));
        return [e[0], b];
    }, [[], this.vertices[this.vertices.length-1]])[0]

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