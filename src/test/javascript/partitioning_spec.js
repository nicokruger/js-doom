describe("BSP Trees", function () {
    
    describe("Using BSP trees to partition a polygon", function () {
        it("should partition both the top and bottom edges of the polygon", function() {
            var p = $P($V(4,4), $V(5,4), $V(5,5), $V(4,5));
            var r = p.partition($L($V(4,4), $V(5,4)));
            expect(r.cosame.length).toBe(1);
            var r = p.partition($L($V(4,5), $V(5,5)));
            expect(r.codiff.length).toBe(1);
        });
        
        it("should partition both the top and bottom edges of a triangle (ending in a point at a vertical extreme)", function() {
            var p = $P($V(0,0), $V(5,0), $V(5,5));
            var r = p.partition($L($V(4,5), $V(5,5)));
            // Problem: The first line in the BSP tree is (5,5) -> (0,0), with a coincident edge of the same line
            // 		This is correct
            //  The partitioning line (4,5) -> (5,5) is classified as RIGHT to this line
            //  where it is actually intersecting it at (0,0). In fact, it should be classified as intersecting
            //  in the same manner as the extended BSP line would have been reported to be intersecting.
            //expect(r.cosame.length).toBe(1);
        });
        
        it("should correctly partition a line that is co-incident to edges on the polygon (cosame)", function() {
            var square = $P($V(0,0), $V(10,0), $V(10,10), $V(0,10)); 
            var partitioned_line = square.partition($L($V(0,55), $V(0,-15)));
            expect(partitioned_line.cosame).toEqual([$L($V(0,10), $V(0,0))]);
        })

        it("should correctly partition a line that is co-incident to edges on the polygon (codiff)", function() {
            var square = $P($V(0,0), $V(10,0), $V(10,10), $V(0,10));
            var partitioned_line = square.partition($L($V(0,-15), $V(0,55)));

            expect(partitioned_line.codiff).toEqual([$L($V(0,10), $V(0,0))]);
        });
    });

});
