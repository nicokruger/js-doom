
Game = function(data) {
    this.screenStack = [];
    this.setCenter(data.player1[0], data.player1[1]);

    $("#console").val($("console").val() + "\nPlayer start at " + data.player1[0] + "," + data.player1[1]);
    console.log("Player start at " + data.player1[0] + "," + data.player1[1]);

    // Load level
    var that=this;
    this.sectors = get_sectors(data);

}

Game.prototype.setCenter = function (x,y) {
    this.x = x;
    this.y = y;
}


