
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

combine = function(x,y) {
	n = []
	x.each(function(key,value) {
		n[key] = []
		value.each(function(key2,value2) {
			n[key][key2] = value2
		})
	})
	y.each(function(key,value) {
		value.each(function(key2,value2) {
			n[key][key2] = value2
		})
	})

	return n
}

Object.prototype.keys = function(f) {
	keys = []
	for (var key in this) {
		if (this.hasOwnProperty(key)) {
			keys.push(key)
		}
	}
	return keys
}

Object.prototype.each = function(f) {
	for (var key in this) {
		if (this.hasOwnProperty(key)) {
			f(key, this[key])
		}
	}
}

Object.prototype.eachSorted = function(f) {
	var keys = []
	for (var key in this) {
		if (this.hasOwnProperty(key)) {
			keys.push(key)
		}
	}
	keys.sort()

	for (var i = 0; i < keys.length; i++) {
		f(keys[i], this[keys[i]])
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
