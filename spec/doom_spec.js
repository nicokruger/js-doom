describe("The doom game library", function() {
    
    it("should be able to convert doom sub-sectors into polygons for drawing", function () {
        var polygons = null;
        
        runs(function() {
            $.getJSON("src/main/javascript/data/hole.json", function(data) {
                polygons = doom.get_sectors(data);
            });
        });
        
        waitsFor(function() { return polygons != null; });
        
        runs(function() {
            expect(polygons.length).toBe(1);
            
            expect(polygons[0].poly.edges[0]).toEqual($L($V(-768,768), $V(-256, 768)));
            
        });
    });
   
});