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
function poly_intersect_simple(c0, c1) {

	// First, test C0
	var res = true;
	get_edges(c0).forEach(function(edge) {
		e = v2_add(edge[1], v2_neg(edge[0]))
		D = v2_lh_normal(e)
		minmax = compute_interval(c0, D)
		min0 = minmax[0]; max0 = minmax[1];
		minmax = compute_interval(c1, D)
		min1 = minmax[0]; max1 = minmax[1];
		if (max1 < min0 || max0 < min1) {
			res = false;
		}
	});
	if (!res) {
		return false
	};

	res = true;
	// Now, test C1
	get_edges(c1).forEach(function(edge) {
		e = v2_add(edge[1], v2_neg(edge[0]))
		D = v2_lh_normal(e)
		minmax = compute_interval(c0, D)
		min0 = minmax[0]; max0 = minmax[1];
		minmax = compute_interval(c1, D)
		min1 = minmax[0]; max1 = minmax[1];
		if (max1 < min0 || max0 < min1) {
			res = false;
		}

	});
	if (!res) {
		return false;
	}

	return true;
}

function get_edges(points) {
	edges = [];
	a = 0;
	b = 1;
	while (b < points.length) {
		edges.push([points[a],points[b]]);	
		a++;
		b++;
	}
	edges.push([points[points.length-1],points[0]]);

	return edges;
}


function compute_interval(C, D) {
	min = v2_dot(D, C[0])
	max = min

	for (var i = 1; i < C.length; i++) {
		value = v2_dot(D, C[i]);
		if (value < min)
			min = value;
		else if (value > max)
			max = value;

	}

	return [min,max]
}

