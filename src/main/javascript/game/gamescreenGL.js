
GameScreenGL = function(width,height,src) {
    // QuadTree setup
    this.quadtree = setupQuadTree(0,0,4000,4000, 250, 250);

    this.x = 0;
    this.y = 600;
    this.width = width;
    this.height = height;
    // Load level
    var that = this;
    $.getJSON("data/doom.json", function(data) {
        $("#viewport").html("Level loaded");
        that.sectors = get_sectors(data);
        that.sectors.forEach(function (sector) {
            that.quadtree.add(SectorPlacer(sector));
        });
    }).error(function(e) {
        alert("error:" + e.statusText);
    });

    this.tmpctx = document.createElement("canvas").getContext("2d");
    this.tmpctx.canvas.width = this.width;
    this.tmpctx.canvas.height = this.height;

    webGLStart(document.getElementById("canvas"));
}

GameScreenGL.prototype.left = function () {
    this.x -= 32;
}

GameScreenGL.prototype.right = function () {
    this.x += 32;
}
GameScreenGL.prototype.up = function () {
    this.y += 32;
}
GameScreenGL.prototype.down = function () {
    this.y -= 32;
}

GameScreenGL.prototype.draw = function (ctx) {
    Timer.start("Sectordraw");
    $("#viewport").html("Viewport: [" + this.x + "," + this.y + " x " + (this.x+this.width) + "," + (this.y+this.height));

    var viewport = [this.x, this.y, this.x + this.width, this.y + this.height];

    var i = 0;
    var that = this;
    this.data = this.tmpctx.createImageData(this.width,this.height);
    for (var i = 0; i < this.data.data.length; i++)
        this.data.data[i] = 255;

    this.quadtree.forEach(Square(that.x,that.y,that.x + that.width, that.y + that.height), function (sector) {
        sector.draw(viewport, that.data);
        i++;
    });

    Timer.substart("Loading texture");
    handleLoadedTexture(neheTexture, this.data);
    Timer.subend();

    Timer.substart("Draw scene");
    drawScene();
    Timer.subend();

    Timer.end();
    console.log("[ " + i + " sectors ]");
}





















var gl;
function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}


function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}


var shaderProgram;

function initShaders() {
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
}

function handleLoadedTexture(texture, data) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var mvMatrixStack = [];
function mvPushMatrix() {
    var copy = mat4.create();
    mat4.set(mvMatrix, copy);
    mvMatrixStack.push(copy);
}

function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

    var cubeVertexPositionBuffer;
    var cubeVertexTextureCoordBuffer;
    var cubeVertexIndexBuffer;

    function initBuffers() {
        cubeVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
        vertices = [
            // Front face
             0.0, 0.0,  1.0,
             1024.0, 0.0,  1.0,
             1024.0,  1024.0,  1.0,
             0.0,  1024.0,  1.0,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        cubeVertexPositionBuffer.itemSize = 3;
        cubeVertexPositionBuffer.numItems = 4;

        cubeVertexTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
        var textureCoords = [
            // Front face
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
        cubeVertexTextureCoordBuffer.itemSize = 2;
        cubeVertexTextureCoordBuffer.numItems = 4;

        cubeVertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
        var cubeVertexIndices = [
            0, 1, 2,      0, 2, 3,    // Front face
        ];
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
        cubeVertexIndexBuffer.itemSize = 1;
        cubeVertexIndexBuffer.numItems = 6;
}

function initTexture() {
    neheTexture = gl.createTexture();
}

function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
    mat4.ortho(0,1024,0,1024, 0.1, 100.0, pMatrix)
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, [0.0, 0.0, -5.0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, neheTexture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}


function webGLStart(canvas) {
    initGL(canvas);
    initShaders();
    initBuffers();
    initTexture();

    gl.clearColor(1.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    drawScene();
}

