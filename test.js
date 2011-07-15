
var cryptor = require("./simulator.js")

// shitty test "framework"
var run = function() {};

run.prototype.run = function() {

	// We have two zones
	// Blocks Like this:
	// |---|---|
	// | A | B |
	// ---------
	zones = [ 
	   {
	   	label: "A",
		callFactor: 1.0,
		bounds = [[0,0],[0,1],[1,1],[1,0]]
	}, {
		label: "B",
		callFactor: 0.5,
		bounds =[[1,0],[2,0],[2,1],[1,1]]
	}]


	// We only have 4 hours in a day
	// Popluation moves between blocks.
	timeline = [
		{A:2,B:1},
		{A:1,B:2},
		{A:0,B:3},
		{A:1,B:2}
	]
	c = simulator.Simulator(zones, timeline)

	// start the simulation (simulate hour 0)
	c.start()
	// calculate next hour
	c.step()
	// calculacte next hour
	c.step()


}

run.prototype.test = function(code){
        system.stdout(code + " ------ " + eval(code) + "\n");
}

var t = new run();
t.run();



