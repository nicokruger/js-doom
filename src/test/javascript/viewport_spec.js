describe("The viewport", function() {
    it("can draw a polygon", function () {
        var p = $P($V(0,0), $V(1,0), $V(1,1), $V(0,1));

        var viewport = new ViewportNoClosures([{poly:p}], -2, -2, 1, 1);
        
        var data = {
                width: 4,
                data: [
                    0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0,
                    0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0,
                    0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0,
                    0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0
                ]
        };
        
        viewport.singleBitmap(data);
        
        expect(data.data).toEqual([
            0,0,0,0,  0,0,0,0,  255,255,255,255,  255,255,255,255,
            0,0,0,0,  0,0,0,0,  255,255,255,255,  255,255,255,255,
            0,0,0,0,  0,0,0,0,  0,0,0,0, 0,0,0,0,
            0,0,0,0,  0,0,0,0,  0,0,0,0, 0,0,0,0,
        ]);
    });
    
    it("can draw more than one polygon", function() {
        var p1 = $P($V(0,0), $V(1,0), $V(1,1), $V(0,1));
        var p2 = $P($V(2,0), $V(3,0), $V(3,1), $V(2,1));

        var viewport = new ViewportNoClosures([{poly:p1},{poly:p2}], 0, 0, 3, 1);
        
        var data = {
                width: 4,
                data: [
                    0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0,
                    0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0
                ]
        };
        
        viewport.singleBitmap(data);
        
        expect(data.data).toEqual([
            255,255,255,255,  255,255,255,255,  255,255,255,255,  255,255,255,255,
            255,255,255,255,  255,255,255,255,  255,255,255,255,  255,255,255,255,
        ]);
    });
});