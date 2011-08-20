

function createBlock(x,y, width, height) {
    return $P($V(x-width,y-width), $V(x+width,y-height), $V(x+width,y+height), $V(x-width,y+height))
}

function ZonePlacer(zone) {
    var polyPlacer = PolyPlacer(zone.poly);

    var operationInterceptor = function(operation) {
        return function (polygon) {
            operation(zone);
        };
    }
    return {
        topLeft: function (x,y,operation) {
            polyPlacer.topLeft(x,y,operationInterceptor(operation));
        },
        topRight: function (x,y,operation) {
            polyPlacer.topRight(x,y,operationInterceptor(operation));
        },
        bottomLeft: function (x,y,operation) {
            polyPlacer.bottomLeft(x,y,operationInterceptor(operation));
        },
        bottomRight: function (x,y,operation) {
            polyPlacer.bottomRight(x,y,operationInterceptor(operation));
        }
    }
}
function GameScreen(src) {
        hack = 0;
  var that = this;

  this.gameComponents = new Array();

  var bl = new Quad(250,250); var br = new Quad(750,250);
  var tr = new Quad(750,750); var tl = new Quad(250,750);

  this.quadtree = new QuadTree(500, 500, bl, br, tr, tl);

  var that = this;
  $.getJSON("data/doom.json", function(data) {
      that.zoneObjects = get_zones(data);
      that.zoneObjects.forEach(function (zone) {
        that.gameComponents.push(zone);
        that.quadtree.add(ZonePlacer(zone));
      } );

  }).error(function(e) {
      alert("error:" + e.statusText);
  });

  // Further game logic.
  this.updateComponents = function (screen) {
  }

  //setInterval(this.updateComponents, 5000, this);

  this.update = function (deltaTime) {}
  
  this.draw = function (ctx) {
    ctx.font = "bold 12px sans-serif";

    Timer.start("Polydraw");
    var i = 0;
    this.quadtree.forEach(Square(0,500,500,1000), function (zone) {
        var tt1 = Date.now();
        zone.draw(ctx);
        var tt2 = Date.now();
        i++
        //console.log("   [" + zone.label + "] " + (tt2-tt1));
    });
    Timer.end();
    console.log("[ " + i + " polygons ]");
  }



}
