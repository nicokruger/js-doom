var util;
if (!util) util = {}; // initialise the top-level module if it does not exist

util.drawSector = function (ctx, sector) {
    ctx.beginPath();
    ctx.moveTo(sector.edges[0].origin.x, sector.edges[0].origin.y);
    for (var i = 1; i < sector.edges.length; i++) {
        ctx.lineTo(sector.edges[i].origin.x, sector.edges[i].origin.y);
    }
    ctx.closePath();
    ctx.fill();
};
util.drawBB = function (ctx,bb,strokeStyle, fillStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.fillStyle = fillStyle;

    ctx.beginPath();
    ctx.moveTo(bb.x1,bb.y1);
    ctx.lineTo(bb.x2,bb.y1);
    ctx.lineTo(bb.x2,bb.y2);
    ctx.lineTo(bb.x1,bb.y2);
    ctx.closePath();
    ctx.fill();
};
util.drawLine = function(ctx,origin,end,color,label,nodir) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(end.x, end.y);
    ctx.closePath();
    ctx.stroke();
};
util.drawDirectionalLine = function (ctx, origin, end, color,label) {
    util.drawLine(ctx,origin,end,color,label);
    var cpx = (origin.x + end.x)/2;
    var cpy = (origin.y + end.y)/2;
    ctx.beginPath();
    var angle = Math.atan2(-(end.y-origin.y), -(end.x-origin.x));
    var S = 10;
    ctx.moveTo(Math.floor(cpx + Math.cos(angle - Math.PI/4.0)*S), Math.floor(cpy + Math.sin(angle - Math.PI/4.0)*S));
    ctx.lineTo(cpx,cpy);
    ctx.lineTo(Math.floor(cpx + Math.cos(angle + Math.PI/4.0)*S), Math.floor(cpy + Math.sin(angle + Math.PI/4.0)*S));
    ctx.stroke();
    if (label !== "") {
        ctx.font = "normal 16px courier";
        ctx.fillStyle=color;
        ctx.fillText(label, cpx, cpy);
    }
};

