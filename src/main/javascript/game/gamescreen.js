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
		zone["population"] = 100;
		zone["callFactor"] = 1.0;
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
  	new Tower($V(70, 130), 10),
  	new Tower($V(350, 60), 20),
	new Tower($V(350, 300), 10)
  ]
  this.towerObjects.forEach(function (tower) { that.gameComponents.push(tower) } );


  var q1 = new Quad(2500,2500); var q2 = new Quad(75,75);
  var q3 = new Quad(25,25); var q4 = new Quad(75,25);
  var qt = new QuadTree(50, 50, q1, q2, q3, q4);

  this.quadtree = new QuadTree
  var that = this;
  $.getJSON("data/doom.json", function(data) {
      alert("loaded level");
      that.zoneObjects = get_zones(data);
      that.zoneObjects.forEach(function (zone) { that.gameComponents.push(zone) } );

  }).error(function(e) {
      alert("error:" + e.statusText);
  });

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

  //setInterval(this.updateComponents, 5000, this);

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

    var t1 = Date.now();
    for (var i in this.gameComponents) {
      var tt1 = Date.now();
      this.gameComponents[i].draw(ctx);
      var tt2 = Date.now();
      console.log("Polygon time: " + (tt2-tt1));
    }
    console.log("Total time:" + (Date.now() - t1));
  }



}
