
var simulator = require("./simulator.js")
var f = require("./f.js")

// shitty test "framework"
var run = function() {};

run.prototype.run = function() {

	this.testFunctionalTools();
	testSimulator();
}

testSimulator = function() {
	// We have two zones
	// Blocks Like this:
	// |-------|
	// | A | B |
	// ---------
	zones = [ 
	   {
	   	label: "A",
		callFactor: 1.0,
		bounds: [[0,0],[0,1],[1,1],[1,0]]
	}, {
		label: "B",
		callFactor: 0.5,
		bounds: [[1,0],[2,0],[2,1],[1,1]]
	}]


	// We only have 4 hours in a day
	// Popluation moves between blocks.
	timeline = [
		{A:2,B:1},
		{A:1,B:2},
		{A:0,B:3},
		{A:1,B:2}
	]

	var c = new simulator.Simulator(zones, timeline);
	// start the simulation (simulate hour 0)
	c.start()
	// calculate next hour
	c.step()
	// calculacte next hour
	c.step()


}

run.prototype.testFunctionalTools = function() {
	system.stdout("Functional Tests\n")
	this.test("10 == f.sum([0,1,2,3,4])")

	this.m = f.map([0,1,2,3], function(a) { return a+1; });
	this.test("1 == this.m[0]")
	this.test("2 == this.m[1]")
	this.test("3 == this.m[2]")
	this.test("4 == this.m[3]")

	this.z = f.zip([0,1,2,3], [4,5,6,7], function(a,b) { return a+b; } )
	this.test("4 == this.z[0]")
	this.test("6 == this.z[1]")
	this.test("8 == this.z[2]")
	this.test("10 == this.z[3]")
}

run.prototype.test = function(code){
        system.stdout(code + " ------ " + eval(code) + "\n");
}

var t = new run();
t.run();



