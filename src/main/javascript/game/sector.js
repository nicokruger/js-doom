function Sector(poly, label, texture) {

  this.texture = texture;
  this.poly = poly;
  this.label = label;

  this.updateComponent = function (x) {
  }

  this.draw = function (ctx) {

    drawTexture(ctx, this.poly, textureLoader.texture[this.texture].repeat);

    Timer.substart("sector rest");
    drawPoly(ctx, this.poly, "#0000ff");

    ctx.fillStyle = "rgba(220, 220, 220, 1)";
    ctx.font = "bold 12px sans-serif";
    var x = this.poly.extremes.x1;
    var y = this.poly.extremes.y1;

    ctx.fillText(this.label, x, y);
    Timer.subend();
  }
}
