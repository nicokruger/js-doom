var renderlib;
if (!renderlib) renderlib = {}; // initialise the top-level module if it does not exist
if (!renderlib.screens) renderlib.screens = {}

renderlib.screens.gl = function(game,width,height) {
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
    var shaderloader = renderlib.screens.gl.shaderloader({vs: "data/shaders/vs.html", fs: "data/shaders/fs.html" }, function(shaders) {
        console.log("SHADERS LOADED");
        glutil.util = renderlib.renderutil_gl(gl, shaders);
    });

    // Temporary canvas for background image
    var  tmpctx = document.createElement("canvas").getContext("2d");
    tmpctx.canvas.width = width ;
    tmpctx.canvas.height = height;    
    var data = tmpctx.createImageData(width, height);
    delete tmpctx; // free memory ? probably not, I reckon the imagedata reference will keep it alive
        
    var i = 0;
    return {
        cleanup: function() {
            $("#canvasgl").remove();
        },
        
        create: function(sectors, x1, y1, x2, y2) {
            var drawers = renderlib.renderutil.scanPolys(_.map(sectors, function(s) { return s.poly }), x1,y1,x2-1,y2-1);
            renderlib.util.Timer.substart("clear");
            for (var i = 0; i < width * height * 4; i++) {
                data.data[i] = 0;
            }
            renderlib.util.Timer.subend();
            
            return {
                draw: function(textures) {
                    renderlib.util.Timer.start("gl");
                    if (!shaderloader.ready()) {
                        console.log("shaderloader not ready... not drawing");
                        return;
                    }

                    renderlib.util.Timer.substart("fill buffer");
                    renderlib.renderutil.fillBuffer(drawers, textures, data);
                    renderlib.util.Timer.subend();
                    
                    //glutil.util.loadTexture(textures[i].imageData);
                    renderlib.util.Timer.substart("fill texture");
                    glutil.util.loadTexture(data);
                    renderlib.util.Timer.subend();
                    renderlib.util.Timer.substart("draw scene");
                    glutil.util.drawScene();
                    renderlib.util.Timer.subend();
                    renderlib.util.Timer.end();
                }
            }
        }
    }
}

renderlib.screens.gl.shaderloader = function(shader_map, callback) {
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
