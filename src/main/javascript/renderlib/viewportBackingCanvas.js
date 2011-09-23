
ViewportBackingCanvas = function(sectors,x1,y1,x2,y2,ctx_front, ctx_back) {
    this.x1 = x1; this.x2 = x2;
    this.y1 = y1;  this.y2 = y2;
    this.width = x2 - x1;
    this.height = y2 - y1;
    this.ctx_front = ctx_front;
    this.ctx_back = ctx_back;
    this.sectors = sectors;
}

ViewportBackingCanvas.prototype.cartesian2screenx = function(x) {
    return x - this.x1;
}
ViewportBackingCanvas.prototype.cartesian2screeny = function(y) {
    return this.y2 + (-1 * y);
}

ViewportBackingCanvas.prototype.draw = function(textures) {
    var v = new Viewport2D([], -2048, -2048, 2048, 2048, null, null);
    
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
        this.drawPoly(v, this.ctx_back, this.sectors[s].label, this.sectors[s].poly, "#0000ff", textures[s]);
        //this.drawPoly(this, this.ctx_front, this.sectors[s].label, this.sectors[s].poly, "#0000ff", textures[0]);
    };
    Timer.subend();
    
/*    Timer.substart("clean");
    this.ctx.fillStyle  = '#000000'; 
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    Timer.subend();*/
    
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

ViewportBackingCanvas.prototype.drawPoly = function(viewport, ctx, label, poly, colour, texture) {
    ctx.strokeStyle = colour;
    
    var pattern = ctx.createPattern(texture.img, "repeat");
    ctx.fillStyle = pattern;
    
    var first = true;
    ctx.beginPath();
    for (var i = 0; i < poly.edges.length; i++) {
        if (first) {
            ctx.moveTo(viewport.cartesian2screenx(poly.edges[i].origin.x), viewport.cartesian2screeny(poly.edges[i].origin.y));
            first = false;
        } else {
            ctx.lineTo(viewport.cartesian2screenx(poly.edges[i].origin.x), viewport.cartesian2screeny(poly.edges[i].origin.y));
        };
        ctx.lineTo(viewport.cartesian2screenx(poly.edges[i].end.x), viewport.cartesian2screeny(poly.edges[i].end.y));
    }
    ctx.stroke();
    ctx.fill();
    
    ctx.fillStyle = "rgba(220, 220, 220, 1)";
    ctx.font = "bold 12px sans-serif";
    var x = viewport.cartesian2screenx(poly.extremes.x1);
    var y = viewport.cartesian2screeny(poly.extremes.y1);

    ctx.fillText(label, x, y);

}
