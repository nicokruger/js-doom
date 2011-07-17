function Tower(point, capacity) {
  this.point = point;
  this.capacity = capacity;
  this.utilisation = -1

  this.strokeStyle = "#56ff56";

  this.updateComponent = function (hour) {}
  this.update = function (hour) {}

  this.draw = function (ctx) {
    ctx.beginPath();
    ctx.arc(this.point.x, this.point.y, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.strokeStyle = this.strokeStyle;
    ctx.stroke();

    ctx.fillStyle = "rgba(0, 255, 0, 1)";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("[" + this.utilisation + "] " + this.capacity, this.point.x, this.point.y);
  }
}
