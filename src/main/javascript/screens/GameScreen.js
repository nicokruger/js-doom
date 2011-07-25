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

		var x = zoneObject.point.x
		var y = zoneObject.point.y
		var w = zoneObject.width
		var h = zoneObject.height

		zone["poly"] = $P($V(x - w/2.0, y - h/2.0), $V(x + w/2, y - h/2),
			$V(x + w/2, y + h/2), $V(x - w/2, y+h/2))

		zone["population"] = zoneObject.currentPopulation
		zone["callFactor"] = zoneObject.callFactor
		zone["label"] = zoneObject.label
		zones.push(zone)
	});

	return zones;
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


  // Create zones
  this.zoneObjects = [
    /*new Zone(new Point(55, 70), "z1", 0.5, [1, 2, 5, 5, 5, 9, 1]),
    new Zone(new Point(60, 200), "z2", 0.5, [1, 6, 5, 100, 5, 0, 9]),
    new Zone(new Point(370, 60), "z3", 0.35, [5, 5, 9, 2, 5, 6, 5]),
    new Zone(new Point(340, 290), "z4", 0.8, [5, 5, 3, 8, 5, 5, 5])*/

new Zone(new Point(50,50), "a00", 1.0, [30,80,60,80,20,90,40]),
new Zone(new Point(51,151), "a01", 1.0, [40,40,20,70,60,30,50]),
new Zone(new Point(51,252), "a02", 1.0, [20,90,80,70,90,20,40]),
new Zone(new Point(50,350), "a03", 1.0, [40,60,70,90,40,20,10]),
new Zone(new Point(50,450), "a04", 1.0, [90,30,50,50,50,50,90]),
new Zone(new Point(150,50), "a10", 1.0, [60,80,60,70,100,90,100]),
new Zone(new Point(150,150), "a11", 1.0, [70,80,40,50,20,60,90]),
new Zone(new Point(150,250), "a12", 1.0, [30,50,80,30,80,20,30]),
new Zone(new Point(150,350), "a13", 1.0, [10,10,20,70,20,90,70]),
new Zone(new Point(150,450), "a14", 1.0, [60,10,90,40,10,20,100]),
new Zone(new Point(250,50), "a20", 1.0, [70,100,50,70,80,80,10]),
new Zone(new Point(250,150), "a21", 1.0, [60,40,30,10,30,70,30]),
new Zone(new Point(250,250), "a22", 1.0, [30,40,40,30,30,10,90]),
new Zone(new Point(250,350), "a23", 1.0, [80,30,90,30,50,10,80]),
new Zone(new Point(250,450), "a24", 1.0, [70,100,90,60,10,100,40]),
new Zone(new Point(350,50), "a30", 1.0, [60,60,80,80,80,20,70]),
new Zone(new Point(350,150), "a31", 1.0, [30,30,90,20,100,40,10]),
new Zone(new Point(350,250), "a32", 1.0, [10,30,60,70,40,80,60]),
new Zone(new Point(350,350), "a33", 1.0, [40,20,40,20,60,60,90]),
new Zone(new Point(350,450), "a34", 1.0, [10,100,80,100,60,100,40]),
new Zone(new Point(450,50), "a40", 1.0, [80,20,90,70,30,10,50]),
new Zone(new Point(450,150), "a41", 1.0, [40,20,80,100,30,30,50]),
new Zone(new Point(450,250), "a42", 1.0, [30,50,10,70,90,70,20]),
new Zone(new Point(450,350), "a43", 1.0, [50,100,100,40,20,80,50]),
new Zone(new Point(450,450), "a44", 1.0, [10,30,10,30,70,10,50])

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
/*    ctx.font = "bold 12px sans-serif";
    for (i=0; i < 7; i++) {
      if (i == this.currentHour)
        ctx.fillStyle = "rgba(220, 0, 0, 1)";
      else
        ctx.fillStyle = "rgba(220, 220, 220, 1)";

      ctx.fillText(i, i * 80, 500);
    }

    for (i in this.gameComponents)
      this.gameComponents[i].draw(ctx); */
    var P1 = $P($V(100,200), $V(200,200), $V(200,300), $V(100,300));
    var P2 = circle_to_poly([100.0, 229.0], 120.0, hack);
    hack++;

    var I1 = P1.intersection(P2);
    if (I1.area() < 10) {
        alert("broken at: " + hack);
    }
    //var I2 = P2.intersection(circle_to_poly([100.0, 30.0], 100.0, 64));

    drawPoly(ctx, I1, "#ff00ff");

    //drawPoly(ctx, P1, "#0000ff");
    drawPoly(ctx, P2, "#ffff00");
    //drawPoly(ctx, I2, "#FFFF00");
    /*ctx.fillStyle = "rgba(255, 255, 255)";
    ctx.strokeStyle = "#ffff00";
    ctx.beginPath();
    I2.edges.forEach(function (edge) {
        ctx.moveTo(edge.origin.x, edge.origin.y);
        ctx.lineTo(edge.end.x, edge.end.y);
    });
    ctx.stroke();*/

  }

  function drawPoly(ctx, poly, colour) {
    ctx.strokeStyle = colour;
    ctx.beginPath();
    poly.edges.forEach(function (edge) {
        ctx.moveTo(edge.origin.x, edge.origin.y);
        ctx.lineTo(edge.end.x, edge.end.y);
    });
    ctx.stroke();
  }
}
