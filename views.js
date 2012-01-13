var views;
if (!views) views = {}; // initialise the top-level module if it does not exist

views = (function () {
	
	var gamescreens = [];
	
	var tick = function (time) {
		_(gamescreens).each(function (gs) {
			gs[0].draw(time);
		});
		window.requestAnimFrame(tick);
	};
	window.requestAnimFrame(tick);
    
    // Key bindings
    KeyboardJS.bind.key("up", function () {
        _(gamescreens).each(function (gs) { gs[2] += 16; gs[0].center(gs[1],gs[2]); });
    });
    KeyboardJS.bind.key("down", function () {
        _(gamescreens).each(function (gs) { gs[2] -= 16; gs[0].center(gs[1],gs[2]); });
    });
    KeyboardJS.bind.key("left", function () {
       _(gamescreens).each(function (gs) { gs[1] -= 16; gs[0].center(gs[1],gs[2]); });
    });
    KeyboardJS.bind.key("right", function () {
       _(gamescreens).each(function (gs) { gs[1] += 16; gs[0].center(gs[1],gs[2]); });
    });
    KeyboardJS.bind.key("u", function () {
       _(gamescreens).each(function (gs) { gs[3] -= 8; gs[4] -= 8; gs[0].resize(gs[3],gs[4]); });
    });
    KeyboardJS.bind.key("j", function () {
       _(gamescreens).each(function (gs) { gs[3] += 8; gs[4] += 8; gs[0].resize(gs[3],gs[4]); });
    });


	var createScrollableView = function (where, drawerFunction, width, height, x, y, worldsize) {
		if (gamescreens.length == 1) {
			gamescreens[0][0].remove();
			gamescreens = [];
		}
		var gs = new gamescreen.create($(where), [width, height], gamescreen.world(worldsize), drawerFunction, "rgb(0,0,0)");
		gs.center(x,y);
		gamescreens.push([gs, x, y, width, height]);
		return gs;
	};

	return {
		scrollableView: createScrollableView
	};
})();
