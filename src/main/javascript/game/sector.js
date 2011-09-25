Sector = function (poly, label, textures) {

    this.textures = textures;
    this.texture_index = 0;
    this.texture = this.textures[this.texture_index];
    
    this.poly = poly;
    this.label = label;
    this.rays = viewport2d.scanPoly(this.poly);

    this.width = poly.width;
    this.height = poly.height;
    this.x1 = poly.extremes.x1;
    this.y1 = poly.extremes.y1;


}

Sector.prototype.tick = function(x) {
    this.texture_index++;
    if (this.texture_index >= this.textures.length) {
        this.texture_index = 0;
    }
    this.texture = this.textures[this.texture_index];
}

Sector.prototype.draw = function(viewport, data) {


}

