var gamescreen;
if (!gamescreen) gamescreen = {}; // initialise the top-level module if it does not exist
if (!gamescreen.screens) gamescreen.screens = {};

gamescreen.screens.backingCanvas = function(where, game, width, height, background) {
    var bg = background === undefined ? "#ffffff" : background;
    var extents_width = game.extents.x2 - game.extents.x1 + width;
    var extents_height = game.extents.y2 - game.extents.y1 + height;
    $(where).width(width);
    $(where).height(height + 60);
    var canvas = $("<canvas class=\"gamecanvas\" width=\"" + width + "\" height=\"" + height + "\"></canvas>").appendTo($(where));
    var canvas_hidden = $("<canvas width=\"" + extents_width +"\" height=\"" + extents_height + "\" style=\"display:none\"></canvas>").appendTo($(where));

    var consoleDiv = $('<div></div>').appendTo($(where));
    consoleDiv.width(width);
    var _console = gamescreen.console($(consoleDiv));
    //console.height(height);
    _console.log("BackingCanvas: " + gamescreen.console.util.point(width,height));

    var ctx_front = canvas[0].getContext("2d");
    var ctx_back = canvas_hidden[0].getContext("2d");
    return {
        cleanup: function() {
            canvas.remove();
            canvas_hidden.remove();
            consoleDiv.remove();
        },
                

        create: function(sectors, x1, y1, x2, y2) {
            var half_viewportwidth = Math.round(width/2, 0);
            var half_viewportheight = Math.round(height/2, 0);
            var c2s = new gamescreen.util.Cartesian2Screen(game.extents.x1 - half_viewportwidth,
                game.extents.y1 - half_viewportheight,
                game.extents.x2 + half_viewportwidth,
                game.extents.y2 + half_viewportheight);
            //_console.frame_log(gamescreen.console.util.rect(x1,y1,x2,y2));
            return  {
                draw: function(d) {

/*                    _console.frame_log(gamescreen.console.util.rect(
                        c2s.cartesian2screeny(x1),
                        c2s.cartesian2screeny(y2),
                        width,
                        height
                    ));
*/
                    gamescreen.util.Timer.start("BackingCanvas");

                    gamescreen.util.Timer.substart("clean back");
                    ctx_back.globalCompositeOperation = "none";
                    ctx_back.fillStyle = bg;
                    ctx_back.fillRect(
                        c2s.cartesian2screenx(x1),
                        c2s.cartesian2screeny(y2),
                        width,
                        height
                    );
                    gamescreen.util.Timer.subend();

                    gamescreen.util.Timer.substart("draw-all");
                    d(c2s, ctx_back);
                    gamescreen.util.Timer.subend();
                    
                    gamescreen.util.Timer.substart("copy to front");
                    ctx_back.globalCompositeOperation = "none";
                    ctx_front.drawImage(ctx_back.canvas,
                        c2s.cartesian2screenx(x1),
                        c2s.cartesian2screeny(y2),
                        width,
                        height,
                        0, 0,
                        width,
                        height);
                    gamescreen.util.Timer.subend();
                    
                    gamescreen.util.Timer.end();
                },

                console: _console
            };
        }
    };
};


var gamescreen;
if (!gamescreen) gamescreen = {}; // initialise the top-level module if it does not exist
if (!gamescreen.screens) gamescreen.screens = {};
    
gamescreen.screens.fullCanvas = function(where, game, width, height, background) {
    var bg = background === undefined ? "#ffffff" : background;
    var game_width = game.extents.x2 - game.extents.x1 + width;
    var game_height = game.extents.y2 - game.extents.y1 + height;
    
    $(where).width(width);
    $(where).height(height + 60);
        
    var holderdiv = $("<div></div>").appendTo(where);
    holderdiv.width(width);
    holderdiv.height(height);
    holderdiv.css("overflow", "hidden");

    var canvas = $("<canvas class=\"gamecanvas\" width=\"" + game_width + "\" height=\"" + game_height + "\"></canvas></div>").appendTo($(holderdiv));
    
    var consoleDiv = $('<div></div>').appendTo($(where));
    consoleDiv.width(width);
    var _console = gamescreen.console($(consoleDiv));
    _console.log("FullCanvas: " + gamescreen.console.util.point(width,height));
            
    
    var ctx = canvas[0].getContext("2d"); // don't like the [0] subscript - some jQuery thing I don't understand?
    
    return {
        cleanup: function() {
            canvas.remove();
            holderdiv.remove();
            consoleDiv.remove();
        },
        
        create: function(sectors, x1, y1, x2, y2) {
            var half_viewportwidth = Math.round(width/2, 0);
            var half_viewportheight = Math.round(height/2, 0);
            var c2s = new gamescreen.util.Cartesian2Screen(game.extents.x1 - half_viewportwidth,
                game.extents.y1 - half_viewportheight,
                game.extents.x2 + half_viewportwidth,
                game.extents.y2 + half_viewportheight);
            
            $(holderdiv).scrollLeft(c2s.cartesian2screenx(x1));
            $(holderdiv).scrollTop(c2s.cartesian2screeny(y2));
            
            return {
                draw: function(d) {
                    //_console.log("FullCanvas@" + gamescreen.console.util.rect(x1,y1,x2,y2));
                    gamescreen.util.Timer.start("FullCanvas");
                    ctx.fillStyle = bg;
                    ctx.fillRect(
                        c2s.cartesian2screenx(x1),
                        c2s.cartesian2screeny(y2),
                        c2s.cartesian2screenx(x2) - c2s.cartesian2screenx(x1),
                        c2s.cartesian2screeny(y1) - c2s.cartesian2screeny(y2)
                    );
                                        
                    gamescreen.util.Timer.substart("Draw");
                    d(c2s, ctx);
                    gamescreen.util.Timer.subend();
                    
                    gamescreen.util.Timer.end();
                },
                console: _console
            };
        }
    };
};



