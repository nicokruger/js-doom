QuadTree = function(x,y) {
    this.x = x;
    this.y = y;
    this.tl = [];
    this.tr = [];
    this.bl = [];
    this.br = [];
};

QuadTree.prototype.add = function() {
    if (o.topLeft(this.x, this.y)) {
        this.tl.push(o);
    };
    if (o.topRight(this.x, this.y)) {
        this.tr.push(o);
    };
    if (o.bottomLeft(this.x, this.y)) {
        this.bl.push(o);
    };
    if (o.bottomRight(this.x, this.y)) {
        this.br.push(o);
    }
};

