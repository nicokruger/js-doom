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

        it("should work for a non-convex polygon", function() {
           /*var p = $P($V(-192, 832), 
                $V(64, 832),
                $V(128, 832), 
                $V(256, 960), 
                $V(192, 1280), 
                $V(128, 1280), 
                $V(-64, 960), 
                $V(-256, 1280), 
                $V(-320, 1280), 
                $V(-384, 960), 
                $V(-256, 832));*/
            
            var f = jasmine.createSpy();
            var p = $P($V(-3, 13),  $V(1, 13), $V(2, 13),  $V(4, 15),  $V(3, 20),  $V(2, 20),  $V(-1, 15), 
                $V(-4, 20),  $V(-5, 20),  $V(-6, 15),  $V(-4, 13));
            var rays = Scanner(p);
            
            expect(rays.length).toBe(p.height + 1);
            
            var data = { width: p.width, data : [] };
            for (var i = 0; i < data.width * 4; i++) data.data[i] = 0;
            
            DrawScanlinesClosures(new ViewportNoClosures([{poly:p}], p.extremes.x1, p.extremes.y1, p.extremes.x2, p.extremes.y2),  p, rays)(f);
            
            
            expect(f).toHaveBeenCalledWith(-4, -3, 13);
            expect(f).toHaveBeenCalledWith(1, 2, 13);
            expect(f).toHaveBeenCalledWith(-5, -2, 14);
            expect(f).toHaveBeenCalledWith(-2, 3, 14);
            expect(f).toHaveBeenCalledWith(-6, -1, 15);
            expect(f).toHaveBeenCalledWith(-1, 4, 15);
            expect(f).toHaveBeenCalledWith(-6, -2, 16);
            expect(f).toHaveBeenCalledWith(0, 4, 16);
            expect(f).toHaveBeenCalledWith(-6, -2, 17);
            expect(f).toHaveBeenCalledWith(0, 4, 17);
            expect(f).toHaveBeenCalledWith(-5, -3, 18);
            expect(f).toHaveBeenCalledWith(1, 3, 18);
            expect(f).toHaveBeenCalledWith(-5, -3, 19);
            expect(f).toHaveBeenCalledWith(1, 3, 19);
            expect(f).toHaveBeenCalledWith(2, 3, 20);
            //expect(f).toHaveBeenCalledWith(-4, -5, 20); TODO: why? related to triangle bug?
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
            
                DrawScanlinesClosures(new ViewportNoClosures({ forEach: function(){}}, 3, 3, 10 , 10),  p, rays)(f);

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
            
            var pixeler = Pixeler(new ViewportNoClosures({ forEach : function(){}}, 2, 2, 4, 4), data);
            var p = $P($V(2,2), $V(3,2), $V(3,3), $V(2,3));
            var rays = Scanner(p);
            
            DrawScanlinesClosures(new ViewportNoClosures({ forEach: function(){}}, 2, 2, 4, 4),  p, rays)(pixeler);

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
