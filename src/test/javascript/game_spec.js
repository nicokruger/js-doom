describe('3. The actual game',function(){

    it("It should be possible to load a level, which is a list of polygons, from a JSON file", function() {

        var polygons;

        runs(function() {
            $.getJSON("../../src/main/javascript/data/testlevel.json", function(data) {
               polygons = data;
            }).error(function(e) {
                alert("error:" + e.statusText);
            });
        });

        waitsFor(function() { return polygons != null; }, "Could not retrieve example JSON level");

        runs(function() {
            expect(polygons["sectors"][0]["points"].length).toBe(4);

            //zones = get_sectors(polygons);
            //expect(zones.length).toBe(1);
        })
    });


});
