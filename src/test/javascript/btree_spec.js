
describe("BSP trees", function() {

    describe("Simple Square polygons", function () {
        it("creates a BSP for a simple square", function() {
            
            var v1 = $V(0,0);
            var v2 = $V(1,0);
            var v3 = $V(1,1);
            var v4 = $V(0,1);
            var p = $P(v1, v2, v3, v4);
            
            bsptree = renderlib.bsp.create(p.edges, $L(v4,v1));

            expect(bsptree.line).toEqual($L($V(0,1), $V(0,0)));
                expect(bsptree.positive).toBe(null);
                expect(bsptree.negative.line).toEqual($L($V(0,0), $V(1,0)))
                    expect(bsptree.negative.positive).toBe(null);
                    expect(bsptree.negative.negative.line).toEqual($L($V(1,0), $V(1,1)))
                        expect(bsptree.negative.negative.positive).toBe(null);
                        expect(bsptree.negative.negative.negative.line).toEqual($L($V(1,1), $V(0,1)))
                            expect(bsptree.negative.negative.negative.positive).toBe(null);
                            expect(bsptree.negative.negative.negative.negative).toBe(null);
        })
        it("can calculate the area of a square", function() {
            var poly = $P($V(0,0), $V(1,0), $V(1,1), $V(0,1));
            expect(poly.area()).toBe(1.0);

            expect($P($V(0,1), $V(0,0), $V(1,0), $V(1,1)).area()).toBe(1.0);
            expect($P($V(0,0), $V(1,0), $V(1,1), $V(0,1)).area()).toBe(1.0);
            expect($P($V(1,0), $V(1,1), $V(0,1), $V(0,0)).area()).toBe(1.0);
            expect($P($V(1,1), $V(0,1), $V(0,0), $V(1,0)).area()).toBe(1.0);

        })
    });
    
    describe("SImple Square Polygons (Clockwise)", function() {
        it("creates a BSP for a simple square", function() {
            var v1 = $V(0,0);
            var v2 = $V(1,0);
            var v3 = $V(1,1);
            var v4 = $V(0,1);
            var p = $P(v1, v2, v3, v4);
            
            bsptree = renderlib.bsp_cl.create(p.edges, $L(v1, v4))

            expect(bsptree.line).toEqual($L($V(0,0), $V(0,1)));
                expect(bsptree.positive).toBe(null);
                expect(bsptree.negative.line).toEqual($L($V(0,0), $V(1,0)))
                    expect(bsptree.negative.positive).toBe(null);
                    expect(bsptree.negative.negative.line).toEqual($L($V(1,0), $V(1,1)))
                        expect(bsptree.negative.negative.positive).toBe(null);
                        expect(bsptree.negative.negative.negative.line).toEqual($L($V(1,1), $V(0,1)))
                            expect(bsptree.negative.negative.negative.positive).toBe(null);
                            expect(bsptree.negative.negative.negative.negative).toBe(null);
        })
    });


    it("wraps around a set of vertices so that the resulting polygon is counter-clockwise", function() {
        var e = $P.order_edges([$L($V(0,0), $V(1,0)),
            $L($V(0,1), $V(0,0)),
            $L($V(1,1), $V(0,1)),
            $L($V(1,0), $V(1,1))]);

        expect(e).toEqual([$L($V(0,0), $V(1,0)),
            $L($V(1,0), $V(1,1)),
            $L($V(1,1), $V(0,1)),
            $L($V(0,1), $V(0,0))])

        var ee = $P.order_edges([
            $L($V(200, 290), $V(197, 299)),
            $L($V(197, 299),$V(196, 300)),
            $L($V(100, 300), $V(100, 200)),
            $L($V(100, 200),$V(200, 200)),
            $L($V(200, 200),$V(200, 290))
        ]);

        expect(ee.length).toBe(5);

    });
})
