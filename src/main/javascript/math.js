function v2_add(v1,v2) {
	return zip(v1,v2, function(x,y) { return x+y; });
}

function v2_neg(v1) {
	return map(v1, function (x) { return -x; } );
}

function v2_dot(v1,v2) {
	return sum(zip(v1,v2, function(x,y) { return x*y }));
}

// retrieve the normal of an edge

function v2_unit(v) {
	length = sqrt(sum(map(v, function(x) { return x*x })));	
	return map(v, function(x) { return x/length; });
}
