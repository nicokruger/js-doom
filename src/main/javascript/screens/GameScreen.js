function ConvertGameTowers(towerObjects) {
	var that = this;
	towers = []
	towerObjects.forEach(function(towerObject) {
		tower = {}
		x = towerObject.point[0]
		y = towerObject.point[1]

		tower["point"] = [x,y]
		tower["radius"] = 50
		tower["capacity"] = tower.capacity

		towers.push(tower);
	});
	return towers;
}


function ConvertGameZones(zoneObjects) {
	var that = this;

	zones = []
	zoneObjects.forEach(function(zoneObject) {
		zone = {}

		x = zoneObject.point[0]
		y = zoneObject.point[1]
		w = zoneObject.width
		h = zoneObject.height

		zone["points"] = [ [x - w/2, y - h/2], [x + w/2, y - h/2],
			[x + w/2, y + h/2], [x - w/2, y-h/2]]
		zone["population"] = zoneObject.population
		zone["callFactor"] = zoneObject.callFactor

		zones.push(zone)
	});

	return zones;
}

function GameScreen(src) {
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


  // Create zones
  this.zoneObjects = [
    new Zone(new Point(55, 70), "z1", 0.5, [0, 0, 5, 5, 5, 0, 0]),
    new Zone(new Point(60, 200), "z2", 0.5, [0, 0, 5, 5, 5, 0, 0]),
    new Zone(new Point(370, 60), "z3", 0.35, [5, 5, 0, 0, 0, 5, 5]),
    new Zone(new Point(340, 290), "z4", 0.8, [5, 5, 0, 0, 0, 5, 5])
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

    for (i in this.gameComponents)
      this.gameComponents[i].draw(ctx)
  }
}
