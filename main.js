
$(function () {

    var mode = 0;
    var topdownview;
    var debugview;
    var view = function (screen, c2s, ctx) {
        if (mode === 0) {
            screen.console.frame_log("Normal");
            topdownview(screen, c2s, ctx);
        } else {
            screen.console.frame_log("Debug");
            debugview(screen, c2s, ctx);
        }
    };
    var map = function (map) {
        $.getJSON("/data/maps/" + map, function (data) {
            var doomdata = {
                ssectors: doom.get_ssectors(data),
                nodes: doom.get_nodes(data),
                linedefs: doom.get_linedefs(data),
                sectors: doom.get_sectors(data)
            };

            topdownview = doomviews.topdown(doomdata);
            debugview = doomviews.debug(doomdata);

            views.scrollableView($("#gamescreen"), view, $(window).width(), $(window).height()-100,
                data.player1[0], data.player1[1],
                gamescreen.world(data.extents.x1, data.extents.y1, data.extents.x2, data.extents.y2));
        });
    };

    map($("#map").val());
    $("#map").change(function () {
        map($("#map").val());
    });
});