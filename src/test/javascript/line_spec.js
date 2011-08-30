describe("Intersections", function () {
    describe("Line intersection points", function() {
        it("handles intersections", function() {
            expect($L.intersection($L($V(0,0), $V(10,10)), $L($V(0,10), $V(10,0)))).toEqual($V(5,5));
            expect($L.intersection($L($V(0,10), $V(10,0)), $L($V(0,0), $V(10,10)))).toEqual($V(5,5));
        });
        it("handles NON-intersections", function() {
            expect($L.intersection($L($V(0,10), $V(10,0)), $L($V(9,9), $V(10,10)))).toEqual(null);
        });
        it("handles intersections close to a vertex", function() {
            var ray = $L($V(0,10), $V(10,10)); var edge = $L($V(10,0), $V(10,10));
            expect($L.intersection(ray, edge)).toEqual($V(10,10));
            edge = $L($V(10, 0), $V(9.99, 9.99));
            expect($L.intersection(ray, edge)).toEqual($V(10,10));
        });
        it("handles odd intersections", function() {
            var ray = $L($V(100,100), $V(88, 92.07)); var edge = $L($V(10000,99), $V(0,99));
            expect($L.intersection(ray,edge)).toEqual($V(98.49, 99))
        });
    });
    
    describe("Line intersection classification", function() {
        it("classifies intersections at vertex extremes", function () {
            var l1 = $L($V(5,4), $V(5,5)); var l2 = $L($V(4,5), $V(5,5));
            expect(l1.intersects(l2)).toBe(Line.INTERSECTS_FORWARD); // INTERSECTS_FORWARD
        
            var l1 = $L($V(5,5), $V(0,0)); var l2 = $L($V(4,5), $V(5,5));
            expect(l1.intersects(l2)).toBe(Line.INTERSECTS_BACKWARD); // INTERSECTS_FORWARD
        });

        it("classifies co-incident lines", function () {
            expect($L.intersects($L($V(0,0), $V(1,1)), $L($V(0.5,0.5), $V(3,3)))).toBe(Line.COINCIDENT);
            expect($L.intersects($L($V(0,0), $V(1,0)), $L($V(0,0), $V(1,0)))).toBe(Line.COINCIDENT);
        });
        
        it("classifies the relation between two lines", function () {
            expect($L.intersects($L($V(0,0), $V(10,0)), $L($V(15,15), $V(5,15)))).toBe(Line.LEFT);
            expect($L.intersects($L($V(0,0), $V(0,2)), $L($V(-3,1), $V(-2,1)))).toBe(Line.LEFT)
        });
        
        it("classifies intersecting lines with the same direction", function() {
            expect($L.intersects($L($V(0,0), $V(0,2)), $L($V(-1,1), $V(1,1)))).toBe(Line.INTERSECTS_FORWARD);
            expect($L.intersects($L($V(0,0), $V(10,10)), $L($V(0,10), $V(10,0)))).toBe(Line.INTERSECTS_FORWARD);
            expect($L.intersects($L($V(5,5), $V(10,10)), $L($V(0,10), $V(10,0)))).toBe(Line.INTERSECTS_FORWARD);
        });
        
        it("classifies intersecting lines with opposite direction", function () {
            expect($L.intersects($L($V(0,2), $V(0,0)), $L($V(-1,1), $V(1,1)))).toBe(Line.INTERSECTS_BACKWARD)
            expect($L.intersects($L($V(0,10), $V(10,0)), $L($V(0,0), $V(10,10)))).toBe(Line.INTERSECTS_BACKWARD);
            expect($L.intersects($L($V(10,0), $V(10,10)), $L($V(15,15), $V(5,15)))).toBe(Line.INTERSECTS_BACKWARD);
            expect($L.intersects($L($V(-9,-9), $V(-10,-10)), $L($V(0,10), $V(10,0)))).toBe(Line.INTERSECTS_BACKWARD);
        });

        it("should be handle the intersection edge cases of a 'line' having origin and end points the same", function() {
        
            // Check the intersection at the end point
            expect($L.intersects($L($V(5,5), $V(10,5)), $L($V(10,5), $V(10,5)))).toBe(Line.COINCIDENT);
            // Check the intersection at the origin point
            expect($L.intersects($L($V(10,5), $V(5,5)), $L($V(5,5), $V(5,5)))).toBe(Line.COINCIDENT);

            // Check the intersection at the origin point
            expect($L.intersects($L($V(5,5), $V(10,5)), $L($V(5,5), $V(5,5)))).toBe(Line.COINCIDENT);
            // Check the intersection at the end point
            expect($L.intersects($L($V(10,5), $V(5,5)), $L($V(5,5), $V(5,5)))).toBe(Line.COINCIDENT);

            expect($L.intersects($L($V(10,5), $V(10,5)), $L($V(5,5), $V(10,5)))).toBe(Line.COINCIDENT);
            expect($L.intersects($L($V(5,5), $V(5,5)), $L($V(5,5), $V(10,5)))).toBe(Line.COINCIDENT);

            expect($L.intersects($L($V(10,5), $V(10,5)), $L($V(5,5), $V(10,5)))).toBe(Line.COINCIDENT);
            expect($L.intersects($L($V(10,5), $V(10,5)), $L($V(5,5), $V(10,5)))).toBe(Line.COINCIDENT);
        
        });
        
    });
    
    
});