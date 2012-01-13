var doomviews;
if (!doomviews) doomviews = {};

doomviews.debug = function (doomdata) {
    var SELECTED = [];
    var SSECTOR = 0;
    var SECTOR;
    var PARTITION;
    var BB;


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
        _([doomdata.ssectors[SSECTOR]]).each(function (ssector) {

            var i = 0;
            _(ssector.edges).each(function (edge) {
                util.drawDirectionalLine(ctx, edge.origin, edge.end, "rgb(255,255,255)", i);
                i++;
            });

        });
    };
};
