map = function (l, f) {
	var ret = new Array(l.length)
	for (i = 0; i < l.length; i++) {
		ret[i] = f(l[i])
	}
	return ret
}

reduce = function(l, f, i) {
	var initial = i
	for (i = 0; i < l.length; i++) {
		initial = f( initial, l[i] )	
	}
	return initial
}

zip = function(l1, l2, f) {
	var zipped = new Array(l1.length);
	for (i = 0; i < l1.length; i++) {
		zipped[i] = f(l1[i], l2[i])	
	}
	return zipped
}

sum = function(l) {
	return reduce(l, function(a, b) { return a+ b; },
		0)
}

exports.map = map
exports.reduce = reduce
exports.sum = sum
exports.zip = zip
