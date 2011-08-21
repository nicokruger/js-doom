Game = function(width,height,data) {
    this.screenStack = [];
    this.width = width;
    this.height = height;

    this.screenStack.push(new GameScreenGL(this.width, this.height, data));
}

Game.prototype.update = function(deltaTime) {
    this.screenStack[this.screenStack.length - 1].update(deltaTime);
}

Game.prototype.draw = function (ctx) {
    this.screenStack[this.screenStack.length -1].draw(ctx);
}

