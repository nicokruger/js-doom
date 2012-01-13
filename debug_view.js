var doomviews;
if (!doomviews) doomviews = {};

doomviews.debug = function (doomdata) {
    var SELECTED = [];
    var SSECTOR = 0;
    var SECTOR;
    var PARTITION;
    var BB;
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
            util.populateNodes(node.left, me);
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
            util.populateNodes(node.right, me);
        }
    };

    //util.populateNodes(nodes, $("#tree"), gs);



    return function (screen, c2s,ctx) {
        if (doomdata.ssectors.length === 0) {
            return;
        }

        _(doomdata.linedefs).each(function (linedef) {
            util.drawLine(ctx, linedef.origin, linedef.end, "rgb(130,130,130)","");
        });

        if (typeof(PARTITION) !== "undefined") {
            util.drawDirectionalLine(ctx, PARTITION.origin, PARTITION.end, "rgb(255,255,0)", "PART");
        }

        if (typeof(BB) !== "undefined") {
            util.drawBB(ctx, BB[0], BB[1], BB[2]);
        }

        if (typeof(SECTOR) !== "undefined") {
            _(doomdata.sectors[SECTOR].edges).each(function (edge) {
                ctx.lineWidth = 3;
                util.drawDirectionalLine(ctx, edge.origin, edge.end, "rgba(255,0,255,0.4)", "");
                ctx.lineWidth = 1;
            });
        }

        screen.console.frame_log("SSECTOR: " + SSECTOR);
        _(doomdata.ssectors).each(function (ssector) {

            var i = 0;
            _(ssector.edges).each(function (edge) {
                util.drawDirectionalLine(ctx, edge.origin, edge.end, "rgb(255,255,255)", i);
                i++;
            });

        });
    };
};

