function ConvertGameTowers(towerObjects) {
	var that = this;
	var towers = []
	towerObjects.forEach(function(towerObject) {
		var tower = {}
		var x = towerObject.point.x
		var y = towerObject.point.y

		tower["point"] = [x,y]
		tower["radius"] = 50
		tower["capacity"] = towerObject.capacity

		towers.push(tower);
	});
	return towers;
}


function ConvertGameZones(zoneObjects) {
	var that = this;

	var zones = []
	zoneObjects.forEach(function(zoneObject) {
		var zone = {}

		zone["poly"] = zoneObject.poly;
		zone["population"] = zoneObject.currentPopulation;
		zone["callFactor"] = zoneObject.callFactor;
		zone["label"] = zoneObject.label;
		zones.push(zone);
	});

	return zones;
}

function createBlock(x,y, width, height) {
    return $P($V(x-width,y-width), $V(x+width,y-height), $V(x+width,y+height), $V(x-width,y+height))
}

function GameScreen(src) {
        hack = 0;
  var that = this;
  console.info("Loading level from: " + src);

  this.currentHour = 2;

  this.gameComponents = new Array();

  // Create towers
  this.towerObjects = [
  	new Tower(new Point(70, 130), 10), 
  	new Tower(new Point(350, 60), 20),
	new Tower(new Point(350, 300), 10)
  ]
  this.towerObjects.forEach(function (tower) { that.gameComponents.push(tower) } );


    var w = 20; var h = 20;
  // Create zones
  this.zoneObjects = [
new Zone(createBlock(50,50, w, h), "a00", 1.0, [30,80,60,80,20,90,40]),
new Zone(createBlock(51,151, w, h), "a01", 1.0, [40,40,20,70,60,30,50]),
new Zone(createBlock(51,252, w, h), "a02", 1.0, [20,90,80,70,90,20,40]),
new Zone(createBlock(50,350, w, h), "a03", 1.0, [40,60,70,90,40,20,10]),
new Zone(createBlock(50,450, w, h), "a04", 1.0, [90,30,50,50,50,50,90]),
new Zone(createBlock(150,50, w, h), "a10", 1.0, [60,80,60,70,100,90,100]),
new Zone(createBlock(150,150, w, h), "a11", 1.0, [70,80,40,50,20,60,90]),
new Zone(createBlock(150,250, w, h), "a12", 1.0, [30,50,80,30,80,20,30]),
new Zone(createBlock(150,350, w, h), "a13", 1.0, [10,10,20,70,20,90,70]),
new Zone(createBlock(150,450, w, h), "a14", 1.0, [60,10,90,40,10,20,100]),
new Zone(createBlock(250,50, w, h), "a20", 1.0, [70,100,50,70,80,80,10]),
new Zone(createBlock(250,150, w, h), "a21", 1.0, [60,40,30,10,30,70,30]),
new Zone(createBlock(250,250, w, h), "a22", 1.0, [30,40,40,30,30,10,90]),
new Zone(createBlock(250,350, w, h), "a23", 1.0, [80,30,90,30,50,10,80]),
new Zone(createBlock(250,450, w, h), "a24", 1.0, [70,100,90,60,10,100,40]),
new Zone(createBlock(350,50, w, h), "a30", 1.0, [60,60,80,80,80,20,70]),
new Zone(createBlock(350,150, w, h), "a31", 1.0, [30,30,90,20,100,40,10]),
new Zone(createBlock(350,250, w, h), "a32", 1.0, [10,30,60,70,40,80,60]),
new Zone(createBlock(350,350, w, h), "a33", 1.0, [40,20,40,20,60,60,90]),
new Zone(createBlock(350,450, w, h), "a34", 1.0, [10,100,80,100,60,100,40]),
new Zone(createBlock(450,50, w, h), "a40", 1.0, [80,20,90,70,30,10,50]),
new Zone(createBlock(450,150, w, h), "a41", 1.0, [40,20,80,100,30,30,50]),
new Zone(createBlock(450,250, w, h), "a42", 1.0, [30,50,10,70,90,70,20]),
new Zone(createBlock(450,350, w, h), "a43", 1.0, [50,100,100,40,20,80,50]),
new Zone(createBlock(450,450, w, h), "a44", 1.0, [10,30,10,30,70,10,50])

  ]
  this.zoneObjects.forEach(function (zone) { that.gameComponents.push(zone) } );


  // Further game logic.
  this.updateComponents = function (screen) {
    screen.currentHour = (screen.currentHour + 1) % 7;

    for (i in screen.gameComponents) {
      screen.gameComponents[i].updateComponent(screen.currentHour);

      // Run the simulator
      zones = ConvertGameZones(screen.zoneObjects);
      towers = ConvertGameTowers(screen.towerObjects);
      var s = new Simulator(zones,towers);
      sim_state = s.simulate();

      zip(sim_state["zones"], screen.zoneObjects, function (x,y) { y.calls = x["calls"] } );
      zip(sim_state["towers"], screen.towerObjects, function (x,y) { y.utilisation = x["utilisation"] } );
    }

  }

  setInterval(this.updateComponents, 500, this);

  this.update = function (deltaTime) {}
  
  this.draw = function (ctx) {
    ctx.font = "bold 12px sans-serif";
    for (i=0; i < 7; i++) {
      if (i == this.currentHour)
        ctx.fillStyle = "rgba(220, 0, 0, 1)";
      else
        ctx.fillStyle = "rgba(220, 220, 220, 1)";

      ctx.fillText(i, i * 80, 500);
    }

    for (var i in this.gameComponents)
      this.gameComponents[i].draw(ctx);

  }



}
