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
	it("should be able to partition a simple square", function() {
        bsptree = bsp($P($V(0,0), $V(1,0), $V(1,1), $V(0,1)).edges)

        expect(bsptree.coincident).toEqual([$L($V(0,1), $V(0,0))]);
	})

	it("should be able to partition a more complex (non-convex) polygon", function() {

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
        expect(bsptree.coincident).toEqual([$L(v9, v0)]);
        expect(bsptree.positive).toEqual(null);
        //expect(bsptree.negative).toBe(null);
        // inspect negative BSP node
        bspnode = bsptree.negative;
        // should be 2nd edge
        //expect(bspnode.coincident).toEqual([$L(v0, v1)]);
        // everything is on the negative side (nothing on the positive side)
        //expect(bspnode.positive).toBe(null);

        // inspect the next negative node,
        //bsp_node = bsptree.negative.negative;
        // should be 3rd edge
        //expect(bsptree.negative.negative.coincident).toEqual([$L(v1, v2)])
        //expect(bsptree.negative.negative.negative).toEqual("negative")
        //expect(bsptree.negative.negative.positive).toEqual("positive")

        // inspect the positive side
        //bsp_node = bsptree.negative.positive;
	})
})