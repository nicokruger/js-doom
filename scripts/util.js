var renderlib;
if (!renderlib) renderlib = {}; // initialise the top-level module if it does not exist

renderlib.util = (function() {
    var printTimer = function (t,indent) {
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
    var Timer = {
        timers : []
    };

    Timer.start = function (label) {
        var timer = [label, Date.now(), [], {}];
        this.timers.push(timer);
        return timer;
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


    return {
        Timer: Timer,
        Cartesian2Screen: function(x1, y1, x2, y2) {
            
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
        },
        zip: function(l1, l2, f) {
            var zipped = new Array(l1.length);
            for (i = 0; i < l1.length; i++) {
                zipped[i] = f(l1[i], l2[i])	
            }
            return zipped
        },
        empty_array: function(size) {
            a = new Array(size);
            for (var i = 0; i < a.length; i++) {
                a[i] = 0;
            }
            return a;
        },
    }
    
})();
//    function createBlock(x,y, width, height) {
   //     return $P($V(x-width,y-width), $V(x+width,y-height), $V(x+width,y+height), $V(x-width,y+height))
    //}


