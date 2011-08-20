Quad = function(x,y) {
    this.x = x;
    this.y = y;
    this.tl = [];
    this.tr = [];
    this.bl = [];
    this.br = [];
};

var pusher = function(l) { return function(v) { l.push(v); } };

Quad.prototype.add = function(o) {
    o.topLeft(this.x, this.y, pusher(this.tl));
    o.topRight(this.x, this.y, pusher(this.tr));
    o.bottomLeft(this.x, this.y, pusher(this.bl));
    o.bottomRight(this.x, this.y, pusher(this.br));

};

Quad.prototype.forEach = function(o, f) {
    var that = this;
    var l = [];
    o.topLeft(this.x,this.y,function(v) { l = _.union(l, that.tl); })
    o.topRight(this.x,this.y,function(v) { l = _.union(l, that.tr); })
    o.bottomLeft(this.x,this.y,function(v) { l = _.union(l, that.bl); })
    o.bottomRight(this.x,this.y,function(v) { l = _.union(l, that.br); })
    l.forEach(f);
}

QuadTree = function (x,y,bl,br,tr,tl) {
    this.x = x;
    this.y = y;
    this.tl = tl;
    this.tr = tr;
    this.bl = bl;
    this.br = br;
};

QuadTree.prototype.add = function(o) {
    var that = this;
    o.topLeft(this.x, this.y, function(v) { that.tl.add(o) });
    o.topRight(this.x, this.y, function(v) { that.tr.add(o) });
    o.bottomLeft(this.x, this.y, function(v) { that.bl.add(o) });
    o.bottomRight(this.x, this.y, function(v) { that.br.add(o) });
}

QuadTree.prototype.forEach = function(o, f) {
    var that = this;
    var l = [];
    o.topLeft(this.x, this.y, function (v) { that.tl.forEach(o, function(x) { l = _.union(l, [x]) }); });
    o.topRight(this.x, this.y, function (v) { that.tr.forEach(o, function(x) { l = _.union(l, [x]) }); });
    o.bottomLeft(this.x, this.y, function (v) { that.bl.forEach(o, function(x) { l = _.union(l, [x]) }); });
    o.bottomRight(this.x, this.y, function (v) { that.br.forEach(o, function(x) { l = _.union(l, [x]) }); });
    l.forEach(f);
}


PointPlacer = function(v) {
    return {
        topLeft: function (x,y,operation) {
            (v.x <= x && v.y >= y) && operation(v);
        },
        topRight: function (x,y,operation) {
            (v.x >= x && v.y >= y) && operation(v);
        },
        bottomLeft: function (x,y,operation) {
            (v.x <= x && v.y <= y) && operation(v);
        },
        bottomRight: function (x,y,operation) {
            (v.x >= x && v.y <= y) && operation(v);
        }
    }
}

PolyPlacer = function(p) {
    var makeSquare = function (x1,y1,x2,y2) {
        return $P($V(x1,y1), $V(x2,y1), $V(x2,y2), $V(x1,y2));
    };
    var threshold = 10000;
    return {
        topLeft: function (x,y,operation) {
            poly_intersect_simple(makeSquare(x-threshold,y,x,y+threshold), p) && operation(p);
        },
        topRight: function (x,y,operation) {
            poly_intersect_simple(makeSquare(x,y,x+threshold,y+threshold), p) && operation(p);
        },
        bottomLeft: function (x,y,operation) {
            poly_intersect_simple(makeSquare(x-threshold,y-threshold,x,y), p) && operation(p);
        },
        bottomRight: function (x,y,operation) {
            poly_intersect_simple(makeSquare(x,y-threshold,x+threshold,y), p) && operation(p);
        }
    }
}


Square = function(x1,y1,x2,y2) {
    return {
        bottomLeft: function (x,y,operation) { PointPlacer($V(x1, y1)).bottomLeft(x,y, operation) },
        bottomRight: function (x,y,operation) { PointPlacer($V(x2, y1)).bottomRight(x, y, operation) },
        topLeft: function (x,y,operation) { PointPlacer($V(x1, y2)).topLeft(x, y, operation) },
        topRight: function (x,y,operation) { PointPlacer($V(x2, y2)).topRight(x, y, operation) }
    }

}