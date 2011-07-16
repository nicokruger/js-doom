/**
 * Implentation of algorithm to check whether two convex polygons
 * intersect. Based on "The Method of Seperating Axes", described 
 * in Geometric Tools for Computer Graphics, pg 271
 */
function get_middle_index(i0, i1, N) {
	if (i0 < i1)
		return (i0 + i1)/2;
	else
		return (i0 + i1 + N)/ (2 % N);
}

function get_extreme_index(C, D) {
	i0 = 0; i1 = 0;
	while (true) {
		mid = get_middle_index(i0,i1);
		next = (mid + 1) % c.length;
		E = v2_sub(C[next], C[mid]);
		if (v2_dot(D, E) > 0) {
			if (mid != i0) i0 = mid; else return i1;
		} else {
			prev = (mid + C.length - 1) % C.length;
			E = v2_sub(C[mid], C[prev]);
			if (v2_dot(D, E) < 0) i1 = mid; else return mid;
		}
	}
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

/**
 * This is the direct implementation of the Method of Seperating Axes
 * Page 269 from Geometric tools for computer graphics, converted from
 * their pseudocode to (very simple) JavaScript.
 *
 * NOTE: points for polygons should be in counter-clockwise order.
 */
function poly_intersect_simple(c0, c1) {

	// First, test C0
	get_edges(c0).forEach(function(edge) {
		D = v2_rh_normal(v2_add(edge[1], v2_neg(edge[0])))
		minmax = compute_interval(c0, D)
		min0 = minmax[0]; max0 = minmax[1];
		minmax = compute_interval(c1, D)
		min1 = minmax[0]; max1 = minmax[1];
		if (max1 < min0 || max0 < min1) {
			return false;
		}
	});

	// Now, test C1
	get_edges(c1).forEach(function(edge) {
		D = v2_rh_normal(v2_add(edge[1], v2_neg(edge[0])))
		minmax = compute_interval(c0, D)
		min0 = minmax[0]; max0 = minmax[1];
		minmax = compute_interval(c1, D)
		min1 = minmax[0]; max1 = minmax[1];
		if (max1 < min0 || max0 < min1) {
			return false;
		}

	});

	return true;
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

