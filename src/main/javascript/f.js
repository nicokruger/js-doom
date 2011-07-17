
reduce = function(l, f, i) {
	var initial = i
	for (i = 0; i < l.length; i++) {
		initial = f( initial, l[i] )	
	}
	return initial
}

each = function(l, f) {
	for (i = 0; i < l.length; i++) {
		f(i);
	}
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

each = function(o, f) {
	for (var key in o) {
		if (o.hasOwnProperty(key)) {
			f(key, o[key])
		}
	}
}

eachSorted = function(o, f) {
	var keys = []
	for (var key in o) {
		if (o.hasOwnProperty(key)) {
			keys.push(key)
		}
	}
	keys.sort()

	for (var i = 0; i < keys.length; i++) {
		f(keys[i], o[keys[i]])
	}
}

empty_array = function(size) {
	a = new Array(size);
	for (var i = 0; i < a.length; i++) {
		a[i] = 0;
	}
	return a;
}
//exports.map = map
//exports.reduce = reduce
//exports.sum = sum
//exports.zip = zip
//exports.combine = combine
