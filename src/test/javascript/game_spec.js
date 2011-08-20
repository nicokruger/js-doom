describe('3. The actual game',function(){

    it("It should be possible to load a level, which is a list of polygons, from a JSON file", function() {

        var polygons;

        runs(function() {
            $.getJSON("../../src/main/javascript/data/level1.json", function(data) {
               polygons = data;
            }).error(function(e) {
                alert("error:" + e.statusText);
            });
        });

        waitsFor(function() { return polygons != null; }, "Could not retrieve example JSON level");

        runs(function() {
            expect(polygons["zones"][0]["points"].length).toBe(4);

            zones = get_zones(polygons);
            expect(zones.length).toBe(1);
        })
    });


});
