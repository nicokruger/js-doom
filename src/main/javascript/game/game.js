
Game = function(data) {
    this.screenStack = [];
    this.setCenter(data.player1[0], data.player1[1]);
    this.extents = data.extents;
    
    $("#console").val($("console").val() + "\nPlayer start at " + data.player1[0] + "," + data.player1[1]);
    console.log("Player start at " + data.player1[0] + "," + data.player1[1]);
    console.log("Extents: " + this.extents.x1 + " / " + this.extents.y1 + " - " + this.extents.x2 + "/" + this.extents.y2);

    // Load level
    var that=this;
    this.sectors = doom.get_sectors(data);

}

Game.prototype.setCenter = function (x,y) {
    this.x = x;
    this.y = y;
}


