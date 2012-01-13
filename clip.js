var renderlib;
if (!renderlib) renderlib = {}; // initialise the top-level module if it does not exist

/**
 * This is the direct implementation of the Method of Seperating Axes
 * Page 269 from Geometric tools for computer graphics, converted from
 * their pseudocode to (very simple) JavaScript.
 *
 * NOTE: points for polygons should be in counter-clockwise order.
 *
 * The algorithm works by checking the projections of the two polygons
 * against the plane formed by each of the of normal vector to each of
 * the edges in both polygons. If there is one normal on any polygon
 * for which the intersections of the projections from both polygons
 * do NOT intersect, then the polys are non-intersecting.
 */
renderlib.clip = (function(){

    var compute_interval = function(C, D) {

        var min = D.dot(C[0]);
        var max = min;

        for (var i = 1; i < C.length; i++) {
            var value = D.dot(C[i]);
            if (value < min)
                min = value;
            else if (value > max)
                max = value;

        }

        return [min,max];
    };

    return {
        poly_intersect_simple: function(c0, c1) {
            // First, test C0
            var res = true;
            c0.edges.forEach(function(edge) {

                var e = edge.canonical();
                var D = e.leftNormal();

                var minmax = compute_interval(c0.vertices, D);
                var min0 = minmax[0]; var max0 = minmax[1];
                minmax = compute_interval(c1.vertices, D);
                var min1 = minmax[0]; var max1 = minmax[1];
                if (max1 < min0 || max0 < min1) {
                    res = false;
                }
            });
            if (!res) {
                return false;
            }

            res = true;
            // Now, test C1
            c1.edges.forEach(function(edge) {

                var e = edge.canonical();
                var D = e.leftNormal();

                var minmax = compute_interval(c0.vertices, D);
                var min0 = minmax[0]; var max0 = minmax[1];
                minmax = compute_interval(c1.vertices, D);
                var min1 = minmax[0]; var max1 = minmax[1];
                if (max1 < min0 || max0 < min1) {
                    res = false;
                }

            });
            if (!res) {
                return false;
            }

            return true;
        }
    };
})();

