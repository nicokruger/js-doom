
TextureLoader = function() {
    this.texture = {}
    this.unloaded = 0;
}

TextureLoader.prototype.ready = function() {
    return this.unloaded == 0;
}

TextureLoader.prototype.add = function(name, data) {
    this.unloaded += 1;

    var img = new Image();

    console.log("Loading texture " + name + " - " + img.width + " / " + img.height);
    var that = this;

    img.onload = function() {
        var ctx = document.createElement("canvas").getContext("2d");
        ctx.canvas.width = img.width;
        ctx.canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        that.texture[name] = new Texture(ctx.getImageData(0,0, img.width, img.height), img.width, img.height);

        that.unloaded -= 1;
    };

    img.src = data;

}
TextureLoader.prototype.load = function(name, image, width, height) {
    var im = new Image();
    var that = this;
    im.onload = function(ev) {
        var element = document.getElementById("canvas");
        var ctx = document.createElement("canvas").getContext("2d");
        ctx.canvas.width = width;
        ctx.canvas.height = height;

        im = ev.target;

        ctx.drawImage(im, 0, 0);

        that.texture[name] = {
            repeat: new TextureRepeat(ctx.getImageData(0,0,width,height), width, height)
        }
    }
    im.src = image;
}


Texture = function(imageData, width, height) {
    this.imageData = imageData;
    this.width = width;
    this.height = height;
}



