$(function () {
    
    var SCREEN_WIDTH = 800;
    var SCREEN_HEIGHT = 800;
    var WORLD = 2500;

    var ssectors = [], ssectors2 = [];
    var linedefs = [];
    var sectors = [];

    var SELECTED = [];
    var SSECTOR = 0;
    var SECTOR;
    var PARTITION;
    var BB;

    var drawSector = function (ctx, sector) {
        ctx.beginPath();
        ctx.moveTo(sector.edges[0].origin.x, sector.edges[0].origin.y);
        for (var i = 1; i < sector.edges.length; i++) {
            ctx.lineTo(sector.edges[i].origin.x, sector.edges[i].origin.y);
        }
        ctx.closePath();
        ctx.fill();
    };
    var drawBB = function (ctx,bb,strokeStyle, fillStyle) {
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
    var drawLine = function(ctx,origin,end,color,label,nodir) {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(end.x, end.y);
        ctx.closePath();
        ctx.stroke();
    };
    var drawDirectionalLine = function (ctx, origin, end, color,label) {
        drawLine(ctx,origin,end,color,label);
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
    
    var populateNodes = function (node, parent, screen) {
        var me = $("<ul>Node<li></li></ul>").appendTo(parent);
        me.hover(function () {
           PARTITION = node.partition;
        });
        var ssector;

        if (typeof(node.left) === "number") {
            ssector = $("<span>SSector: " + node.left + "</span>").appendTo(me);
            ssector.css("color","rgb(0,255,0)");
            ssector.hover(function () {
                SSECTOR = node.left;
                PARTITION = node.partition;
                BB = [node.leftBB,"rgb(0,255,0)", "rgba(0,255,0,0.3)"];
                SECTOR = ssectors2[node.left].sector;
                //gs.center((node.partition.origin.x+node.partition.end.x)/2, (node.partition.end.x+node.partition.end.y)/2);
            });
        } else {
            populateNodes(node.left, me);
        }

        if (typeof(node.right) === "number") {
            ssector = $("<span>SSector: " + node.right + "</span>").appendTo(me);
            ssector.css("color","rgb(0,0,255)");
            ssector.hover(function () {
                SSECTOR = node.right;
                PARTITION = node.partition;
                BB = [node.rightBB,"rgb(0,0,255)", "rgba(0,0,255,0.3)"];
                SECTOR = ssectors2[node.right].sector;
                //gs.center((node.partition.origin.x+node.partition.end.x)/2, (node.partition.end.x+node.partition.end.y)/2);
            });
        } else {
            populateNodes(node.right, me);
        }
    };

    var gs = new gamescreen.create($("#gamescreen"), [SCREEN_WIDTH, SCREEN_HEIGHT], gamescreen.world(WORLD), function (screen, c2s,ctx) {
        //gamescreen.util.grid(ctx, "rgb(0,0,0)", c2s, -WORLD, -WORLD, WORLD, WORLD, 100);
        if (ssectors.length === 0) {
            return;
        }

        _(linedefs).each(function (linedef) {
            drawLine(ctx, linedef.origin, linedef.end, "rgb(130,130,130)","");
        });

        if (typeof(PARTITION) !== "undefined") {
            drawDirectionalLine(ctx, PARTITION.origin, PARTITION.end, "rgb(255,255,0)", "PART");
        }

        if (typeof(BB) !== "undefined") {
            drawBB(ctx, BB[0], BB[1], BB[2]);
        }

        if (typeof(SECTOR) !== "undefined") {
            _(sectors[SECTOR].edges).each(function (edge) {
                ctx.lineWidth = 3;
                drawDirectionalLine(ctx, edge.origin, edge.end, "rgba(255,0,255,0.4)", "");
                ctx.lineWidth = 1;
            });
        }

        screen.console.frame_log("SSECTOR: " + SSECTOR);
        _([ssectors[SSECTOR]]).each(function (ssector) {

            var i = 0;
            _(ssector.edges).each(function (edge) {
                drawDirectionalLine(ctx, edge.origin, edge.end, "rgb(255,255,255)", i);
                i++;
            });

        });
    }, "rgb(0,0,0)");
    SIZEX = 600;
    SIZEY = 600;
    /*X = 400;
    Y = 680;*/
    X = -500;
    Y = 500;
    gs.resize(SIZEX,SIZEY);
    gs.center(X,Y);
    //gs.resize(600,600);
    //gs.center(-500,500);

    var tick = function (time) {
        gs.draw(time);
        window.requestAnimFrame(tick);
    };

    window.requestAnimFrame(tick);

    $.getJSON("hole.json", function (data) {
        ssectors = doom.get_ssectors(data);
        ssectors2 = data.ssectors;
        nodes = doom.get_nodes(data);
        bsp = doom.get_sectors(data)[0].bsp;
        linedefs = doom.get_linedefs(data);
        sectors = doom.get_sectors(data);

        populateNodes(nodes, $("#tree"));
        //populateBsp(bsp, $("#tree"));
        //populateNodes(nodes, $("#tree"));

        KeyboardJS.bind.key("up", function () {
            Y += 16;
            gs.center(X,Y);
        });
        KeyboardJS.bind.key("down", function () {
            Y -= 16;
            gs.center(X,Y);
        });
        KeyboardJS.bind.key("left", function () {
           X -= 16;
           gs.center(X,Y);
        });
        KeyboardJS.bind.key("right", function () {
           X += 16;
           gs.center(X,Y);
        });
        KeyboardJS.bind.key("u", function () {
           SIZEX -= 32;
           SIZEY -= 32;
           gs.resize(SIZEX,SIZEY);
        });
        KeyboardJS.bind.key("j", function () {
           SIZEX += 32;
           SIZEY += 32;
           gs.resize(SIZEX,SIZEY);
        });
    });


});