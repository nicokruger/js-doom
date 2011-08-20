

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
    var timer = [label, Date.now(), [], {}];
    this.timers.push(timer);
    return timer;
}

printTimer = function (t,indent) {
    var prefix="";
    for (var i = 0; i < indent; i++) prefix+=" ";

    // print the subtimers
    var subtimers = t[3];
    _.keys(subtimers).forEach(function (subtimername) {
        var subtimes = subtimers[subtimername][1];
        var subtiming = subtimers[subtimername][0];

        $("#console").val($("#console").val() + "\n" + prefix + "  [S][" + subtimername +"] " + subtiming + " <" + subtimes + ">");
    });
    $("#console").val($("#console").val() + "\n" + "[T][" + t[0] + "] " + (t[1]));
}
Timer.end = function () {
    var t = this.timers.pop();
    t[1] = (Date.now()-t[1]);
    if (typeof(console) !== 'undefined')
        printTimer(t, this.timers.length*4);
    return t;
}

Timer.substart = function(label) {
    var t = _.last(this.timers);
    var subtimers = t[2];
    var subtimerstotals = t[3];
    if (!_.contains(_.keys(subtimerstotals), label)) {
        subtimerstotals[label] = [0,0];
    };
    var subtimer = [label, Date.now()]
    subtimers.push(subtimer);
    return subtimer;
}

Timer.subend = function() {
    var t = _.last(this.timers);
    var subtimer = t[2].pop();
    var subtimertotal = t[3][subtimer[0]];
    subtimertotal[0] += (Date.now() - subtimer[1]);
    subtimertotal[1] += 1;
    return subtimertotal;
}

function createBlock(x,y, width, height) {
    return $P($V(x-width,y-width), $V(x+width,y-height), $V(x+width,y+height), $V(x-width,y+height))
}

function SectorPlacer(sector) {
    var polyPlacer = PolyPlacer(sector.poly);

    var operationInterceptor = function(operation) {
        return function (polygon) {
            operation(sector);
        };
    }
    return {
        topLeft: function (x,y,operation) {
            polyPlacer.topLeft(x,y,operationInterceptor(operation));
        },
        topRight: function (x,y,operation) {
            polyPlacer.topRight(x,y,operationInterceptor(operation));
        },
        bottomLeft: function (x,y,operation) {
            polyPlacer.bottomLeft(x,y,operationInterceptor(operation));
        },
        bottomRight: function (x,y,operation) {
            polyPlacer.bottomRight(x,y,operationInterceptor(operation));
        }
    }
}
