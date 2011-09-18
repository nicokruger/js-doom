describe("The GameScreen software renderer", function() {
    
    describe("The scanner should be able to generate horizontal scanlines for a polygon", function() {
        
        it("should be possible to generate horizontal scanlines for a square", function () {
            var p = $P($V(5,5), $V(15,5), $V(15,10), $V(5,10));
            var rays = Scanner(p);
            
            expect(rays.length).toBe(6);
            
            expect(rays[0].length).toBe(1); expect(rays[0][0].origin).toEqual($V(5,5));
            expect(rays[1].length).toBe(1); expect(rays[1][0].origin).toEqual($V(5,6));
            expect(rays[2].length).toBe(1); expect(rays[2][0].origin).toEqual($V(5,7));
            expect(rays[3].length).toBe(1); expect(rays[3][0].origin).toEqual($V(5,8));
            expect(rays[4].length).toBe(1); expect(rays[4][0].origin).toEqual($V(5,9));
            expect(rays[5].length).toBe(1); expect(rays[5][0].origin).toEqual($V(5,10));
        });

    });
});

/**
 * This test is failing. We are missing the topmost scanline

        it("should be possible to generate horizontal scanlines for a polygon, ending at a point at the top (like a triangle)", function () {
            
            var p = $P($V(5,5), $V(10,5), $V(10,10));
            var rays = Scanner(p);

            expect(rays.length).toBe(5);

            expect(rays[0].length).toBe(1);
            expect(rays[0][0].origin).toEqual($V(5,5));
            expect(rays[1].length).toBe(1);
            expect(rays[1][0].origin).toEqual($V(6,6));
            expect(rays[2].length).toBe(1);
            expect(rays[2][0].origin).toEqual($V(7,7));
            expect(rays[3].length).toBe(1);
            expect(rays[3][0].origin).toEqual($V(8,8));
            expect(rays[4].length).toBe(1);
            expect(rays[4][0].origin).toEqual($V(9,9));
            //expect(rays[5].length).toBe(1);
            //expect(rays[5][0].origin).toEqual($V(10,10));
        });
        
*/
