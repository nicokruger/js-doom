

zip = function(l1, l2, f) {
	var zipped = new Array(l1.length);
	for (i = 0; i < l1.length; i++) {
		zipped[i] = f(l1[i], l2[i])	
	}
	return zipped
}




empty_array = function(size) {
	a = new Array(size);
	for (var i = 0; i < a.length; i++) {
		a[i] = 0;
	}
	return a;
}

Timer = {
    timers : []
};
Timer.start = function (label) {
    var timer = [label, Date.now()];
    this.timers.push(timer);
    return timer;
}
Timer.end = function () {
    var t = this.timers.pop();
    if (typeof(console) !== 'undefined')
        console.log("[Timer " + t[0] + "] " + (Date.now()-t[1]));
    return t;
}
//exports.map = map
//exports.reduce = reduce
//exports.sum = sum
//exports.zip = zip
//exports.combine = combine