var gamescreen;
if (!gamescreen) gamescreen = {}; // initialise the top-level module if it does not exist
if (!gamescreen.screens) gamescreen.screens = {};
    
gamescreen.screens.scrollingCanvas = function(where, game, width, height, background) {
    var bg = background === undefined ? "#ffffff" : background;
    var game_width = game.extents.x2 - game.extents.x1 + width;
    var game_height = game.extents.y2 - game.extents.y1 + height;
    
    $(where).width(width);
    $(where).height(height + 60);
        
    var holderdiv = $("<div></div>").appendTo(where);
    holderdiv.width(width);
    holderdiv.height(height);
    holderdiv.css("overflow", "hidden");

    var canvas = $("<canvas class=\"gamecanvas\" width=\"" + width + "\" height=\"" + height + "\"></canvas></div>").appendTo($(holderdiv));
    
    var consoleDiv = $('<div></div>').appendTo($(where));
    consoleDiv.width(width);
    var _console = gamescreen.console($(consoleDiv));
            
    
    var ctx = canvas[0].getContext("2d"); // don't like the [0] subscript - some jQuery thing I don't understand?
    
    return {
        cleanup: function() {
            canvas.remove();
            holderdiv.remove();
            consoleDiv.remove();
        },
        
        create: function(sectors, x1, y1, x2, y2) {
            var half_viewportwidth = Math.round(width/2, 0);
            var half_viewportheight = Math.round(height/2, 0);
            var c2s = new gamescreen.util.Identity(game.extents.x1,
                game.extents.y1,
                game.extents.x2,
                game.extents.y2);
            
            var x_zoom = width/(x2-x1);
            var y_zoom = height/(y1-y2);

            return {
                draw: function(d) {
                    gamescreen.util.Timer.start("FullCanvas");

                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    ctx.fillStyle = bg;
                    ctx.fillRect(0,0,width,height);
                    
                    gamescreen.util.Timer.substart("Draw");
                    ctx.setTransform(x_zoom, 0, 0, y_zoom, -x1*x_zoom, y2*x_zoom);
                    d(c2s, ctx);
                    gamescreen.util.Timer.subend();
                    
                    gamescreen.util.Timer.end();
                },
                console: _console
            };
        }
    };
};



var gamescreen;
if (!gamescreen) gamescreen = {}; // initialise the top-level module if it does not exist

