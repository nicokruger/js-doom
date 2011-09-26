var screens;
if (!screens) screens = {}; // initialise the top-level module if it does not exist

screens.gl = function(game,width,height) {
    $("#gamescreenarea").append("<canvas id=\"canvasgl\" width=\"" + width + "\" height=\"" + height + "\" />");
    var canvas = $("#canvasgl")[0];
    
    // attempt to instantiate webgl
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
    
    // Load the shaders
    var glutil = {};
    var shaderloader = screens.gl.shaderloader({vs: "data/shaders/vs.html", fs: "data/shaders/fs.html" }, function(shaders) {
        console.log("SHADERS LOADED");
        glutil.util = renderutil_gl(gl, shaders);
    });
    //var glutil = renderutil_gl(gl);

    // Temporary canvas for background image
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
                    if (!shaderloader.ready()) {
                        console.log("shaderloader not ready... not drawing");
                        return;
                    }
                    
                    Timer.start("gl");
                    glutil.util.drawScene();
                    Timer.end();
                }
            }
        }
    }
}

screens.gl.shaderloader = function(shader_map, callback) {
    var unloaded = 0;
    var shaders = {};
    var store = function(shader) {
        return function (data) {
            console.log("shader: " + shader);
            shaders[shader] = {type: $(data).attr("type"), script: $(data).text()};
            unloaded--;
            
            if (unloaded == 0) {
                callback && callback(shaders);
            }
        }
    }
    for (var shader in shader_map) {
        console.log("fetching shader: " + shader_map[shader]);
        unloaded++;
        $.get(shader_map[shader], store(shader));
    }
    
    return {
        ready: function() { return unloaded == 0; },
    }
}
