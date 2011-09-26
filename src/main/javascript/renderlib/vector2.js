$V = (function() {
    Vector = function(x, y) {
        this.x = Math.round(x*100,0) / 100;
        this.y = Math.round(y*100,0) / 100;
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
        return (Math.abs(this.x - o.x) < 0.01) && (Math.abs(this.y - o.y) < 0.01);
    }

    Vector.prototype.leftNormal = function() {
        return new Vector(this.y, -this.x);
    }

    Vector.prototype.rightNormal = function() {
        return new Vector(-this.y, this.x);
    }

    var V = function(x,y) {
        var v = new Vector(x,y);
        return v;
    }
    V.add = function (v1,v2) {
        return v1.add(v2);
    }

    V.sub = function (v1,v2) {
        return v1.sub(v2);
    }

    V.dot = function (v1, v2) {
        return v1.dot(v2);
    }

    V.mul = function(t, v1) {
        return v1.mul(t);
    }
    
    return V;
        
})();
