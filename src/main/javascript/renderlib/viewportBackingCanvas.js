
ViewportBackingCanvas = function(sectors,x1,y1,x2,y2,extents,ctx_front, ctx_back) {
    this.x1 = x1; this.y1 = y1;
    this.x2 = x2; this.y2 = y2;
    this.width = x2 - x1;
    this.height = y2 - y1;
    this.extents = extents;
    this.ctx_front = ctx_front;
    this.ctx_back = ctx_back;
    this.sectors = sectors;
}

ViewportBackingCanvas.prototype.draw = function(textures) {
    var v = new Cartesian2Screen(this.extents.x1, this.extents.y1, this.extents.x2, this.extents.y2);
    
    Timer.start("Sectordraw");

    Timer.substart("clean back");
    this.ctx_back.fillStyle  = '#000000'; 
    this.ctx_back.fillRect(
        v.cartesian2screenx(this.x1), 
        v.cartesian2screeny(this.y1),
        v.cartesian2screenx(this.x2) - v.cartesian2screenx(this.x1), 
        v.cartesian2screeny(this.y2) - v.cartesian2screeny(this.y1));
    Timer.subend();
    
    Timer.substart("draw-all");
    // 2048
    for (var s = 0; s < this.sectors.length; s++) {
        CanvasDrawPoly(v, this.ctx_back, this.sectors[s].label, this.sectors[s].poly, "#0000ff", textures[s]);
        //this.drawPoly(this, this.ctx_front, this.sectors[s].label, this.sectors[s].poly, "#0000ff", textures[0]);
    };
    Timer.subend();
    
    Timer.substart("copy to front");
    this.ctx_front.drawImage(this.ctx_back.canvas, 
        v.cartesian2screenx(this.x1), 
        v.cartesian2screeny(this.y1),
        v.cartesian2screenx(this.x2) - v.cartesian2screenx(this.x1), 
        v.cartesian2screeny(this.y2) - v.cartesian2screeny(this.y1),
        0, 0, 
        this.width, this.height);
    Timer.subend();
    
    Timer.end();
};

