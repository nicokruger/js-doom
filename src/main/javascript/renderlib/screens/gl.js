var screens;
if (!screens) screens = {}; // initialise the top-level module if it does not exist

screens.gl = function(game,width,height) {
    $("#gamescreenarea").append("<canvas id=\"canvasgl\" width=\"" + width + "\" height=\"" + height + "\" />");

    var canvas = $("#canvasgl")[0];
    
    var gl;
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
    
    var glutil = renderutil_gl(gl);
        
    var  tmpctx = document.createElement("canvas").getContext("2d");
    tmpctx.canvas.width = width + 1;
    tmpctx.canvas.height = height + 1;    
    var data = tmpctx.createImageData(width + 1, height + 1);
        
    return {
        cleanup: function() {
            $("#canvasgl").remove();
        },
        
        create: function(sectors, x1, y1, x2, y2) {
            return {
                draw: function() {
                    Timer.start("gl");
                    glutil.drawScene();
                    Timer.end();
                }
            }
        }
    }
}    
