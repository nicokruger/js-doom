
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
/*
        console.log("viewport: " + viewport.x1 + "/" + viewport.y1 + "  x   " + viewport.x2 + "/" + viewport.y2);
        console.log("y: " + y + " ---- " + (viewport.y2 - (y)));
*/
        var si1 = (x1 - viewport.x1 + (viewport.y2 - (y)) * data.width)  * 4;
        var si2 = (x2 - viewport.x1 + (viewport.y2 - (y)) * data.width)  * 4;
        for (var x = si1; x  <= si2 + 3; x++) {
                data.data[x] = 255;
        }
    }
}

DrawScanlines = function(viewport, poly, rays) {
    
    var y1 = _.max([poly.extremes.y1, viewport.y1]); // this doesn't change
    var y2 = _.min([poly.extremes.y2, viewport.y2]); // this doesn't change

    var scans = [];
    
    // Nothing here changes, F can change...
    for (var y = y1; y <= y2; y++) {
        var line = [];
        if (rays[y-y1]) { // TODO: this is related to the "triangle bug"
            //var x1 =  (_.max([rays[y - y1][0].origin.x, viewport.x1]) + 0.5) << 0;
            //var x2 =  (_.min([rays[y - y1][0].end.x, viewport.x2]) + 0.5) << 0;
            //var x1 =  _.max([rays[y - y1][0].origin.x, viewport.x1]);
            //var x2 =  _.min([rays[y - y1][0].end.x, viewport.x2]);
            var scanLines = rays[y - y1];
            for (var i = 0; i < scanLines.length; i++) {
                var x1 =  Math.round(_.max([rays[y - y1][i].origin.x, viewport.x1]), 0)
                var x2 =  Math.round(_.min([rays[y - y1][i].end.x, viewport.x2]), 0);
                
                line.push([x1, x2]);
            }
        }
        scans.push(line);
    }
    
    return function (f) {
        for (var y = y1; y <= y2; y++) {
            var scan = scans[y-y1];
            for (var i = 0; i< scan.length;i++) {
                var x1 = scan[i][0]; var x2 = scan[i][1];
                
                f(x1, x2, y);
            }
        }
    }
}

T = function(viewport, poly, rays) {
    var y1 = _.max([poly.extremes.y1, viewport.y1]); // this doesn't change
    var y2 = _.min([poly.extremes.y2, viewport.y2]); // this doesn't change

    this.viewport = viewport;
    this.y1 = y1;
    this.y2 = y2;
    var scans = [];
    
    // Nothing here changes, F can change...
    for (var y = y1; y <= y2; y++) {
        var line = [];
        if (rays[y-y1]) { // TODO: this is related to the "triangle bug"
            //var x1 =  (_.max([rays[y - y1][0].origin.x, viewport.x1]) + 0.5) << 0;
            //var x2 =  (_.min([rays[y - y1][0].end.x, viewport.x2]) + 0.5) << 0;
            //var x1 =  _.max([rays[y - y1][0].origin.x, viewport.x1]);
            //var x2 =  _.min([rays[y - y1][0].end.x, viewport.x2]);
            var scanLines = rays[y - y1];
            for (var i = 0; i < scanLines.length; i++) {
                var x1 =  Math.round(_.max([rays[y - y1][i].origin.x, viewport.x1]), 0)
                var x2 =  Math.round(_.min([rays[y - y1][i].end.x, viewport.x2]), 0);
                
                var si1 = (x1 - this.viewport.x1 + (this.viewport.y2 - (y)) * (this.viewport.width +1))  * 4;
                var si2 = (x2 - this.viewport.x1 + (this.viewport.y2 - (y)) * (this.viewport.width +1))  * 4;
                
                line.push([si1, si2]);
            }
        }
        scans.push(line);
    }
    
    this.scans = scans;
}

T.prototype.draw = function(data) {
    for (var y = this.y1; y <= this.y2; y++) {
        var scan = this.scans[y-this.y1];
        for (var i = 0; i< scan.length;i++) {
            var x1 = scan[i][0]; var x2 = scan[i][1];
            
            /*for (var x = si1; x  <= si2; x++) {
                //data.data[x] = 255;
                //data.data[x + 1] = 255;
                //data.data[x + 2] = 255;
                //data.data[x + 3] = 255;
            }  */
            for (var a = x1; a <= x2  + 3; a++) {
                data.data[a] = 255;
            }
        }
    }
}

Viewport = function(sectors,x1,y1,x2,y2) {
    console.log("new viewport");
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    
    this.width = x2 - x1;
    this.height = y2 - y1;

    this.sectors = sectors;
    this.drawers = [];
    for (var s = 0; s < this.sectors.length; s++) {
        //this.rays[s] = Scanner(this.sectors[s].poly);
        var rays = Scanner(this.sectors[s].poly);
        //this.drawers.push(DrawScanlines(this,  this.sectors[s].poly, rays));
        this.drawers.push(new T(this,  this.sectors[s].poly, rays));

    }
    //this.rays = Scanner(this.sectors[0].poly);
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
    
    //Timer.substart("Pixeler");
    //var pixeler = Pixeler(this, data);
    //Timer.subend();

    /*Timer.substart("sectors:" + this.sectors.length);
    for (var s = 0; s < this.sectors.length; s++) {
        Timer.substart("scanner");
        var rays = this.rays[s];
        Timer.subend();
        
        Timer.substart("drawscanlines");
        DrawScanlines(this,  this.sectors[s].poly, rays, pixeler);
        Timer.subend();
    }
    Timer.subend();*/
    
    Timer.substart("quicker? " + this.drawers.length);
    for (var s = 0; s < this.drawers.length; s++) {
        this.drawers[s].draw(data);
    }
    Timer.subend();

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



