describe('1. Very basic GSM network',function(){

	describe("The calculation of the number of calls per zone", function() {
		it("must be a product of the population of each zone, and the willingness of the customer to place a call", function() {
			var n = new Network();
			calls = n.generateCalls(
				[{label: "A", callFactor: 1.0}, {label: "B", callFactor:0.5}, {label:"C", callFactor:1.0}], {
					A: 10,
					B: 10,
					C: 100
				})
			expect(calls).toEqual({A: 10, B: 5, C: 100})
		});
	});
	describe("The total capacity of the network", function() {
		it("should be the total capacity of all the towers in the network", function() {
			var n = new Network();
			expect(n.generateCapacity([{pos:[0,0],capacity:100},{pos:[0,0],capacity:50}])).toBe(150);
		});
	});

	describe("The towers in the network should serve the zones definied in it", function () {
		it("should be possible to retrieve the list of nodes serviced by a tower", function() {
			var n = new Network();

			zone1 = { points: [[0,0],[1,0],[1,1],[0,1]] };
			zone2 = { points: [[1,0],[2,0],[2,1],[1,1]] };

			zones = n.zonesServiced([zone1, zone2], {point: [1,0.5], radius: 1})
			expect(zones).toEqual([zone1, zone2]);

			zones = n.zonesServiced([zone1, zone2], {point: [10,10], radius: 1})
			expect(zones).toEqual([]);
		});
		it("should be possible to retrieve a list of zones being serviced by a tower", function() {
			var n = new Network();

			zone1 = { points: [[0,0],[1,0],[1,1],[0,1]] };
			zone2 = { points: [[1,0],[2,0],[2,1],[1,1]] };

			var tower1 = { point: [1,0.5], radius: 1};
			var tower2 = { point: [2.0,0.5], radius: 0.5};

			zones = n.towersServicing(zone1, [tower1, tower2])
			expect(zones).toEqual([tower1]);

			expect(n.towersServicing(zone2, [tower1, tower2])).toEqual([tower1, tower2]);

		});
	});

	describe("The distribution of calls from a zone to the towers in the network", function() {
		it("is simply the total number of calls in the zone divided equally amongst all towers connected to it", function() {
			var n = new Network();

			zone1 = { points: [[0,0],[1,0],[1,1],[0,1]], calls: 50 };
			zone2 = { points: [[1,0],[2,0],[2,1],[1,1]], calls: 50 };

			var tower1 = { point: [1,0.5], radius: 1, capacity: 50};
			var tower2 = { point: [2.0,0.5], radius: 0.5, capacity: 50};
	
			expect(n.callDistribution(zone1, [tower1, tower2])).toEqual([50, 0])
			expect(n.callDistribution(zone2, [tower1, tower2])).toEqual([25, 25])
		});
	})
	
});
