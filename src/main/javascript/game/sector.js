function Sector(poly, label, texture) {

    this.texture = texture;
    this.poly = poly;
    this.label = label;

    this.updateComponent = function (x) {
    }

    this.draw = function (ctx) {

        drawTexture(ctx, this.poly, textureLoader.texture[this.texture].repeat);

        Timer.substart("sector rest");
        drawPoly(ctx, this.label, this.poly, "#0000ff");
        Timer.subend();
    }
}

/**
 * For testing only.
 */
function drawPoly(ctx, label, poly, colour) {
    ctx.strokeStyle = colour;
    ctx.beginPath();
    poly.edges.forEach(function (edge) {
        ctx.moveTo(edge.origin.x, edge.origin.y);
        ctx.lineTo(edge.end.x, edge.end.y);
    });
    ctx.stroke();

    ctx.fillStyle = "rgba(220, 220, 220, 1)";
    ctx.font = "bold 12px sans-serif";
    var x = poly.extremes.x1;
    var y = poly.extremes.y1;

    ctx.fillText(label, x, y);

}


