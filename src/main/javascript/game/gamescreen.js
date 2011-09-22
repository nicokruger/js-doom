
GameScreen = function(width,height,data,game, viewportCreator) {
    var that = this;

    this.game = game;
    this.width = width;
    this.height = height;
    this.viewportCreator = viewportCreator;
    
    this.textureLoader = new TextureLoader();
    this.textureLoader.fromUrl("doomlogo2", "data/doomlogo.png", 256, 256); 
    this.textureLoader.fromUrl("test", "data/test.png", 256, 256); 
    _.keys(data.texturedata).forEach(function (texturename) {
        that.textureLoader.fromData(texturename, data.texturedata[texturename]);
        $("#console").val($("#console").val() + "\nLoading texture " + texturename);
    });

    this.sectors = game.sectors;
    // QuadTree setup
    this.quadtree = setupQuadTree(0,0,4000,4000, 250, 250);
    game.sectors.forEach(function (sector) {
        that.quadtree.add(SectorPlacer(sector));
    });

    this.setCenter(game.x, game.y);

}

GameScreen.prototype.setupViewport = function() {
    var sectors = [];
    this.quadtree.forEach(Square(this.x, this.y, this.x + this.width, this.y + this.height), function (sector) {
        sectors.push(sector);
    });
    this.sectors = sectors;
    
    //this.viewport = new Viewport(sectors, this.x, this.y, this.x + this.width,  this.y + this.height);
    // TODO: sectors should not go into constructor, should be passed during draw
    this.viewport = this.viewportCreator(sectors, this.x, this.y, this.x + this.width, this.y + this.height);

}                                                                                   

GameScreen.prototype.left = function () {
    this.x -= 32;
    this.setupViewport();
}

GameScreen.prototype.right = function () {
    this.x += 32;
    this.setupViewport();
}
GameScreen.prototype.up = function () {
    this.y += 32;
    this.setupViewport();
}
GameScreen.prototype.down = function () {
    this.y -= 32;
    this.setupViewport();
}

GameScreen.prototype.setCenter = function (x,y) {
    this.x = x - this.width / 2;
    this.y = y - this.height / 2;
    
    this.setupViewport();
    
}

GameScreen.prototype.draw = function () {
    if (!this.textureLoader.ready()) {
        console.log("Textureloader not ready... aborting draw");
        return;
    }

    // TODO: Move this to constructor
    var that = this;
    this.textures = _.map(this.sectors, function(sector) { return {
        width: that.textureLoader.texture[sector.texture].width,
        height: that.textureLoader.texture[sector.texture].height,
        imageData: that.textureLoader.texture[sector.texture].imageData,
        img: that.textureLoader.texture[sector.texture].img
    }});
    
        
    this.viewport.draw(this.textures);

}

