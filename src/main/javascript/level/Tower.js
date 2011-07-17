function Tower(point, capacity) {
  this.point = point;
  this.capacity = capacity;

  this.strokeStyle = "#56ff56";

  this.update = function (deltaTime) {
    
  }

  this.draw = function (ctx) {
    ctx.beginPath();
    ctx.arc(this.point.x, this.point.y, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.strokeStyle = this.strokeStyle;
    ctx.stroke();

    ctx.font = "bold 12px sans-serif";
    ctx.fillText("ff", 100, 100);
  }
}