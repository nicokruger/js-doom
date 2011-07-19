function bsp(edges) {
    var line = edges[0]

    return bsp_gather_node(line, edges);

}

function bsp_gather_node(line, edges) {

    var bsp_node = {}
    bsp_node.line = line
    bsp_node.positive = null
    bsp_node.negative = null
    bsp_node.coincident = []
    bsp_node.pos = []
    bsp_node.neg = []

    edges.forEach(function (edge) {
        classify(line, edge, bsp_node)
    })

    if (bsp_node.pos.length > 0)
        bsp_node.positive = bsp(bsp_node.pos)
    if (bsp_node.neg.length > 0)
        bsp_node.negative = bsp(bsp_node.neg)

//    delete bsp_node.pos;
//    delete bsp_node.neg;

    return bsp_node;
}

function classify(line, edge, bsp_node) {

    var l = v2_add(line[1], v2_neg(line[0]))
    l = v2_lh_normal(l)

    var e0 = v2_add(edge[0], v2_neg(line[0]))
    var e1 = v2_add(edge[1], v2_neg(line[0]))

    var d0 = v2_dot(l, e0)
    var d1 = v2_dot(l, e1)

    var t = d0 / (d0 - d1);
    if (Math.abs(t) < 0.01) t = 0;
    if (Math.abs(t - 1) < 0.01) t = 1;

    var pos = []
    var neg = []

    if ((t!= 0 && t!=1) && d0 * d1 < 0) {
        // edge crosses the line

        // get the intersection point
        var from_origin = v2_add(edge[1], v2_neg(edge[0]))
        from_origin[0] *= t
        from_origin[1] *= t

        var I = v2_add(edge[0], from_origin)

        if (d1 > 0) {
            var subedge_neg = [edge[0], I];
            var subedge_pos = [I, edge[1]];
        } else {
            var subedge_pos = [edge[0], I];
            var subedge_neg = [I, edge[1]];
        }

        bsp_node.pos.push(subedge_pos);
        bsp_node.neg.push(subedge_neg);

    } else if (d0 > 0 || d1 > 0) {
        bsp_node.pos.push(edge);
    } else if (d0 < 0 || d1 < 0) {
        bsp_node.neg.push(edge);
    } else {
        bsp_node.coincident.push(edge);
    }


}