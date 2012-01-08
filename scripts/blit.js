var renderlib;
if (!renderlib) renderlib = {}; // initialise the top-level module if it does not exist
if (!renderlib.screens) renderlib.screens = {}

renderlib.screens.blit = function(game,width,height) {
    $("#gamescreenarea").append("<canvas id=\"canvas2d\" width=\"" + width + "\" height=\"" + height + "\" />");
    var ctx = $("#canvas2d")[0].getContext("2d");
    var data = ctx.createImageData(width + 1, height + 1);
    
    return {
        cleanup: function() {
            $("#canvas2d").remove();
        },
        
        create: function(sectors, x1, y1, x2, y2) {
            var c2s = new renderlib.util.Cartesian2Screen(x1,y1,x2,y2);
            var drawers = renderlib.renderutil.scanPolys(_.map(sectors, function(s) { return s.poly }), x1,y1,x2,y2);
            return {
                draw: function(textures) {
                    renderlib.util.Timer.start("Sectordraw");
                    
                    renderlib.util.Timer.substart("clean");
                    var length = ctx.canvas.width * ctx.canvas.height * 4, i = 0;
                    for (; i < length; i++) {
                        data.data[i] = 0;
                    }
                    renderlib.util.Timer.subend();
                    
                    renderlib.renderutil.fillBuffer(drawers, textures, data);
                    
                    renderlib.util.Timer.substart("Put image buffer");
                    ctx.putImageData(data, 0, 0);
                    renderlib.util.Timer.subend();
                    
                    renderlib.util.Timer.end();
                    
                    for (var i = 0; i < sectors.length; i++) {
                        for (var k = 0; k < sectors[i].poly.edges.length; k++) {
                            ctx.beginPath();
                            var one = sectors[i].poly.edges[k].origin;
                            var two = sectors[i].poly.edges[k].end;
                            var g = ctx.createLinearGradient(c2s.cartesian2screenx(one.x), c2s.cartesian2screeny(one.y), 
                                c2s.cartesian2screenx(two.x), c2s.cartesian2screeny(two.y));
                            g.addColorStop(0.0, 'rgba(255, 0, 0, 1.0)');
                            g.addColorStop(1.0, 'rgba(0, 255, 0, 1.0)');
                            ctx.strokeStyle = g;
                            ctx.moveTo(c2s.cartesian2screenx(one.x), c2s.cartesian2screeny(one.y));
                            ctx.lineTo(c2s.cartesian2screenx(two.x), c2s.cartesian2screeny(two.y));
                            ctx.stroke();                            
                        }
                    }
                }
            }
        }
    }
};
