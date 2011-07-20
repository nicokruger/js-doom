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
	
	it("should be possible to perform the dot product of 2 vectors", function() {
		expect($V.dot($V(1,2),$V(3,-4))).toBe(-5);
	});

    it("should be possible to multiply (extend) a vector with a scalar", function() {
        expect($V.mul(10, $V(1,1))).toEqual($V(10,10));
    })
	it("should be possible to convert from a vector to a line", function() {
        expect($V(6,6).offset($V(4,4))).toEqual($L($V(4,4), $V(10,10)))
        expect($V(6,6).offset($V(4,4)).canonical(), $V(6,6))
	});

	it("should be possible to convert from a line to a vector", function() {
        expect($L($V(4,4), $V(6,6)).canonical()).toEqual($V(2,2))

        expect($L($V(4,4), $V(6,6)).canonical().offset($V(4,4))).toEqual($L($V(4,4), $V(6,6)))

	})

    it("should be possible to move a line around 2d-space", function() {
        expect($L.move($L($V(5,5), $V(10,10)), $V(-5, -5))).toEqual($L($V(0,0), $V(5,5)));
    })

    it("should be possible to split at a line at a point on the line", function() {
        expect($L.split($L($V(10,10), $V(20,20)), $V(15,15))).toEqual({
            before: $L($V(10,10), $V(15,15)),
            after: $L($V(15,15), $V(20,20))
        })
    })

    it("should be possible to get the intersection point of two lines", function() {

        expect($L.intersection($L($V(0,0), $V(10,10)), $L($V(0,10), $V(10,0)))).toEqual($V(5,5));
        expect($L.intersection($L($V(0,10), $V(10,0)), $L($V(0,0), $V(10,10)))).toEqual($V(5,5));

        // test two lines that do NOT intersect
        expect($L.intersection($L($V(9,9), $V(10,10)), $L($V(0,10), $V(10,0)))).toBe(null);
    })

    it("should be possible to determine whether a line is to the left, intersecting, or to the right of another line", function() {
        expect($L.intersects($L($V(0,0), $V(10,10)), $L($V(0,10), $V(10,0)))).toBe(Line.INTERSECTS);
        expect($L.intersects($L($V(0,10), $V(10,0)), $L($V(0,0), $V(10,10)))).toBe(Line.INTERSECTS);

        // test two lines that do NOT intersect
        expect($L.intersects($L($V(9,9), $V(10,10)), $L($V(0,10), $V(10,0)))).toBe(Line.LEFT);
        expect($L.intersects($L($V(-9,-9), $V(-10,-10)), $L($V(0,10), $V(10,0)))).toBe(Line.RIGHT);

        // test coincident lines
        expect($L.intersects($L($V(0,0), $V(1,1)), $L($V(0.5,0.5), $V(3,3)))).toBe(Line.COINCIDENT);

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
