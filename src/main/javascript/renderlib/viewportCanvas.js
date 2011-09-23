
ViewportCanvas = function(sectors,viewport,x1,y1,x2,y2,ctx) {
    this.viewport = viewport;
    this.x1 = x1; this.x2 = x2;
    this.y1 = y1;  this.y2 = y2;
    this.width = x2 - x1;
    this.height = y2 - y1;
    this.ctx = ctx;
    
    var scrollx = viewport.cartesian2screenx(x1);
    var scrolly = viewport.cartesian2screeny(y2);
    console.log("scrolling to " + scrollx + " - " + scrolly);
    $("#gamescreenarea").scrollTop(scrolly);
    $("#gamescreenarea").scrollLeft(scrollx);
    this.sectors = sectors;
  
}

ViewportCanvas.prototype.cartesian2screenx = function(x) {
    return x - this.x1;
}
ViewportCanvas.prototype.cartesian2screeny = function(y) {
    return this.y2 + (-1 * y);
}

ViewportCanvas.prototype.draw = function(textures) {
    Timer.start("Sectordraw");
    
    Timer.substart("patternPoly");
    for (var s = 0; s < this.sectors.length; s++) {
        this.drawPoly(this.viewport, this.ctx, this.sectors[s].label, this.sectors[s].poly, "#0000ff", textures[s]);
    };
    Timer.subend();
    
    Timer.end();
};

ViewportCanvas.prototype.drawPoly = function(viewport, ctx, label, poly, colour, texture) {
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
