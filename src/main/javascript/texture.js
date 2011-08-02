
TextureLoader = function() {
    this.texture = {}
}

TextureLoader.prototype.load = function(name, image, width, height) {
    im = new Image();
    var that = this;
    im.onload = function(ev) {
        var element = document.getElementById("canvas");
        var ctx = element.getContext("2d");

        im = ev.target;

        ctx.drawImage(im, 200, 100);

        //this.textures[name] = ctx.getImageData(200,100,width,height);
        that.texture[name] = new Texture(ctx.getImageData(200,100,width,height), width, height);

        /*{
            r: function(x,y) { return 255; },
            g: function(x,y) { return 0; },
            b: function(x,y) { return 0; }
        } */
    }
    im.src = image;
}

Texture = function(imageData, width, height) {
    this.imageData = imageData;
    this.width = width;
    this.height = height;
}

Texture.prototype.r = function(x,y) {
    return this.imageData.data[(x + y*this.width) * 4 + 0];
}

Texture.prototype.g = function(x,y) {
    return this.imageData.data[(x + y*this.width) * 4 + 1];
}

Texture.prototype.b = function(x,y) {
    return this.imageData.data[(x + y*this.width) * 4 + 2];
}