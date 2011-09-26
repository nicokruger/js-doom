describe("Rendering utilities", function() {

    it("any cartesian coordinate system forms a rectangle in 'screen space' from (0,0) to (width,height) of the coordinate system", function() {
        var c2s = new Cartesian2Screen(-100,-100,100,100); // effectively forms a "screen" from (0,0) to (width,height)
        
        expect(c2s.width()).toBe(200);
        expect(c2s.height()).toBe(200);
    });
    
    it("should be possible to convert from cartesian to screen coordinates", function() {
        var c2s = new Cartesian2Screen(-100,-100,100,100);
        
        expect(c2s.cartesian2screenx(-100)).toBe(0);
        expect(c2s.cartesian2screenx(0)).toBe(100);
        expect(c2s.cartesian2screenx(100)).toBe(200);
        expect(c2s.cartesian2screenx(50)).toBe(150);
        
        expect(c2s.cartesian2screeny(-100)).toBe(200);
        expect(c2s.cartesian2screeny(0)).toBe(100);
        expect(c2s.cartesian2screeny(100)).toBe(0);
    });
    
});
