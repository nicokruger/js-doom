describe('3. The actual game',function(){

    describe("It should be possible to load a level, which is a list of polygons, from a JSON file", function() {
        var polygons;

        runs(function() {
            $.getJSON("../../src/main/javascript/data/level1.json", function(data) {
               polygons = data["polygons"];
            }).error(function(e) {
                alert("error:" + e.statusText);
            });
        });

        waitsFor(function() { return polygons != null; }, "Could not retrieve example JSON level");

        runs(function() {
            expect(polygons[0]["points"].length).toBe(4);
        })
    });

	describe("The converter between Game objects and Simulator objects", function () {

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

        var p1 = $P($V(55 - 50, 70 - 50), $V(55 + 50, 70 - 50), $V(55 + 50, 70 + 50), $V(55-50, 70+50));
        var p2 = $P($V(60 - 50, 200 - 50), $V(60+ 50, 200 - 50), $V(60 + 50, 200 + 50), $V(60-50, 200+50));
        var p3 = $P($V(370- 50, 60 - 50), $V(370 + 50, 60- 50), $V(370 + 50, 60 + 50), $V(370-50, 60+50));
        var p4 = $P($V(340 - 50, 290 - 50), $V(340+ 50, 290 - 50), $V(340 + 50, 290 + 50), $V(340-50, 290+50));


		zoneObjects = [
			new Zone(p1, "z1", 0.5, [1, 1, 5, 5, 5, 1, 1]),
			new Zone(p2, "z2", 0.5, [1, 1, 5, 5, 5, 1, 1]),
			new Zone(p3, "z3", 0.35, [5, 5, 1, 1, 1, 5, 5]),
			new Zone(p4, "z4", 0.8, [5, 5, 1, 1, 1, 5, 5])
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
