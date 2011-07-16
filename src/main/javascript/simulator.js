var Simulator = function() { }

// Return the number of calls per zone, given a population snapshot
Simulator.prototype.generateCalls = function (zones, populations) {

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

// Return the zones that are services by a tower.
Simulator.prototype.zonesServiced = function(zones, towers) {
		
}

Simulator.prototype.generateCapacity = function(towers) {
	return reduce(towers, function(a,b) { a += b["capacity"]; return a}, 0);
}

//Simulator.prototype.generateLoad = function(zones, populations, 

// Convert the zones callFactor,
// together with the zones puplation
// at time t, and return a normalised
// list of number of calls per block
Simulator.prototype.normalize = function(zones, populations) {
}



//exports.Simulator = Simulator
//exports.generateCalls = generateCalls
