RendererBackingCanvas = function(game,width,height) {
    var extents_width = game.extents.x2 - game.extents.x1 + width;
    var extents_height = game.extents.y2 - game.extents.y1 + height;
    $("#gamescreenarea").width(width);
    $("#gamescreenarea").height(height);
    $("#gamescreenarea").append("<canvas id=\"canvas\" width=\"" + width + "\" height=\"" + height + "\" />");
    $("#gamescreenarea").append("<canvas id=\"canvas_hidden\" width=\"" + extents_width +"\" height=\"" + extents_height + "\" style=\"display: none\"/>");
    var ctx_front = $("#canvas")[0].getContext("2d");
    var ctx_back = $("#canvas_hidden")[0].getContext("2d");
    return {
        cleanup: function() {
            $("#canvas").remove();
            $("#canvas_hidden").remove();
        },
        
        create: function(sectors, x1, y1, x2, y2) {
            var half_viewportwidth = Math.round(width/2, 0);
            var half_viewportheight = Math.round(height/2, 0);
            var c2s = new Cartesian2Screen(game.extents.x1 - half_viewportwidth, 
                game.extents.y1 - half_viewportheight, 
                game.extents.x2 + half_viewportwidth, 
                game.extents.y2 + half_viewportheight);
            
            return  {
                draw: function(textures) {
                    Timer.start("Sectordraw");

                    Timer.substart("clean back");
                    ctx_back.fillStyle  = '#000000'; 
                    ctx_back.fillRect(
                        c2s.cartesian2screenx(x1), 
                        c2s.cartesian2screeny(y1),
                        c2s.cartesian2screenx(x2) - c2s.cartesian2screenx(x1), 
                        c2s.cartesian2screeny(y2) - c2s.cartesian2screeny(y1));
                    Timer.subend();
                    
                    Timer.substart("draw-all");
                    for (var s = 0; s < sectors.length; s++) {
                        CanvasDrawPoly(c2s, ctx_back, sectors[s].label, sectors[s].poly, "#0000ff", textures[s]);
                    };
                    Timer.subend();
                    
                    console.log("width/height: " + width + " / " + height);
                    Timer.substart("copy to front");
                    ctx_front.drawImage(ctx_back.canvas, 
                        c2s.cartesian2screenx(x1), 
                        c2s.cartesian2screeny(y1),
                        c2s.cartesian2screenx(x2) - c2s.cartesian2screenx(x1), 
                        c2s.cartesian2screeny(y2) - c2s.cartesian2screeny(y1),
                        0, 0, 
                        width, height);
                    Timer.subend();
                    
                    Timer.end();
                }
            }
        }
    }
};


