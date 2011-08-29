
describe("BSP trees", function() {

    describe("Simple Square polygons", function () {
        it("creates a BSP for a simple square", function() {
            bsptree = bsp($P($V(0,0), $V(1,0), $V(1,1), $V(0,1)).edges)

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


    it("wraps around a set of vertices so that the resulting polygon is counter-clockwise", function() {
        var e = order_edges([$L($V(0,0), $V(1,0)),
            $L($V(0,1), $V(0,0)),
            $L($V(1,1), $V(0,1)),
            $L($V(1,0), $V(1,1))]);

        expect(e).toEqual([$L($V(0,0), $V(1,0)),
            $L($V(1,0), $V(1,1)),
            $L($V(1,1), $V(0,1)),
            $L($V(0,1), $V(0,0))])

        var ee = order_edges([
            $L($V(200, 290), $V(197, 299)),
            $L($V(197, 299),$V(196, 300)),
            $L($V(100, 300), $V(100, 200)),
            $L($V(100, 200),$V(200, 200)),
            $L($V(200, 200),$V(200, 290))
        ]);

        expect(ee.length).toBe(5);

    });
})
