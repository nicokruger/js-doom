function GameScreen(src) {
  console.info("Loading level from: " + src);

  this.currentHour = 2;

  this.gameComponents = new Array();
  this.gameComponents.push(new Tower(
    new Point(70, 130), 10));
  this.gameComponents.push(new Tower(
    new Point(350, 60), 20));
  this.gameComponents.push(new Tower(
    new Point(350, 300), 10));

  this.gameComponents.push(new Zone(
    new Point(55, 70), "z1", 0.5, [0, 0, 5, 5, 5, 0, 0]));
  this.gameComponents.push(new Zone(
    new Point(60, 200), "z2", 0.5, [0, 0, 5, 5, 5, 0, 0]));
  this.gameComponents.push(new Zone(
    new Point(370, 60), "z3", 0.35, [5, 5, 0, 0, 0, 5, 5]));
  this.gameComponents.push(new Zone(
    new Point(340, 290), "z4", 0.8, [5, 5, 0, 0, 0, 5, 5]));

  this.updateComponents = function (screen) {
    screen.currentHour = (screen.currentHour + 1) % 7;

    for (i in screen.gameComponents) {
      screen.gameComponents[i].updateComponent(screen.currentHour);
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