describe('Using our simplistic 2D vector math',function(){

	beforeEach(function() {
		this.addMatchers({
			/**
			 * We need this custom matcher because of floating point losses.
			 * This matcher checks whether the actual value falls in a range
			 * of (expected - epsilon, expected + epsilon)
			 */
			toBeInDeltaRange: function(expected, epsilon) {
				return Math.abs(this.actual - expected) < epsilon;
			}
		})
	});

	it("should be possible to determine the length of a vector, consisting of two points", function() {
		expect(v2_length([1,1],[2,1])).toBeInDeltaRange(1.0, 0.1);
	});

	it("must be possible to add 2 vectors", function() {
		expect(v2_add([10,10],[0.5,0.5])).toEqual([10.5,10.5]);
	});

	it("should be possible to subtract 2 vectors (even thought its clumsy :) )", function() {
		expect(v2_add([10,10], v2_neg([0.5,0.5]))).toEqual([9.5,9.5]);
	});
	
	it("shuld be possible to perform the dot product of 2 vectors", function() {
		expect(v2_dot([1,2],[3,-4])).toBe(-5);
	});

	it("should be possible to normalise a vector", function() {
		expect(v2_length([0,0],v2_normalise([4,4],[10,10]))).toBeInDeltaRange(1.0, 0.1)
	});

	it("should be possible to get the right-hand normal", function() {
		expect(v2_rh_normal([1,1])).toEqual([-1,1]);
		expect(v2_rh_normal([10,8])).toEqual([-8,10]);
		expect(v2_rh_normal([1,0])).toEqual([0,1]);
	})
	it("should be possible to get the left-hand normal", function() {
		expect(v2_lh_normal([1,1])).toEqual([1,-1]);
		expect(v2_lh_normal([10,8])).toEqual([8,-10]);
		expect(v2_lh_normal([1,0])).toEqual([0,-1]);
	})

});
