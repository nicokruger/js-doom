
Scanner = function(poly) {
    // Partitioning
    var rays = [];
    var x1 = poly.extremes.x1;
    var y1 = poly.extremes.y1;
    var width = poly.width;
    var height = poly.height;
    
    // All of the following partitions MUST be succesful - we are after all restricting
    // our scanlines to the extreme bounds of the polygon.
    
    // bottom - handled seperately
    var l = poly.partition($L($V(x1-1, y1), $V(x1+width+1, y1))).cosame;
    if (l.length > 0) {
        rays.push(l);
    }
    
    // middle part - iterate through "inner" part of polygon
    for (var y = 1; y <= height-1; y++) {
        rays.push(poly.partition($L($V(x1-1, y+y1), $V(x1+width+1, y+y1))).neg);
    }
    
    //top - reverse it, because it is in the opposite direction than the scanline
    l = poly.partition($L($V(x1-1, y1+height), $V(x1+width+1, y1+height))).codiff;
    if (l.length > 0) {
        rays.push([$L(l[0].end, l[0].origin)]);
    }    
    return rays;
 }



Pixeler = function(viewport, data) {
    return function(x1,x2,y) {
        console.log("viewport: " + viewport.x1 + "/" + viewport.y1 + "  x   " + viewport.x2 + "/" + viewport.y2);
        console.log("y: " + y + " ---- " + (viewport.y2 - (y)));
        var si1 = (x1 - viewport.x1 + (viewport.y2 - (y)) * data.width)  * 4;
        var si2 = (x2 - viewport.x1 + (viewport.y2 - (y)) * data.width)  * 4;
        for (var x = si1; x  <= si2; x++) {
                data.data[x] = 255;
                data.data[x + 1] = 255;
                data.data[x + 2] = 255;
                data.data[x + 3] = 255;
        }
    }
}

Bounder = function(viewport, poly, rays, f) {
    
    var y1 = _.max([poly.extremes.y1, viewport.y1]);
    var y2 = _.min([poly.extremes.y2, viewport.y2]);

    console.log(rays.length + " - " + poly.extremes.y1 + " -> " + poly.extremes.y2);
    for (var y = y1; y <= y2; y++) {
        //console.log(y - y1 + " " + rays[y-y1]);
        if (rays[y-y1])
            f(_.max([rays[y - y1][0].origin.x, viewport.x1]), _.min([rays[y - y1][0].end.x, viewport.x2]), y);
    }
}


Viewport = function(sectors,x1,y1,x2,y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    
    this.sectors = sectors;
}

Viewport.prototype.cartesian2screenx = function(x) {
    return x - this.x1;
}
Viewport.prototype.cartesian2screeny = function(y) {
    return this.y2 + (-1 * y);
}

Viewport.prototype.singleBitmap = function (data) {
    //Timer.substart("create image buffer");
    //var data = ctx.createImageData(this.x2 - this.x1,this.y2 - this.y1);
    //Timer.subend();
    
    var pixeler = Pixeler(this, data);
    var rays = Scanner(this.sectors[0].poly);

    Bounder(this,  this.sectors[0].poly, rays, pixeler);
    
    
    return data;
}


function drawPoly(viewport, ctx, label, poly, colour) {
    ctx.strokeStyle = colour;
    ctx.beginPath();
    for (var i = 0; i < poly.edges.length; i++) {
        ctx.moveTo(viewport.cartesian2screenx(poly.edges[i].origin.x), viewport.cartesian2screeny(poly.edges[i].origin.y));
        ctx.lineTo(viewport.cartesian2screenx(poly.edges[i].end.x), viewport.cartesian2screeny(poly.edges[i].end.y));
    }
    ctx.stroke();

    ctx.fillStyle = "rgba(220, 220, 220, 1)";
    ctx.font = "bold 12px sans-serif";
    var x = viewport.cartesian2screenx(poly.extremes.x1);
    var y = viewport.cartesian2screeny(poly.extremes.y1);

    ctx.fillText(label, x, y);

}



