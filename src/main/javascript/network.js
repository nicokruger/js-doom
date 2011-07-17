var Network = function() { }

// Return the number of calls per zone, given a population snapshot
Network.prototype.generateCalls = function (zones, populations) {

	sorted = [];
	population = [];
	populations.eachSorted( function (key, value) { sorted.push(key); population.push(value); } );

	calls = []
	reduce(zones, function(a,b) {
		a[b["label"]] = b["callFactor"]
		return a
	}, {}).eachSorted(function (key, value) { calls.push(value); });


	total_calls = zip(calls, population, function(x,y) { return x*y });

	calls = {}
	zip(sorted, total_calls, function(x,y) { return [x,y] }).each(function(key, x) { calls[x[0]] = x[1]; } );
	return calls;	
}

// Return the zones that are serviced by a tower.
Network.prototype.zonesServiced = function(zones, tower) {
	
	tesselated_tower = tesselate_circle(tower["point"], tower["radius"], 16);

	serviced_zones = []
	zones.forEach(function (zone) {
		for (var i =0; i < tesselated_tower.length; i++) {
			triangle = tesselated_tower[i];
			if (poly_intersect_simple(zone["points"], triangle)) {
				serviced_zones.push(zone);
				break;
			}
		}
	});
	return serviced_zones;
}

// Return the towers that are servicing a node.
Network.prototype.towersServicing = function(zone, towers) {
	var that = this; // unfortunate - must be a better way
	//serviced = towers.map(function(tower) { 
	serviced = towers.map(function(tower) {
		return that.zonesServiced([zone], tower).length > 0 ? tower : null; 
	})
	serviced = serviced.filter(function(x) { return x != null });
	return serviced;
}

// Calculate the distribution of calls from a zone towards towers
Network.prototype.callDistribution = function(zone, towers) {
	connected_towers = this.towersServicing(zone, towers);
	distribution = towers.map(function(tower) { return connected_towers.indexOf(tower) != -1 ? 1 : 0 });
	return distribution.map(function (d) { return d * (zone["calls"]/connected_towers.length )});
}

Network.prototype.generateCapacity = function(towers) {
	return reduce(towers, function(a,b) { a += b["capacity"]; return a}, 0);
}

//Simulator.prototype.generateLoad = function(zones, populations, 

// Convert the zones callFactor,
// together with the zones puplation
// at time t, and return a normalised
// list of number of calls per block
Network.prototype.normalize = function(zones, populations) {
}



//exports.Simulator = Simulator
//exports.generateCalls = generateCalls
