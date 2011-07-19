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
	    expect($V(12,0).length()).toBeInDeltaRange(12.0, 0.1)
	});

	it("must be possible to add 2 vectors", function() {
		expect($V.add($V(10,10), $V(0.5,0.5))).toEqual($V(10.5,10.5));
	});

	it("should be possible to subtract 2 vectors (even thought its clumsy :) )", function() {
		expect($V.sub($V(10,10), $V(0.5,0.5))).toEqual($V(9.5,9.5));
	});
	
	it("shuld be possible to perform the dot product of 2 vectors", function() {
		expect($V.dot($V(1,2),$V(3,-4))).toBe(-5);
	});

	it("should be possible to convert from a vector to a line", function() {
        expect($V(6,6).offset($V(4,4))).toEqual($L($V(4,4), $V(10,10)))
        expect($V(6,6).offset($V(4,4)).canonical(), $V(6,6))
	});

	it("should be possible to convert from a line to a vector", function() {
        expect($L($V(4,4), $V(6,6)).canonical()).toEqual($V(2,2))

        expect($L($V(4,4), $V(6,6)).canonical().offset($V(4,4))).toEqual($L($V(4,4), $V(6,6)))

	})

	it("should be possible to get the right-hand normal", function() {
		expect($V(1,1).rightNormal()).toEqual($V(-1,1));
		expect($V(10,8).rightNormal()).toEqual($V(-8,10));
		expect($V(1,0).rightNormal()).toEqual($V(0,1));
	})
	it("should be possible to get the left-hand normal", function() {
		expect($V(1,1).leftNormal()).toEqual($V(1,-1));
		expect($V(10,8).leftNormal()).toEqual($V(8,-10));
		expect($V(1,0).leftNormal()).toEqual($V(0,-1));
	})

});
