function Zone(poly, label, callFactor, population) {

  this.poly = poly;
  this.label = label;
  this.callFactor = callFactor;

  this.population = population;
  this.currentPopulation = population[0]
  this.currentHour = 0;

  this.calls = -1
  this.width = 100;
  this.height = 100;
  this.strokeStyle = "#dedede";

  this.updateComponent = function (hour) {
    this.currentHour = hour;
    this.currentPopulation = this.population[hour]
  }

  this.draw = function (ctx) {

    drawTexture(ctx, this.poly, textureLoader.texture["name"].repeat);

    ctx.fillStyle = "rgba(220, 220, 220, 1)";
    ctx.font = "bold 12px sans-serif";
    var x = this.poly.extremes.x1;
    var y = this.poly.extremes.y1;

    ctx.fillText("[" + this.calls +"] " + this.label + " - " + this.population[this.currentHour], x, y);
  }
}
