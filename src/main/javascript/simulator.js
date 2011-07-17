
Simulator = function(zones,towers) {
	this.zones = zones
	this.towers = towers
}

Simulator.prototype.simulate = function() {
	var network = new Network();
	
	state = {}
	state["zones"] = network.generateCalls(this.zones)

	tower_utilizations = network.towerCapacities(state["zones"], this.towers)
	state["towers"] = this.towers
	zip(state["towers"], tower_utilizations, function(a,b) { a["utilisation"] = b } );
	return state;
}

