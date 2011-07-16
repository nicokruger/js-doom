describe("Our very simple clipping library", function() {
	it("should be able to determine the edges for a poly from a set of points", function() {
		expect(get_edges([[0,0],[1,0],[2,0]])).toEqual([[ [0,0], [1,0] ], [ [1,0],[2,0] ], [ [2,0], [0, 0] ] ]);
	});
	it("should be able to detect whether two (convex) polygons intersect", function() {
		var poly1 = [[0,0],[1,0],[1,1],[0,1]];
		var poly2 = [[0.5,0],[1.5,0],[1.5,1],[0.5,1]];

		expect(poly_intersect_simple(poly1, poly2)).toBe(true);
	});
	it("should be able to detect whether two (convex) polygons DO NOT intersect", function() {
		var poly1 = [[0,0],[1,0],[1,1]];
		var poly2 = [[3,3],[4,3],[4,4]];
		
		expect(poly_intersect_simple(poly1, poly2)).toBe(false);
	});
	it("should be able to solve some more complex polygons intersection problems", function() {
		var octa = [[0,0],[1,0],[2,2],[2,3],[1,4],[0,4],[-1,3],[-1,2]];
		var square = [[1,0],[2,0],[2,2],[1,2]];
		var square2 = [[2,0],[3,0],[3,2],[2,2]];
		var square3 = [[2,0],[3,0],[3,1],[2,1]];

		expect(poly_intersect_simple(octa, square)).toBe(true);
		expect(poly_intersect_simple(octa, square2)).toBe(true);
		expect(poly_intersect_simple(octa, square3)).toBe(false);
	});

});