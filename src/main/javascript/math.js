Vector = function(x, y) {
    this.x = x;
    this.y = y;
}

Vector.prototype.add = function (other) {
	return new Vector(this.x + other.x, this.y + other.y);
}

Vector.prototype.neg = function() {
    return new Vector(-this.x, -this.y);
}

Vector.prototype.sub = function(other) {
    return this.add(other.neg());
}

Vector.prototype.clone = function() {
    return new Vector(this.x, this.y);
}

Vector.prototype.mul = function(t) {
    return new Vector(t * this.x, t * this.y);
}

Vector.prototype.dot = function(other) {
    return (this.x * other.x) + (this.y * other.y)
}

Vector.prototype.unit = function() {
    var the_length = Math.sqrt((this.x*this.x) + (this.y*this.y));
    return new Vector(this.x/the_length, this.y/the_length)

}

Vector.prototype.length = function() {
    return Math.sqrt((this.x*this.x) + (this.y*this.y))
}

Vector.prototype.offset = function(v) {
    var l = new Line(v, this.add(v));
    return l;
}

Vector.prototype.equals = function(o) {
    return (Math.abs(this.x - o.x) < 0.001) && (Math.abs(this.y - o.y) < 0.001);
}

Vector.prototype.leftNormal = function() {
    return new Vector(this.y, -this.x);
}

Vector.prototype.rightNormal = function() {
    return new Vector(-this.y, this.x);
}

Line = function (origin, end) {
    this.origin = origin;
    this.end = end;
}

Line.prototype.canonical = function() {
    var v = new Vector(this.end.x - this.origin.x, this.end.y - this.origin.y);
    return v;
}

Line.prototype.move = function(v) {
    var v = new Line(this.origin.add(v), this.end.add(v));
    return v;
}
Line.prototype.length = function() {
    return this.canonical().length();
}

Line.prototype.equals = function(o) {
    return this.origin.equals(o.origin) && this.end.equals(o.end)
}

Line.toString = function() {
    return "Line(" + this.origin + " -> " + this.end + ")"
}
/**
 * Splits the line on a point on the line
 */
Line.prototype.split = function(v) {
    var l1 = new Line(this.origin, v)
    var l2 = new Line(v, this.end);

    return {before: l1, after: l2}
}

/**
 * NOTE: this will be treated like an infinite line in space,
 * ie. a pure, unbounded line of the form y = ax + b
 *
 * The line passed in, however, will be treated like a
 * bounded line, or an "edge".
 */

Line.prototype.intersection = function(l) {
    var normal_l = this.canonical().leftNormal();

    var d0 = normal_l.dot(l.origin.sub(this.origin))
    var d1 = normal_l.dot(l.end.sub(this.origin))

    var t = d0 / (d0 - d1);
    if (Math.abs(t) < 0.01) t = 0;
    if (Math.abs(t - 1) < 0.01) t = 1;

    if ((t!= 0 && t!=1) && d0 * d1 < 0) {
        var from_origin = l.canonical();

        return from_origin.mul(t).add(l.origin);
    }

    return null;
}

Line.LEFT = -1
Line.INTERSECTS_FORWARD = 0
Line.INTERSECTS_BACKWARD = 1
Line.RIGHT = 2
Line.COINCIDENT = 3

/**
 * NOTE: this will be treated like an infinite line in space,
 * ie. a pure, unbounded line of the form y = ax + b
 *
 * The line passed in, however, will be treated like a
 * bounded line, or an "edge".
 */
Line.prototype.intersects = function(l) {
    var normal_l = this.canonical().leftNormal();

    var d0 = normal_l.dot(l.origin.sub(this.origin))
    var d1 = normal_l.dot(l.end.sub(this.origin))

    var t = d0 / (d0 - d1);
    if (Math.abs(t) < 0.01) t = 0;
    if (Math.abs(t - 1) < 0.01) t = 1;

    if ((t!= 0 && t!=1) && d0 * d1 < 0) {
        if (d1 > 0) {
            return Line.INTERSECTS_FORWARD;
        } else {
            return Line.INTERSECTS_BACKWARD;
        }
    } else if (d0 > 0 || d1 > 0) {
        return Line.RIGHT;
    } else if (d0 < 0 || d1 < 0) {
        return Line.LEFT;
    } else {
        return Line.COINCIDENT;
    }

}

/**
 * Returns the segments of the intersection between two coincident EDGES.
 * Return value is either an empty list, or a list containing two points lines
 * If the return value is the empty list, the two co-incident edges do not
 * have any overlap.
 * Otherwise, the return value is the two points defining the overlap
 *
 *
 */
Line.prototype.coincident_segment = function (l) {
    // Lines MUST be parallel
    var E = l.origin.sub(this.origin);

    var D0 = this.canonical();
    var D1 = l.canonical();

    var sqrLen0 = D0.x * D0.x + D0.y * D0.y;
    var sqrLen1 = D1.x * D1.x + D1.y * D1.y;
    var sqrLenE = E.x * E.x + E.y * E.y;

    /*kross = E.x * l.origin.y - E.y * l.origin.x;
    if (kross * kross > 0.01 * sqrLen0 * sqrLenE) {
        return [];
    } */

    // Test for overlap
    var s0 = D0.dot(E) / sqrLen0;
    var s1 = s0 + D0.dot(D1) / sqrLen0
    var smin = s0 < s1 ? s0 : s1;
    var smax = s0 > s1 ? s0 : s1;

    var p = find_intersection(0.0, 1.0, smin, smax);
    var segs = [];
    for (var i = 0; i < p.length; i++) {
        segs.push(this.origin.add(D0.mul(p[i])))
    }
    return segs;

}

function find_intersection(u0, u1, v0, v1) {
    if (u1 < v0 || u0 > v1)
        return [];

    if (u1 > v0) {
        if (u0 < v1) {
            var p = []
            if (u0 < v0) p.push(v0); else p.push(u0);
            if (u1 > v1) p.push(v1); else p.push(u1);
            return p
        } else {
            return [u0];
        }
    } else {
        return [u1];
    }
}
$V = function(x,y) {
    var v = new Vector(x,y);
    return v;
}

$V.add = function (v1,v2) {
    return v1.add(v2);
}

$V.sub = function (v1,v2) {
    return v1.sub(v2);
}

$V.dot = function (v1, v2) {
    return v1.dot(v2);
}

$V.mul = function(t, v1) {
    return v1.mul(t);
}

$L = function(v1,v2) {
    var l = new Line(v1,v2);
    return l;
}

$L.split = function(l, v) {
    return l.split(v);
}

$L.intersection = function(l1, l2) {
    return l1.intersection(l2);
}

$L.move = function(l, v) {
    return l.move(v);
}

$L.intersects = function(l1,l2) {
    return l1.intersects(l2);
}

$L.coincident_segment = function(l1,l2) {
    return l1.coincident_segment(l2);
}