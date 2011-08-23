Game = function(width,height,data) {
    this.screenStack = [];
    this.width = width;
    this.height = height;

    //this.screenStack.push(new GameScreenGL(this.width, this.height, data));
    this.screenStack.push(new GameScreenGL(this.width, this.height, data));

}

Game.prototype.update = function(deltaTime) {
    this.screenStack[this.screenStack.length - 1].update(deltaTime);
}

Game.prototype.draw = function (ctx) {
    this.screenStack[this.screenStack.length -1].draw(ctx);
}



//
// Basic input stuff
//

Game.prototype.mouseMove = function (x,y) {
    //this.screenStack[this.screenStack.length - 1].mouseMove(x,y);
}

Game.prototype.mouseUp = function (x,y) {
    //this.screenStack[this.screenStack.length - 1].mouseUp(x,y);
}

Game.prototype.mouseDown = function (x,y) {
    //this.screenStack[this.screenStack.length - 1].mouseDown(x,y);
}