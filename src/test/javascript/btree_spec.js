describe("Basic polygon library", function() {
    it("should be possible to construct a poly using varargs constructor", function () {
        expect($P($V(0,0), $V(1,0), $V(2,2)).vertices.length).toBe(3);

        edges = $P($V(0,0), $V(1,0), $V(2,2)).edges

        expect($P($V(0,0), $V(1,0), $V(2,2)).edges).toEqual([
            $L($V(2,2), $V(0,0)),
            $L($V(0,0), $V(1,0)),
            $L($V(1,0), $V(2,2)),
        ])
    })
})
describe("Our binary space partitioning (BSP) library", function() {
	it("should be able to create a BSP from a simple square", function() {
        bsptree = bsp($P($V(0,0), $V(1,0), $V(1,1), $V(0,1)).edges)

        expect(bsptree.coincident).toEqual([$L($V(0,1), $V(0,0))]);
	})

	it("should be able to create a BSP from a more complex (non-convex) polygon", function() {

        var v0 = $V(0,0)
        var v1 = $V(2,0)
        var v2 = $V(2,2)
        var v3 = $V(1,2)
        var v4 = $V(1,5)
        var v5 = $V(5,5)
        var v6 = $V(5,4)
        var v7 = $V(7,4)
        var v8 = $V(7,6)
        var v9 = $V(0,6)

        var Pp = $P(v0, v1, v2, v3, v4, v5, v6, v7, v8, v9)

        var bspnode;

        /**************************************************************************************************************
         *    v9-----------v8
         *     |           |
         *     |           |
         *     |  v4----v5 |
         *     |  |     |  |
         *     |  |    v6--v7
         *     | v3-v2
         *     |   |
         *    v0--v1
         *
         *
         *
         *
         *
         *
         *
         *
         **************************************************************************************************************/

        bsptree = bsp(Pp.edges)
        // partition on the first edge
        expect(bsptree.line).toEqual($L(v9, v0));

            expect(bsptree.positive).toEqual(null);
            expect(bsptree.negative.line).toEqual($L(v0, v1))
                expect(bsptree.negative.positive).toBe(null)
                expect(bsptree.negative.negative.line).toEqual($L(v1,v2))
                    expect(bsptree.negative.negative.positive.line).toEqual($L($V(2,5), v5))
                        expect(bsptree.negative.negative.positive.positive.line).toEqual($L(v5, v6))
                            expect(bsptree.negative.negative.positive.positive.positive).toBe(null)
                            expect(bsptree.negative.negative.positive.positive.negative.line).toEqual($L(v6,v7))
                                expect(bsptree.negative.negative.positive.positive.negative.positive).toBe(null)
                                expect(bsptree.negative.negative.positive.positive.negative.negative.line).toEqual($L(v7, $V(7,5)))
                                    expect(bsptree.negative.negative.positive.positive.negative.negative.negative).toBe(null)
                                    expect(bsptree.negative.negative.positive.positive.negative.negative.positive).toBe(null)
                        expect(bsptree.negative.negative.positive.negative.line).toEqual($L($V(7,5), v8))
                            expect(bsptree.negative.negative.positive.negative.positive).toBe(null)
                            expect(bsptree.negative.negative.positive.negative.negative.line).toEqual($L(v8, $V(2,6)))
                                expect(bsptree.negative.negative.positive.negative.negative.positive).toBe(null)
                                expect(bsptree.negative.negative.positive.negative.negative.negative).toBe(null)
                    expect(bsptree.negative.negative.negative.line).toEqual($L(v2, v3))
                        expect(bsptree.negative.negative.negative.positive.line).toEqual($L(v3, v4))
                            expect(bsptree.negative.negative.negative.positive.positive.line).toEqual($L(v4, $V(2,5)))
                                expect(bsptree.negative.negative.negative.positive.positive.positive).toBe(null)
                                expect(bsptree.negative.negative.negative.positive.positive.negative.line).toEqual($L($V(2,6), $V(1,6)))
                                    expect(bsptree.negative.negative.negative.positive.positive.negative.positive).toBe(null)
                                    expect(bsptree.negative.negative.negative.positive.positive.negative.negative).toBe(null)
                            expect(bsptree.negative.negative.negative.positive.negative.line).toEqual($L($V(1,6), v9))
                                expect(bsptree.negative.negative.negative.positive.negative.positive).toBe(null);
                                expect(bsptree.negative.negative.negative.positive.negative.negative).toBe(null);
                        expect(bsptree.negative.negative.negative.negative).toBe(null)


	})
})