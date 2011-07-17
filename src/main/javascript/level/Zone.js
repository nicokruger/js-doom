function Zone(point, label, callFactor) {
  this.point = point;
  this.label = label;
  this.callFactor = callFactor;

  this.width = 100;
  this.height = 100;
  this.strokeStyle = "#dedede";

  this.update = function (deltaTime) {
  }

  this.draw = function (ctx) {
    ctx.beginPath();
    ctx.rect(this.point.x - (this.width / 2), this.point.y - (this.height / 2), this.width, this.height);
    ctx.strokeStyle = this.strokeStyle;
    ctx.stroke();
  }
}