
ViewportBackingCanvas = function(sectors,x1,y1,x2,y2,c2s,ctx_front, ctx_back) {
    this.x1 = x1; this.y1 = y1;
    this.x2 = x2; this.y2 = y2;
    this.width = x2 - x1;
    this.height = y2 - y1;
    this.c2s = c2s;
    this.ctx_front = ctx_front;
    this.ctx_back = ctx_back;
    this.sectors = sectors;
}

ViewportBackingCanvas.prototype.draw = function(textures) {
    Timer.start("Sectordraw");

    Timer.substart("clean back");
    this.ctx_back.fillStyle  = '#000000'; 
    this.ctx_back.fillRect(
        this.c2s.cartesian2screenx(this.x1), 
        this.c2s.cartesian2screeny(this.y1),
        this.c2s.cartesian2screenx(this.x2) - this.c2s.cartesian2screenx(this.x1), 
        this.c2s.cartesian2screeny(this.y2) - this.c2s.cartesian2screeny(this.y1));
    Timer.subend();
    
    Timer.substart("draw-all");
    // 2048
    for (var s = 0; s < this.sectors.length; s++) {
        CanvasDrawPoly(this.c2s, this.ctx_back, this.sectors[s].label, this.sectors[s].poly, "#0000ff", textures[s]);
        //this.drawPoly(this, this.ctx_front, this.sectors[s].label, this.sectors[s].poly, "#0000ff", textures[0]);
    };
    Timer.subend();
    
    Timer.substart("copy to front");
    this.ctx_front.drawImage(this.ctx_back.canvas, 
        this.c2s.cartesian2screenx(this.x1), 
        this.c2s.cartesian2screeny(this.y1),
        this.c2s.cartesian2screenx(this.x2) - this.c2s.cartesian2screenx(this.x1), 
        this.c2s.cartesian2screeny(this.y2) - this.c2s.cartesian2screeny(this.y1),
        0, 0, 
        this.width, this.height);
    Timer.subend();
    
    Timer.end();
};

