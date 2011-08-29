describe("Our very simple clipping library", function() {
    it("should be able to detect whether two (convex) polygons intersect", function() {
        var poly1 = $P($V(0,0), $V(1,0), $V(1,1), $V(0,1));
        var poly2 = $P($V(0.5,0), $V(1.5,0), $V(1.5,1), $V(0.5,1));

        expect(poly_intersect_simple(poly1, poly2)).toBe(true);
    });
    it("should be able to detect whether two (convex) polygons DO NOT intersect", function() {
        var poly1 = $P($V(0,0), $V(1,0), $V(1,1));
        var poly2 = $P($V(3,3), $V(4,3), $V(4,4));
        
        expect(poly_intersect_simple(poly1, poly2)).toBe(false);
    });
    it("should be able to solve some more complex polygons intersection problems", function() {
        var octa = $P($V(0,0), $V(1,0), $V(2,2), $V(2,3), $V(1,4), $V(0,4), $V(-1,3), $V(-1,2));
        var square = $P($V(1,0), $V(2,0), $V(2,2), $V(1,2));
        var square2 = $P($V(2,0), $V(3,0), $V(3,2), $V(2,2));
        var square3 = $P($V(2,0), $V(3,0), $V(3,1), $V(2,1));

        expect(poly_intersect_simple(octa, square)).toBe(true);
        expect(poly_intersect_simple(octa, square2)).toBe(true);
        expect(poly_intersect_simple(octa, square3)).toBe(false);
    });

});
