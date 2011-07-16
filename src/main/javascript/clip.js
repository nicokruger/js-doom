/**
 * Implentation of algorithm to check whether two convex polygons
 * intersect. Based on "The Method of Seperating Axes", described 
 * in Geometric Tools for Computer Graphics, pg 271
 */
/*
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
			if (v2_dot(D, E) < 0) i1 = mid;; else return mid;
		}
	}
}

function poly_intersect(c0, c1) {
	// First, test C)
	//for (var i0 = 1, i1 = c0.length -1; 
}*/
