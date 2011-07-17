describe("2. The simulation layer", function() {

	beforeEach(function() {
		this.zones = [
			{ 
				label: "A",
				callFactor: 0.7,
				points: [[0,0],[0,1],[1,1],[1,0]],
				population: 100
			},
			{
				label: "B",
				callFactor: 0.2,
				points: [[1,0],[2,0],[2,1],[1,1]],
				population: 100
			}
		]

		this.towers = [
			{ 
				point: [0,0],
				radius: 10,
				capacity: 1,
			}
		]


	});

	it("should be possible to retrieve the 'filled-in' zones from the simulator",function() {

		var s = new Simulator(this.zones,this.towers);
		simulation_state = s.simulate()	

		expect(simulation_state["zones"][0]["calls"]).toBe(70);
		expect(simulation_state["zones"][1]["calls"]).toBe(20);
	})

	it("should be possible to retrieve the 'filled-in' towers from the simulator",function() {

		var s = new Simulator(this.zones,this.towers);
		simulation_state = s.simulate()	

		expect(simulation_state["towers"][0]["utilisation"]).toBe(-89);
	})

});
