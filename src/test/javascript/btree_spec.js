describe("Our binary space partitioning (BSP) library", function() {
	it("should be able to partition a simple square", function() {
        bsptree = bsp(get_edges([[0,0],[1,0],[1,1],[0,1]]))

        expect(bsptree.coincident).toEqual([[[0,0],[1,0]]]);
	})

	it("should be able to partition a more complex (non-convex) polygon", function() {

        var v0 = [0,0]
        var v1 = [2,0]
        var v2 = [2,2]
        var v3 = [1,2]
        var v4 = [1,5]
        var v5 = [5,5]
        var v6 = [5,4]
        var v7 = [7,4]
        var v8 = [7,6]
        var v9 = [0,6]

	    var e90 = [v9, v0]
	    var e01 = [v0, v1]
	    var e12 = [v1, v2]
	    var e23 = [v2, v3]
	    var e34 = [v3, v4]
	    var e45 = [v4, v5]
	    var e56 = [v5, v6]
	    var e67 = [v6, v7]
	    var e78 = [v7, v8]
	    var e89 = [v8, v9]

        var bsp_node;

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

        bsptree = bsp([e90, e01, e12, e23, e34, e45, e56, e67, e78, e89])

        // partition on the first edge
        expect(bsptree.coincident).toEqual([e90]);
        // inspect negative BSP node
        bsp_node = bsptree.negative;
        // should be 2nd edge
        expect(bspnode.coincident).toEqual([e01]); expect()
        // everything is on the negative side (nothing on the positive side)
        expect(bsptree.positive).toBe(null);

        // inspect the next negative node,
        bsp_node = bsptree.negative.negative;
        // should be 3rd edge
        expect(bsptree.negative.negative.coincident).toEqual([e12])
        expect(bsptree.negative.negative.negative).toEqual("negative")
        expect(bsptree.negative.negative.positive).toEqual("positive")

        // inspect the positive side
        bsp_node = bsptree.negative.positive;
	})
})