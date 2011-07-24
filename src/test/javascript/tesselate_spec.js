describe("5. Our very simple object tesselator", function() {
	beforeEach(function() {
		this.addMatchers({
			/**
			 * We need this custom matcher because of floating point losses.
			 * This matcher checks whether the actual value falls in a range
			 * of (expected - epsilon, expected + epsilon)
			 */
			toBeInDeltaRange: function(expected, epsilon) {
				for (var i = 0; i < expected.length; i++) {
					if (Math.abs(this.actual[i] - this.expected[i]) >= epsilon)
						return false;
				}
				return true;
			}
		})
	});

	it("should be able to tesselate the unit circle into triangles", function() {
		// TODO: this test is incomplete
		// We need to write a custom matcher that matches all
		// elements in an array with an epsilon error threshold
		// ala math_spec.js, but for a list.
		triangles = tesselate_circle([0,0],1,4);
		expect(triangles.length).toEqual(4)
		//expect(triangles[0]).toBeInDeltaRange([[0,0],[1,0]], 0.01);
		//expect(triangles[1]).toBeInDeltaRange([1,0], 0.01);
		//expect(triangles[2]).toBeInDeltaRange([0,1], 0.01);
	});

	it("should be able to create a polygon from a tower definition", function() {
        var circle_poly = circle_to_poly([0.5,0.5], 1.0, 16);
        var poly = $P($V(0,0), $V(1,0), $V(1,1), $V(0,1));

        expect(circle_poly.intersection(poly).area()).toBe(1.0);
	});
});
