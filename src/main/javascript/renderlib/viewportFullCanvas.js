
ViewportFullCanvas = function(sectors,c2s,x1,y2,ctx) {
    this.viewport = viewport;
    this.c2s = c2s;
    this.ctx = ctx;
    this.sectors = sectors;
    
    var scrollx = c2s.cartesian2screenx(x1);
    var scrolly = c2s.cartesian2screeny(y2);
    console.log("scrolling to " + scrollx + " - " + scrolly);
    $("#gamescreenarea").scrollTop(scrolly);
    $("#gamescreenarea").scrollLeft(scrollx);
}

ViewportFullCanvas.prototype.draw = function(textures) {
    Timer.start("Sectordraw");
    
    Timer.substart("patternPoly");
    for (var s = 0; s < this.sectors.length; s++) {
        CanvasDrawPoly(this.c2s, this.ctx, this.sectors[s].label, this.sectors[s].poly, "#0000ff", textures[s]);
    };
    Timer.subend();
    
    Timer.end();
};

