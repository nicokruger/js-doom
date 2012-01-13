var doomviews;
if (!doomviews) doomviews = {};

doomviews.topdown = function (doomdata) {

	var all_ssectors = doomdata.ssectors;
	var ssectors = all_ssectors;
	/*var ssectors = [];
	
	var quadtree = renderlib.quadtree.setupQuadTree(doomdata.extents.x1,
		doomdata.extents.y1,
		doomdata.extents.x2,
		doomdata.extents.y2, 100, 100);
	_(all_ssectors).each(function (sector) {
		quadtree.add(renderlib.quadtree.PolyPlacer(sector));
	});*/

	var textures = _.chain(doomdata.sectors).map(function (sector) {
		return sector.tx_floor;
	}).uniq().value();

	var textureLoader;
	var texturesOutstanding = 999;
	
	textureLoader = new renderlib.texture.TextureLoader(function (left) {
		texturesOutstanding = left;
	});
	
	_(textures).each(function (t) {
		textureLoader.fromUrl(t, "data/textures/" + t.toLowerCase() + ".png", 256, 256);
	});

	var patternMap = {};
	var builtPatterns = false;
	var textureSsector = function (ctx, ssector) {
		var pattern = patternMap[ssector.sector.tx_floor];
		ctx.fillStyle = pattern;
		ctx.beginPath();
		ctx.moveTo(ssector.edges[0].origin.x, ssector.edges[0].origin.y);
		for (var i = 1; i < ssector.edges.length; i++) {
			ctx.lineTo(ssector.edges[i].origin.x, ssector.edges[i].origin.y);
		}
		ctx.closePath();
		ctx.fill();

		/*var lightLevel = 1.0 - ssector.sector.light/255 ;
		if (lightLevel > 1) lightLevel = 1;
		ctx.fillStyle = "rgba(0,0,0," + lightLevel + ")";
		ctx.beginPath();
		ctx.moveTo(ssector.edges[0].origin.x, ssector.edges[0].origin.y);
		for (i = 1; i < ssector.edges.length; i++) {
			ctx.lineTo(ssector.edges[i].origin.x, ssector.edges[i].origin.y);
		}
		ctx.closePath();
		ctx.fill();*/

	};

	var waitingForTextures = function (screen, c2s, ctx) {
		screen.console.frame_log("<span class=\"mapname\">Waiting for " + texturesOutstanding + " textures</span>");
	};

	var drawSectors = function (screen, c2s, ctx) {
		if (!builtPatterns) {
			_(ssectors).each(function (ssector) {
				patternMap[ssector.sector.tx_floor] = ctx.createPattern(textureLoader.texture[ssector.sector.tx_floor].img, "repeat");
			});
			builtPatterns = true;
		}

		_(ssectors).each(function (ssector) {
			textureSsector(ctx, ssector);
		});
	};

	return {
		drawFunction: function (screen, c2s, ctx) {
			if (texturesOutstanding ===  0) {
				drawSectors(screen, c2s, ctx);
			} else {
				waitingForTextures(screen,c2s,ctx);
			}
		},
		onViewChange: function (x1,y1,x2,y2) {
			/*ssectors = [];
			quadtree.forEach(renderlib.quadtree.square(x1,y1,x2,y2), function (ssector) {
				ssectors.push(ssector);
			});*/
			
		}
	};
};