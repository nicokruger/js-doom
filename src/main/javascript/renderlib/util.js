Cartesian2Screen = function(x1, y1, x2, y2) {
    
    return {
        cartesian2screenx: function(x) {
            return x - x1;
        },
        cartesian2screeny: function(y) {
            return y2 + (-1 * y);
        },
        width: function() {
            return x2 - x1;
        },
        height: function() {
            return y2 - y1;
        },
        toString: function() {
            return "[" + x1 + "," + y1 + "] x [" + x2 + "," + y2 + "]";
        }
        
    }
}


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

    $("#console").val("");
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
    if (t === undefined) return;
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
    if (t === undefined) return;
    var subtimer = t[2].pop();
    var subtimertotal = t[3][subtimer[0]];
    subtimertotal[0] += (Date.now() - subtimer[1]);
    subtimertotal[1] += 1;
    return subtimertotal;
}

function createBlock(x,y, width, height) {
    return $P($V(x-width,y-width), $V(x+width,y-height), $V(x+width,y+height), $V(x-width,y+height))
}

CanvasDrawPoly = function(c2s, ctx, label, poly, colour, texture) {
    ctx.strokeStyle = colour;
    
    var pattern = ctx.createPattern(texture.img, "repeat");
    ctx.fillStyle = pattern;
    
    var first = true;
    ctx.beginPath();
    for (var i = 0; i < poly.edges.length; i++) {
        if (first) {
            ctx.moveTo(c2s.cartesian2screenx(poly.edges[i].origin.x), c2s.cartesian2screeny(poly.edges[i].origin.y));
            first = false;
        } else {
            ctx.lineTo(c2s.cartesian2screenx(poly.edges[i].origin.x), c2s.cartesian2screeny(poly.edges[i].origin.y));
        };
        ctx.lineTo(c2s.cartesian2screenx(poly.edges[i].end.x), c2s.cartesian2screeny(poly.edges[i].end.y));
    }
    ctx.stroke();
    ctx.fill();
    
    ctx.fillStyle = "rgba(220, 220, 220, 1)";
    ctx.font = "bold 12px sans-serif";
    var x = c2s.cartesian2screenx(poly.extremes.x1);
    var y = c2s.cartesian2screeny(poly.extremes.y1);

    ctx.fillText(label, x, y);

}