gamescreen.util = (function() {
    var printTimer = function (t,indent) {
        var prefix="";
        for (var i = 0; i < indent; i++) prefix+=" ";

        $("#console").val("");
        // print the subtimers
        var subtimers = t[3];
        _.keys(subtimers).forEach(function (subtimername) {
            var subtimes = subtimers[subtimername][1];
            var subtiming = subtimers[subtimername][0];

            $("#console").val($("#console").val() + "\n" + prefix + "  [S][" + subtimername +"] " + subtiming + " <" + subtimes + ">");
        });
        $("#console").val($("#console").val() + "\n" + "[T][" + t[0] + "] " + (t[1]));
    };
    var Timer = {
        timers : []
    };

    Timer.start = function (label) {
        var timer = [label, Date.now(), [], {}];
        this.timers.push(timer);
        return timer;
    };

    Timer.end = function () {
        var t = this.timers.pop();
        t[1] = (Date.now()-t[1]);
        if (typeof(console) !== 'undefined')
            printTimer(t, this.timers.length*4);
        return t;
    };

    Timer.substart = function(label) {
        var t = _.last(this.timers);
        if (t === undefined) return;
        var subtimers = t[2];
        var subtimerstotals = t[3];
        if (!_.contains(_.keys(subtimerstotals), label)) {
            subtimerstotals[label] = [0,0];
        }
        var subtimer = [label, Date.now()];
        subtimers.push(subtimer);
        return subtimer;
    };

    Timer.subend = function() {
        var t = _.last(this.timers);
        if (t === undefined) return;
        var subtimer = t[2].pop();
        var subtimertotal = t[3][subtimer[0]];
        subtimertotal[0] += (Date.now() - subtimer[1]);
        subtimertotal[1] += 1;
        return subtimertotal;
    };


    return {
        Timer: Timer,
        Cartesian2Screen: function(x1, y1, x2, y2) {
            
            return {
                cartesian2screenx: function(x) {
                    return x - x1;
                },
                cartesian2screeny: function(y) {
                    return y2 + (-1 * y);
                },
                width: function() {
                    return x2 - x1;
                },
                height: function() {
                    return y2 - y1;
                },
                toString: function() {
                    return "[" + x1 + "," + y1 + "] x [" + x2 + "," + y2 + "]";
                }
                
            };
        },

        Identity: function (x1,y1,x2,y2) {
            return {
                cartesian2screenx: function(x) {
                    return x;
                },
                cartesian2screeny: function(y) {
                    return y;
                },
                width: function() {
                    return x2 - x1;
                },
                height: function() {
                    return y1 - y2;
                },
                toString: function() {
                    return "I[" + x1 + "," + y1 + "] x [" + x2 + "," + y2 + "]";
                }
            };
        },
        grid: function (ctx, colour, c2s, x1, y1, x2, y2, size) {
            ctx.fillStyle = "rgba(30, 30, 30, 1)";
            ctx.font = "normal 12px sans-serif";

            for (var x = x1; x<=x2-size; x+=size) {
                for (var y = y1; y <= y2-size; y+=size) {
                    ctx.strokeStyle = colour;
                    ctx.strokeRect(c2s.cartesian2screenx(x),c2s.cartesian2screeny(y),size,size);
                    ctx.fillText("(" + x + "," + y + ")", c2s.cartesian2screenx(x),c2s.cartesian2screeny(y));
                }
            }
            
        }

    };
    
})();
//    function createBlock(x,y, width, height) {
   //     return $P($V(x-width,y-width), $V(x+width,y-height), $V(x+width,y+height), $V(x-width,y+height))
    //}


/**
 * Provides requestAnimationFrame in a cross browser way.
 */
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
           window.setTimeout(callback, 1000/60);
         };
})();

var gamescreen;
if (!gamescreen) gamescreen = {}; // initialise the top-level module if it does not exist

gamescreen.console = function (where) {
	$(where).attr("class", "console-small");
	var frameInfo = $("<div class=\"console-frameinfo\"></div>").appendTo($(where));
	var permInfo = $("<div class=\"console-permanent\"></div>").appendTo($(where));
	var i = 0;
	return {
		frame_start: function() {
			$(frameInfo).html("");
		},
		frame_end: function() {
			
		},
		frame_log: function(text) {
			//$(frameInfo).html($(frameInfo).html() + "<sptext);
			$("<span class=\"console-frameinfo_entry\">" + text + "</span>").appendTo($(frameInfo));
		},

		large: function() {
			$(where).attr("class", "console-large");
		},

		small: function() {
			$(where).attr("class", "console-small");
		},

		log: function (text) {
			console.log("[C]: " + text);
			$("<span class=\"console-log\">" + "[" + i + "] " + text + "</span>").appendTo($(permInfo));
			//$(permInfo).html($(permInfo).html() + "[" + i + "] " + text + "\n");
			i++;
			$(permInfo).scrollTop(50000); // TODO: magic hack number! figure out how to get height of children
		}
	};
};

gamescreen.console.util = {
	point: function (x,y) {
		return "[" + x + "," + y + "]";
	},

	rect: function(x1,y1,x2,y2) {
		return "[" + x1 + "," + y1 + "]x[" + x2 + "," + y2 + "]";
	}

};var gamescreen;
if (!gamescreen) gamescreen = {}; // initialise the top-level module if it does not exist

