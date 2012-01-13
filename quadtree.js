var renderlib;
if (!renderlib) renderlib = {}; // initialise the top-level module if it does not exist

renderlib.quadtree = (function() {
    var Quad = function(x,y) {
        this.x = x;
        this.y = y;
        this.tl = [];
        this.tr = [];
        this.bl = [];
        this.br = [];
    };

    var pusher = function(l) { return function(v) { l.push(v); }; };

    Quad.prototype.add = function(o) {
        o.topLeft(this.x, this.y, pusher(this.tl));
        o.topRight(this.x, this.y, pusher(this.tr));
        o.bottomLeft(this.x, this.y, pusher(this.bl));
        o.bottomRight(this.x, this.y, pusher(this.br));

    };

    Quad.prototype.forEach = function(o, f) {
        var that = this;
        var l = [];
        o.topLeft(this.x,this.y,function(v) { l = _.union(l, that.tl); });
        o.topRight(this.x,this.y,function(v) { l = _.union(l, that.tr); });
        o.bottomLeft(this.x,this.y,function(v) { l = _.union(l, that.bl); });
        o.bottomRight(this.x,this.y,function(v) { l = _.union(l, that.br); });
        l.forEach(f);
    };

    var QuadTree = function (x,y,bl,br,tr,tl) {
        this.x = x;
        this.y = y;
        this.tl = tl;
        this.tr = tr;
        this.bl = bl;
        this.br = br;
    };

    QuadTree.prototype.add = function(o) {
        var that = this;
        o.topLeft(this.x, this.y, function(v) { that.tl.add(o); });
        o.topRight(this.x, this.y, function(v) { that.tr.add(o); });
        o.bottomLeft(this.x, this.y, function(v) { that.bl.add(o); });
        o.bottomRight(this.x, this.y, function(v) { that.br.add(o); });
    };

    QuadTree.prototype.forEach = function(o, f) {
        var that = this;
        var l = [];
        o.topLeft(this.x, this.y, function (v) { that.tl.forEach(o, function(x) { l = _.union(l, [x]); }); });
        o.topRight(this.x, this.y, function (v) { that.tr.forEach(o, function(x) { l = _.union(l, [x]); }); });
        o.bottomLeft(this.x, this.y, function (v) { that.bl.forEach(o, function(x) { l = _.union(l, [x]); }); });
        o.bottomRight(this.x, this.y, function (v) { that.br.forEach(o, function(x) { l = _.union(l, [x]); }); });
        l.forEach(f);
    };


    var PointPlacer = function(v) {
        return {
            topLeft: function (x,y,operation) {
                if (v.x <= x && v.y >= y) operation(v);
            },
            topRight: function (x,y,operation) {
                if (v.x >= x && v.y >= y) operation(v);
            },
            bottomLeft: function (x,y,operation) {
                if (v.x <= x && v.y <= y) operation(v);
            },
            bottomRight: function (x,y,operation) {
                if (v.x >= x && v.y <= y) operation(v);
            }
        };
    };

    var PolyPlacer = function(p) {
        var makeSquare = function (x1,y1,x2,y2) {
            return $P($V(x1,y1), $V(x2,y1), $V(x2,y2), $V(x1,y2));
        };
        var threshold = 10000;
        return {
            topLeft: function (x,y,operation) {
                if (renderlib.clip.poly_intersect_simple(makeSquare(x-threshold,y,x,y+threshold), p)) operation(p);
            },
            topRight: function (x,y,operation) {
                if (renderlib.clip.poly_intersect_simple(makeSquare(x,y,x+threshold,y+threshold), p)) operation(p);
            },
            bottomLeft: function (x,y,operation) {
                if (renderlib.clip.poly_intersect_simple(makeSquare(x-threshold,y-threshold,x,y), p)) operation(p);
            },
            bottomRight: function (x,y,operation) {
                if (renderlib.clip.poly_intersect_simple(makeSquare(x,y-threshold,x+threshold,y), p)) operation(p);
            }
        };
    };


    var square = function(x1,y1,x2,y2) {
        return {
            bottomLeft: function (x,y,operation) { PointPlacer($V(x1, y1)).bottomLeft(x,y, operation); },
            bottomRight: function (x,y,operation) { PointPlacer($V(x2, y1)).bottomRight(x, y, operation); },
            topLeft: function (x,y,operation) { PointPlacer($V(x1, y2)).topLeft(x, y, operation); },
            topRight: function (x,y,operation) { PointPlacer($V(x2, y2)).topRight(x, y, operation); }
        };

    };

    var setupQuadTree = function (x1,y1,x2,y2,max_width,max_height) {
        var width = x2 - x1;
        var height = y2 - y1;

        var x = (x2+x1)/2;
        var y = (y2+y1)/2;

        if (width <= max_width && height <= max_height) {
            return new Quad(x,y);
        } else {
            var bl = setupQuadTree(x1, y1, x, y, max_width, max_height);
            var br = setupQuadTree(x, y1, x2, y, max_width, max_height);
            var tr = setupQuadTree(x, y, x2, y2, max_width, max_height);
            var tl = setupQuadTree(x1, y, x, y2, max_width, max_height);
            return new QuadTree(x, y, bl, br, tr, tl);

        }
    };
    
    return {
        Quad: Quad,
        QuadTree: QuadTree,
        PointPlacer: PointPlacer,
        PolyPlacer: PolyPlacer,
        square: square,
        setupQuadTree: setupQuadTree
    };
})();

