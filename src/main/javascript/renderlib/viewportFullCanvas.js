
RendererFullCanvas = function(game,width,height) {
    var game_width = game.extents.x2 - game.extents.x1 + width;
    var game_height = game.extents.y2 - game.extents.y1 + height;
    
    var prev_gamescreen_width = $("#gamescreenarea").width();
    var prev_gamescreen_height = $("#gamescreenarea").height();
    var prev_gamescreen_scroll = $("#gamescreenarea").css("overflow");
    
    $("#gamescreenarea").css("overflow", "scroll");
    $("#gamescreenarea").width(width);
    $("#gamescreenarea").height(height);
    
    $("#gamescreenarea").append("<canvas id=\"canvas\" width=\"" + game_width + "\" height=\"" + game_height + "\"></canvas></div>");
    var ctx = $("#canvas")[0].getContext("2d"); // don't like the [0] subscript - some jQuery thing I don't understand?
    
    return {
        cleanup: function() {
            $("#canvas").remove();
            $("#gamescreenarea").css("overflow", prev_gamescreen_scroll);
            $("#gamescreenarea").width(prev_gamescreen_width);
            $("#gamescreenarea").height(prev_gamescreen_height);
        },
        
        create: function(sectors, x1, y1, x2, y2) {
            var half_viewportwidth = Math.round(width/2, 0);
            var half_viewportheight = Math.round(height/2, 0);
            var c2s = new Cartesian2Screen(game.extents.x1 - half_viewportwidth, 
                game.extents.y1 - half_viewportheight, 
                game.extents.x2 + half_viewportwidth, 
                game.extents.y2 + half_viewportheight);
            
            $("#gamescreenarea").scrollTop(c2s.cartesian2screenx(x1));
            $("#gamescreenarea").scrollLeft(c2s.cartesian2screeny(y2));
            
            console.log("created full canvas viewport from " + x1 + "," + y2 + " extents: " + c2s.toString());
            return {
                draw: function(textures) {
                    Timer.start("Sectordraw");
                    
                    Timer.substart("patternPoly");
                    for (var s = 0; s < sectors.length; s++) {
                        CanvasDrawPoly(c2s, ctx, sectors[s].label, sectors[s].poly, "#0000ff", textures[s]);
                    };
                    Timer.subend();
                    
                    Timer.end();
                }
            }
        }
    }
}



