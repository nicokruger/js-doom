var screens;
if (!screens) screens = {}; // initialise the top-level module if it does not exist

screens.blit = function(game,width,height) {
    $("#gamescreenarea").append("<canvas id=\"canvas2d\" width=\"" + width + "\" height=\"" + height + "\" />");
    var ctx = $("#canvas2d")[0].getContext("2d");
    var data = ctx.createImageData(width + 1, height + 1);
    
    return {
        cleanup: function() {
            $("#canvas2d").remove();
        },
        
        create: function(sectors, x1, y1, x2, y2) {
            var c2s = new Cartesian2Screen(x1,y1,x2,y2);
            var drawers = renderutil.scanPolys(_.map(sectors, function(s) { return s.poly }), x1,y1,x2,y2);
            return {
                draw: function(textures) {
                    Timer.start("Sectordraw");
                    
                    Timer.substart("clean");
                    var length = ctx.canvas.width * ctx.canvas.height * 4, i = 0;
                    for (; i < length; i++) {
                        data.data[i] = 0;
                    }
                    Timer.subend();
                    
                    renderutil.fillBuffer(drawers, textures, data);
                    
                    Timer.substart("Put image buffer");
                    ctx.putImageData(data, 0, 0);
                    Timer.subend();
                    
                    Timer.end();
                    
                    for (var i = 0; i < sectors.length; i++) {
                        renderutil.drawPoly(c2s, ctx, sectors[i].label, sectors[i].poly, "#0000ff");
                    }
                }
            }
        }
    }
};
