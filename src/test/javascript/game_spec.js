describe('3. The actual game',function(){

	describe("The converter between Game objects and Simulator objects", function () {
		it("should be able to convert from a Game Zone object to a zone simulator struct", function () {
			var z = new Zone(new Point(55, 70), "z1", 0.5, [1, 1, 5, 5, 5, 1, 1]);

			z = ConvertGameZones([z])[0];
			expect(z["poly"]).toEqual($P(  $V(5,20), $V(105, 20),  $V(105,120), $V(5,120)))
			expect(z["callFactor"]).toBe(0.5);
			expect(z["label"]).toEqual("z1");
			//expect(5).toBe(5);
		});

		it("should be able to convert from a Game Tower object to a tower simulator struct", function() {
			var t = new Tower(new Point(70, 130), 10);

			t = ConvertGameTowers([t])[0];
			expect(t["point"]).toEqual([70,130]);
			expect(t["radius"]).toBe(50);
			expect(t["capacity"]).toBe(10);

		});
	});

	it("should be possible to run the simulation on the first set of example data", function() {
	
		towerObjects = [
			new Tower(new Point(70, 130), 10),
			new Tower(new Point(350, 60), 20),
			new Tower(new Point(350, 300), 10)
		]

		zoneObjects = [
			new Zone(new Point(55, 70), "z1", 0.5, [1, 1, 5, 5, 5, 1, 1]),
			new Zone(new Point(60, 200), "z2", 0.5, [1, 1, 5, 5, 5, 1, 1]),
			new Zone(new Point(370, 60), "z3", 0.35, [5, 5, 1, 1, 1, 5, 5]),
			new Zone(new Point(340, 290), "z4", 0.8, [5, 5, 1, 1, 1, 5, 5])
		]

		var zones = ConvertGameZones(zoneObjects);

		expect(zones[0]["poly"]).toEqual($P($V(5,20), $V(105, 20), $V(105,120), $V(5,120)))
		expect(zones[1]["poly"]).toEqual($P($V(10,150), $V(110, 150), $V(110,250), $V(10,250)))
		expect(zones[2]["poly"]).toEqual($P($V(320,10), $V(420, 10), $V(420,110), $V(320,110)))
		expect(zones[3]["poly"]).toEqual($P($V(290,240), $V(390, 240), $V(390,340), $V(290,340)))

		var towers = ConvertGameTowers(towerObjects);

		expect(towers[0]["point"]).toEqual([70,130])
		expect(towers[0]["point"]).toEqual([70,130])
		expect(towers[1]["point"]).toEqual([350,60])
		expect(towers[2]["point"]).toEqual([350,300])

		var s = new Simulator(zones, towers);
		state = s.simulate()	

		expect(state["zones"][0]["calls"]).toBe(0.5);
		expect(state["towers"][0]["utilisation"]).toBe(9);
	});

});
