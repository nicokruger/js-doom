function tesselate_circle(p, r, points) {

	tris = []
	step = 2*Math.PI/points
	for (var i = 0; i < points; i++) {
		angle = step * i;
		v1 = [p[0],p[1]]
		v2 = [p[0] + r*Math.cos(angle), p[1] + r*Math.sin(angle)]
		v3 = [p[0] + r*Math.cos(angle + step), p[1] + r*Math.sin(angle + step)]
		tris.push([v1,v2,v3])
	}
	return tris;
}

