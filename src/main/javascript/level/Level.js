function Point(src) {
  this.towers = new Array();
  this.zones = new Array();

  this.towers.push(new Tower(
    new Point(70, 130), 10));
  this.towers.push(new Tower(
    new Point(350, 60), 20));
  this.towers.push(new Tower(
    new Point(350, 300), 10));

  this.zones.push(new Zone(
    new Point(55, 70), "z1", 0.5, [0, 0, 5, 5, 5, 0, 0]));
  this.zones.push(new Zone(
    new Point(60, 200), "z2", 0.5, [0, 0, 5, 5, 5, 0, 0]));
  this.zones.push(new Zone(
    new Point(370, 60), "z3", 0.35, [5, 5, 0, 0, 0, 5, 5]));
  this.zones.push(new Zone(
    new Point(340, 290), "z4", 0.8, [5, 5, 0, 0, 0, 5, 5]));
}
