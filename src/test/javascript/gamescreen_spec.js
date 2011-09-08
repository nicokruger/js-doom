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
    
    describe("The bounder", function() {
        it(" should take a viewport, a set of rays (from scanner), the poly and find the smallest overlapping part to rasterize", function () {
                var f = jasmine.createSpy();
            
                /**
                    +-------+(10,10)
                    |       |
                  +-|--+    |
                  | |  |    |
         (3,3)    | +-------+
	          +----+
	       (0,0)
                  * So the polygon should be rasterized from (3,3) to (5,5)
                  * but the result of the rasterized onto (0,0),(2,2) in the image buffer
                  */
                var p = $P($V(0,0), $V(5,0), $V(5,5), $V(0,5));
                var rays = Scanner(p);
                
                Bounder(new Viewport({ forEach: function(){}}, 3, 3, 10 , 10),  p, rays, f);

                expect(f).toHaveBeenCalledWith(3, 5, 3);
                expect(f).toHaveBeenCalledWith(3, 5, 4);
                expect(f).toHaveBeenCalledWith(3, 5, 5);
        });
    });
    
    describe("The pixeler", function() {
        it("should color in a pixel buffer", function () {
            var data = {
                    width: 3,
                    data: [ 
                        0,0,0,0, 0,0,0,0, 0,0,0,0,
                        0,0,0,0, 0,0,0,0, 0,0,0,0,
                        0,0,0,0, 0,0,0,0, 0,0,0,0
                    ]
            };
            
            var pixeler = Pixeler(new Viewport({ forEach : function(){}}, 2, 2, 4, 4), data);
            var p = $P($V(2,2), $V(3,2), $V(3,3), $V(2,3));
            var rays = Scanner(p);
            
            Bounder(new Viewport({ forEach: function(){}}, 2, 2, 4, 4),  p, rays, pixeler);

            /*       viewport.y2 - (y - viewport.y1)
                   f -> [2 - v.x1,3 - v.x1], 2 (3)     ---->      [0 - 1],
                   f -> [2 - v.x1,3 - v.x1], 3 (2)     ---->      (2 - x1 = 0,3 - x1 = 1).2
              */
            expect(data.data).toEqual([
            0,0,0,0,  0,0,0,0,  0,0,0,0,
             /*  (2,3)            (3,3)  */
            255,255,255,255,  255,255,255,255,   0,0,0,0,
            255,255,255,255,  255,255,255,255,   0,0,0,0,
              /* (2,2)           (3,2) */
                ]);
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
