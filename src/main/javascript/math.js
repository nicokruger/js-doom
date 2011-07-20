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
    the_length = Math.sqrt((this.x*this.x) + (this.y*this.y));
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
    return this.x === o.x && this.y === o.y;
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

/**
 * Splits the line on a point on the line
 */
Line.prototype.split = function(v) {
    var l1 = new Line(this.origin, v)
    var l2 = new Line(v, this.end);

    return {before: l1, after: l2}
}

Line.prototype.intersection = function(l) {
    var normal_l = l.canonical().leftNormal();

    var d0 = normal_l.dot(this.origin.sub(l.origin))
    var d1 = normal_l.dot(this.end.sub(l.origin))

    var t = d0 / (d0 - d1);
    if (Math.abs(t) < 0.01) t = 0;
    if (Math.abs(t - 1) < 0.01) t = 1;

    if ((t!= 0 && t!=1) && d0 * d1 < 0) {
        var from_origin = this.canonical();

        return from_origin.mul(t).add(this.origin);
    }

    return null;
}

Line.LEFT = -1
Line.INTERSECTS = 0
Line.RIGHT = 2
Line.COINCIDENT = 3

Line.prototype.intersects = function(l) {
    var normal_l = l.canonical().leftNormal();

    var d0 = normal_l.dot(this.origin.sub(l.origin))
    var d1 = normal_l.dot(this.end.sub(l.origin))

    var t = d0 / (d0 - d1);
    if (Math.abs(t) < 0.01) t = 0;
    if (Math.abs(t - 1) < 0.01) t = 1;

    if ((t!= 0 && t!=1) && d0 * d1 < 0) {
        return Line.INTERSECTS;
    } else if (d0 > 0 || d1 > 0) {
        return Line.RIGHT;
    } else if (d0 < 0 || d1 < 0) {
        return Line.LEFT;
    } else {
        return Line.COINCIDENT;
    }

}


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