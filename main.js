
$(function () {
    var currentMap = 0;
    var mode = 2;
    var topdownview;
    var debugview;
    var gs;
    var nodes;

    var view = function (screen, c2s, ctx) {
        if (mode === 0) {
            screen.console.frame_log("<span class=\"mapname\">" + maps[currentMap] + "</span>");
            topdownview.drawFunction(screen, c2s, ctx);
        } else if (mode == 1) {
            screen.console.frame_log("<span class=\"mapname\">Debug</span>");
            debugview(screen, c2s, ctx);
        } else if (mode == 2) {
            screen.console.frame_log("<span class=\"mapname\">Waiting for map: " + maps[currentMap] + "</span>");
        }
    };
    var map = function (map) {
        mode = 2;
        $.getJSON("data/maps/" + map, function (data) {
            mode = 0;
            var doomdata = {
                ssectors: doom.get_ssectors(data),
                nodes: doom.get_nodes(data),
                linedefs: doom.get_linedefs(data),
                sectors: doom.get_sectors(data),
                extents: data.extents
            };

            nodes = doomdata.nodes;
            topdownview = doomviews.topdown(doomdata);
            debugview = doomviews.debug(doomdata);

            gs = views.scrollableView($("#gamescreen"), view, $(window).width(), $(window).height()-150,
                data.player1[0], data.player1[1],
                gamescreen.world(data.extents.x1, data.extents.y1, data.extents.x2, data.extents.y2));
            gs.onViewChange(function (x1,y1,x2,y2) {
                topdownview.onViewChange(x1,y1,x2,y2);
            });
            gs.center(data.player1[0], data.player1[1]);
        });
    };

    map(maps[currentMap]);

    KeyboardJS.bind.key("q", function () {
        currentMap++;
        if (currentMap > maps.lenth-1) {
            currentMap = 0;
        }
        map(maps[currentMap]);
    });
    KeyboardJS.bind.key("w", function () {
        currentMap--;
        if (currentMap  < 0) {
            currentMap = maps.length - 1;
        }
        map(maps[currentMap]);
    });

    KeyboardJS.bind.key("z", function () {
        if (mode === 0) {
            mode = 1;
        } else {
            mode = 0;
        }
    });
});

var maps = ["doom2-MAP01.json",
"doom2-MAP02.json",
"doom2-MAP03.json",
"doom2-MAP04.json",
"doom2-MAP05.json",
"doom2-MAP06.json",
"doom2-MAP07.json",
"doom2-MAP08.json",
"doom2-MAP09.json",
"doom2-MAP10.json",
"doom2-MAP11.json",
"doom2-MAP12.json",
"doom2-MAP13.json",
"doom2-MAP14.json",
"doom2-MAP15.json",
"doom2-MAP16.json",
"doom2-MAP17.json",
"doom2-MAP18.json",
"doom2-MAP19.json",
"doom2-MAP20.json",
"doom2-MAP21.json",
"doom2-MAP22.json",
"doom2-MAP23.json",
"doom2-MAP24.json",
"doom2-MAP25.json",
"doom2-MAP26.json",
"doom2-MAP27.json",
"doom2-MAP28.json",
"doom2-MAP29.json",
"doom2-MAP30.json",
"doom2-MAP31.json",
"doom2-MAP32.js",
"doom-E1M1.json",
"doom-E1M2.json",
"doom-E1M3.json",
"doom-E1M4.json",
"doom-E1M5.json",
"doom-E1M6.json",
"doom-E1M7.json",
"doom-E1M8.json",
"doom-E1M9.json",
"doom-E2M1.json",
"doom-E2M2.json",
"doom-E2M3.json",
"doom-E2M4.json",
"doom-E2M5.json",
"doom-E2M6.json",
"doom-E2M7.json",
"doom-E2M8.json",
"doom-E2M9.json",
"doom-E3M1.json",
"doom-E3M2.json",
"doom-E3M3.json",
"doom-E3M4.json",
"doom-E3M5.json",
"doom-E3M6.json",
"doom-E3M7.json",
"doom-E3M8.json",
"doom-E3M9.json",
"doom-E4M1.json",
"doom-E4M2.json",
"doom-E4M3.json",
"doom-E4M4.json",
"doom-E4M5.json",
"doom-E4M6.json",
"doom-E4M7.json",
"doom-E4M8.json",
"doom-E4M9.json"
];
