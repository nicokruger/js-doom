var doomviews;
if (!doomviews) doomviews = {};

doomviews.topdown = function (doomdata) {

	var ssector_to_sector = _(doomdata.ssectors).map(function (ssector) {
	});

	var ssectors = doomdata.ssectors;

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

	var textureSsector = function (ctx, ssector) {
		var pattern = ctx.createPattern(textureLoader.texture[ssector.sector.tx_floor].img, "repeat");
		ctx.fillStyle = pattern;
		ctx.beginPath();
		ctx.moveTo(ssector.edges[0].origin.x, ssector.edges[0].origin.y);
		for (var i = 1; i < ssector.edges.length; i++) {
			ctx.lineTo(ssector.edges[i].origin.x, ssector.edges[i].origin.y);
		}
		ctx.closePath();
		ctx.fill();
	};

	var waitingForTextures = function (screen, c2s, ctx) {
		screen.console.frame_log("Waiting for " + texturesOutstanding + " textures");
	};

	var drawSectors = function (screen, c2s, ctx) {
		_(ssectors).each(function (ssector) {
			if (typeof(ssector) === "undefined") {
				screen.console.log("Invalid ssector");
				return;
			}

			textureSsector(ctx, ssector);
		});
	};

	return function (screen, c2s, ctx) {
		if (texturesOutstanding ===  0) {
			drawSectors(screen, c2s, ctx);
		} else {
			waitingForTextures(screen,c2s,ctx);
		}
	};
};