var _local = (function () {
	var exports = {

		create: function (where, viewSize, worldSize, drawerFunction, background) {
			var cpx = (worldSize.extents.x1 + worldSize.extents.x2) / 2.0;
			var cpy = (worldSize.extents.y1 + worldSize.extents.y2) / 2.0;

			var viewport = new internalCreate(where, gamescreen.screens.scrollingCanvas, worldSize, [cpx,cpy], viewSize[0], viewSize[1], background);
			return screenWrapper(viewport, viewSize[0], viewSize[1], drawerFunction, background);
		},

		world: function (x1,y1,x2,y2) {
			if (typeof(y1) === "undefined") {
				var worldsize = x1;
				return {
					extents: {
						x1: -worldsize,
						y1: -worldsize,
						x2: worldsize,
						y2: worldsize
					},
					width: worldsize*2,
					height: worldsize*2
				};
			} else {
				return {
					extents: { x1:x1, y1:y1, x2:x2, y2:y2 },
					width: x2-x1,
					height: y2-y1
				};
			}
		}

	};

	var internalCreate = function(where, type, world, centerpoint, viewportWidth, viewportHeight,background){
		var screenWidth = viewportWidth, screenHeight = viewportHeight;
		var screenCreator = function (where, type, world, width, height) {
			var s = type($(where), world, width, height, background);

			return {
				create: function (x1, y1, x2, y2) {
					var _s = s.create([], x1, y1, x2, y2);
					return _s;
				},

				cleanup: function () {
					// TODO: remove from the screen list here!

					return s.cleanup();
				}

			};
		};

		this.remove = function () {
			if (typeof(this.sc) !== "undefined") {
				this.sc.cleanup();
			}
		};

		this.size = function (width,height) {
			this.remove();
			viewportWidth = width; screenWidth = width;
			viewportHeight = height; screenHeight = height;
			this.sc = screenCreator(where, type, world, viewportWidth, viewportHeight,background);
			return this.sc.create(centerpoint[0] - screenWidth/2,
				centerpoint[1] - screenHeight/2,
				centerpoint[0] + screenWidth/2,
				centerpoint[1] + screenHeight/2, background);
		};

		this.resize = function (_screenWidth, _screenHeight) {
			screenWidth = _screenWidth;
			screenHeight = _screenHeight;

			return this.sc.create(centerpoint[0] - screenWidth/2,
				centerpoint[1] - screenHeight/2,
				centerpoint[0] + screenWidth/2,
				centerpoint[1] + screenHeight/2, background);
		};

		this.move = function (x,y) {
			centerpoint[0] += x;
			centerpoint[1] += y;

			return this.sc.create(centerpoint[0] - screenWidth/2, centerpoint[1] - screenHeight/2, centerpoint[0] + screenWidth/2, centerpoint[1] + screenHeight/2, background);
		};

		this.center = function (x, y) {
			centerpoint[0] = x;
			centerpoint[1] = y;
			return this.sc.create(centerpoint[0] - screenWidth/2, centerpoint[1] - screenHeight/2, centerpoint[0] + screenWidth/2, centerpoint[1] + screenHeight/2, background);
		};

		this.getCenter = function () {
			return centerpoint;
		};
	};

	var screenWrapper = function (viewport, width, height, draw, background) {
		var screen = viewport.size(width, height, background);

		var realFpsTimeCounter = 0;
		var realFps = -1;
		var prevRealFps;
		var prevTime;
		var prev;

		var drawFunction = function (time) {
			if (time === undefined) {
				return;
			}
			var start = Date.now();
			var x = time;
			var elapsed = 0;
			if (prev === undefined) {
				prev = x;
			} else {
				elapsed = x - prev;
				prev =  x;
			}

			screen.draw(_.bind(draw,{},screen));

			screen.console.frame_log("Anim: " + Math.round(1000.0/elapsed, 2));
			if (prevTime !== undefined) {
				screen.console.frame_log(" Drawing: " + Math.round(1000.0/prevTime, 2));
			}
			prevTime = Date.now() - start;
			realFpsTimeCounter += prevTime;
			realFps++;
			if (realFpsTimeCounter >= 1000) {
				prevRealFps = realFps;
				realFpsTimeCounter = 0;
				realFps = 0;
			}
			if (prevRealFps !== undefined) {
				screen.console.frame_log(" Real: " + prevRealFps);
			}
				
		};

		return {
			draw: function (time) {
				screen.console.frame_start();
				var cp = viewport.getCenter();
				screen.console.frame_log("S: " + cp[0] + "/" + cp[1]);
				drawFunction(time);
				screen.console.frame_end();
			},
			move: function (x,y) {
				//screen = viewport.move(x1,y1,x2,y2);
				screen = viewport.move(x,y);
			},
			size: function(width,height) {
				screen = viewport.size(width,height);
			},
			resize: function(width,height) {
				screen = viewport.resize(width,height);
			},
			center: function (x,y) {
				screen = viewport.center(x,y);
			},
			remove: function() {
				viewport.remove();
			},
			console: screen.console
		};
	};


	return exports;
})();


gamescreen.createView = _local.createView;
gamescreen.create = _local.create;
gamescreen.world = _local.world;
