function tesselate_circle(p, r, points) {

	var tris = []
	var step = 2*Math.PI/points


	for (var i = 0; i < points; i++) {
		angle = step * i;
		v1 = $V(p[0],p[1])
		v2 = $V(p[0] + r*Math.cos(angle), p[1] + r*Math.sin(angle))
		v3 = $V(p[0] + r*Math.cos(angle + step), p[1] + r*Math.sin(angle + step))
		tris.push($P(v1,v2,v3))
	}
	return tris;
}

function circle_to_poly(p, r, points) {

	var edges = []
	var step = 2*Math.PI/points


    var vertices = [];
	for (var i = 0; i < points; i++) {
		var angle = step * i;
		var v = $V(p[0] + r*Math.cos(angle), p[1] + r*Math.sin(angle));
		vertices.push(v);
	}
	return $P(vertices);
}

