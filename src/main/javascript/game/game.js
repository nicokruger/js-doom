Game = function(width,height) {
    this.screenStack = [];
    this.width = width;
    this.height = height;
}

Game.prototype.init = function() {
    this.screenStack.push(new GameScreen(this.width, this.height, "resources/levels/doom.json"));
}


Game.prototype.update = function(deltaTime) {
    this.screenStack[this.screenStack.length - 1].update(deltaTime);
}

Game.prototype.draw = function (ctx) {
    this.screenStack[this.screenStack.length -1].draw(ctx);
}

