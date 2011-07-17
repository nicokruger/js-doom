function Game() {

  this.screenStack = new Array();

  this.init = function init () {
    this.screenStack.push(new GameScreen("resources/levels/level01.json"));
  }

  this.update = function update (deltaTime) {
    this.screenStack[this.screenStack.length - 1].update(deltaTime);
  }

  this.draw = function (ctx) {
    this.screenStack[this.screenStack.length -1].draw(ctx);
  }
}