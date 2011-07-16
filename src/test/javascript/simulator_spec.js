describe('Simulator',function(){

	describe("The calculation of the number of calls per zone", function() {
		it("must be a product of the population of each zone, and the willingness of the customer to place a call", function() {
			var s = new Simulator();
			calls = s.generateCalls(
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
			var s = new Simulator();
			expect(s.generateCapacity([{pos:[0,0],capacity:100},{pos:[0,0],capacity:50}])).toBe(150);
		});
	});
	
});
