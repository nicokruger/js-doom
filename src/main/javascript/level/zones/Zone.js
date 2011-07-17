function Zone(point, label, callFactor, population) {

  this.point = point;
  this.label = label;
  this.callFactor = callFactor;

  this.population = population;
  this.currentHour = 0;

  this.calls = -1
  this.width = 100;
  this.height = 100;
  this.strokeStyle = "#dedede";

  this.updateComponent = function (hour) {
    this.currentHour = hour;
  }

  this.draw = function (ctx) {
    ctx.beginPath();
    ctx.rect(this.point.x - (this.width / 2), this.point.y - (this.height / 2), this.width, this.height);
    ctx.strokeStyle = this.strokeStyle;
    ctx.stroke();

    ctx.fillStyle = "rgba(220, 220, 220, 1)";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("[" + this.calls +"] " + this.label + " - " + this.population[this.currentHour], this.point.x, this.point.y);
  }
}
