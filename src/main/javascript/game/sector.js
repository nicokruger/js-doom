Sector = function (poly, label, texture) {

    this.texture = texture;
    this.poly = poly;
    this.label = label;
    this.rays = Scanner(this.poly);

    this.width = poly.width;
    this.height = poly.height;
    this.x1 = poly.extremes.x1;
    this.y1 = poly.extremes.y1;


}

Sector.prototype.updateComponents = function(x) {
}

Sector.prototype.draw = function(viewport, data) {


}

