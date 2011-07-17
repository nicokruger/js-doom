function v2_add(v1,v2) {
	return zip(v1,v2, function(x,y) { return x+y; });
}

function v2_neg(v1) {
	return v1.map(function (x) { return -x; } );
}

function v2_dot(v1,v2) {
	return sum(zip(v1,v2, function(x,y) { return x*y }));
}

function v2_normalise(v) {
	the_length = Math.sqrt(sum(v.map(function(x) { return x*x })));	
	return v.map(function(x) { return x/the_length; });
}

function v2_length(p1,p2) {
	normed = zip(p1,p2,function(x,y) { return y-x; });
	return Math.sqrt(sum(normed.map(function(x) { return x*x } )));

}

function v2_rh_normal(v) {
	return [-v[1], v[0]];
}

function v2_lh_normal(v) {
	return [v[1], -v[0]];
}




