describe("Basic polygon/BSP library", function() {
    it("should be possible to construct a poly using varargs constructor", function () {
        expect($P($V(0,0), $V(1,0), $V(2,2)).vertices.length).toBe(3);

        edges = $P($V(0,0), $V(1,0), $V(2,2)).edges

        expect($P($V(0,0), $V(1,0), $V(2,2)).edges).toEqual([
            $L($V(2,2), $V(0,0)),
            $L($V(0,0), $V(1,0)),
            $L($V(1,0), $V(2,2)),
        ])
    })

	it("should be able to create a BSP from a simple square", function() {
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

    it("should be able to partition a line into segments according to a BSP tree of a simple square", function() {
        var square = $P($V(0,0), $V(10,0), $V(10,10), $V(0,10));
        var partitioned_line = square.partition($L($V(-55,5), $V(5,5)));

        expect(partitioned_line.neg).toEqual([$L($V(0,5), $V(5,5))]);

        partitioned_line = square.partition($L($V(-2,-2), $V(2,2)))
        expect(partitioned_line.neg).toEqual([$L($V(0,0), $V(2,2))])

    })

    it("should correctly partition a line that is co-incident to edges on the polygon (cosame)", function() {
        var square = $P($V(0,0), $V(10,0), $V(10,10), $V(0,10));
        var partitioned_line = square.partition($L($V(0,55), $V(0,-15)));

        expect(partitioned_line.cosame).toEqual([$L($V(0,10), $V(0,0))]);
    })

    it("should correctly partition a line that is co-incident to edges on the polygon (codiff)", function() {
        var square = $P($V(0,0), $V(10,0), $V(10,10), $V(0,10));
        var partitioned_line = square.partition($L($V(0,-15), $V(0,55)));

        expect(partitioned_line.codiff).toEqual([$L($V(0,10), $V(0,0))]);
    })

	it("should be able to create a BSP from a more complex (non-convex) polygon", function() {

        bsptree = this.Pp.bsp;

        // partition on the first edge
        expect(bsptree.line).toEqual($L(this.v9, this.v0));

            expect(bsptree.positive).toEqual(null);
            expect(bsptree.negative.line).toEqual($L(this.v0, this.v1))
                expect(bsptree.negative.positive).toBe(null)
                expect(bsptree.negative.negative.line).toEqual($L(this.v1,this.v2))
                    expect(bsptree.negative.negative.positive.line).toEqual($L($V(2,5), this.v5))
                        expect(bsptree.negative.negative.positive.positive.line).toEqual($L(this.v5, this.v6))
                            expect(bsptree.negative.negative.positive.positive.positive).toBe(null)
                            expect(bsptree.negative.negative.positive.positive.negative.line).toEqual($L(this.v6,this.v7))
                                expect(bsptree.negative.negative.positive.positive.negative.positive).toBe(null)
                                expect(bsptree.negative.negative.positive.positive.negative.negative.line).toEqual($L(this.v7, $V(7,5)))
                                    expect(bsptree.negative.negative.positive.positive.negative.negative.negative).toBe(null)
                                    expect(bsptree.negative.negative.positive.positive.negative.negative.positive).toBe(null)
                        expect(bsptree.negative.negative.positive.negative.line).toEqual($L($V(7,5), this.v8))
                            expect(bsptree.negative.negative.positive.negative.positive).toBe(null)
                            expect(bsptree.negative.negative.positive.negative.negative.line).toEqual($L(this.v8, $V(2,6)))
                                expect(bsptree.negative.negative.positive.negative.negative.positive).toBe(null)
                                expect(bsptree.negative.negative.positive.negative.negative.negative).toBe(null)
                    expect(bsptree.negative.negative.negative.line).toEqual($L(this.v2, this.v3))
                        expect(bsptree.negative.negative.negative.positive.line).toEqual($L(this.v3, this.v4))
                            expect(bsptree.negative.negative.negative.positive.positive.line).toEqual($L(this.v4, $V(2,5)))
                                expect(bsptree.negative.negative.negative.positive.positive.positive).toBe(null)
                                expect(bsptree.negative.negative.negative.positive.positive.negative.line).toEqual($L($V(2,6), $V(1,6)))
                                    expect(bsptree.negative.negative.negative.positive.positive.negative.positive).toBe(null)
                                    expect(bsptree.negative.negative.negative.positive.positive.negative.negative).toBe(null)
                            expect(bsptree.negative.negative.negative.positive.negative.line).toEqual($L($V(1,6), this.v9))
                                expect(bsptree.negative.negative.negative.positive.negative.positive).toBe(null);
                                expect(bsptree.negative.negative.negative.positive.negative.negative).toBe(null);
                        expect(bsptree.negative.negative.negative.negative).toBe(null)


	})


    it("should be able to correctly parition a line over a more complex BSP tree from a more complex (non-convex) polygon", function() {

        var L = $L($V(-3,-3), $V(6,6))
        var partition = this.Pp.partition(L);

        expect(partition.pos).toEqual([$L($V(-3,-3), $V(0,0)), $L($V(2,2), $V(5,5))])
        expect(partition.neg).toEqual([$L($V(5,5), $V(6,6)), $L($V(0,0), $V(2,2))])
        expect(partition.codiff).toEqual([])
        expect(partition.cosame).toEqual([])

    })

    it("should be possible to determine the intersection between two polygons", function() {
        var poly1 = $P($V(0,0), $V(10,0), $V(10,10), $V(0,10));
        var poly2 = $P($V(2,2), $V(5,2), $V(5,5), $V(2,5));

        var I = poly1.intersection(poly2);

        expect(I.edges).toEqual([$L($V(2,5), $V(2,2)),
            $L($V(2,2), $V(5,2)),
            $L($V(5,2), $V(5,5)),
            $L($V(5,5), $V(2,5))]);


        poly2 = $P($V(5,5), $V(15,5), $V(15,15), $V(5,15))
        I = poly1.intersection(poly2);
        expect(I.edges).toEqual([]);


        var partition_node = poly1.partition($L($V(2,5), $V(2,2)));
        expect(partition_node.neg).toEqual([$L($V(2,5), $V(2,2))]);
        partition_node = poly1.partition($L($V(2,2), $V(5,2)));
        expect(partition_node.neg).toEqual([$L($V(2,2), $V(5,2))]);
        partition_node = poly1.partition($L($V(5,2), $V(5,5)));
        expect(partition_node.neg).toEqual([$L($V(5,2), $V(5,5))]);
        partition_node = poly1.partition($L($V(5,5), $V(2,5)));
        expect(partition_node.neg).toEqual([$L($V(5,5), $V(2,5))]);

        //partition_node = poly2.partition($L($V(0,10), $V(0,0)));
        //expect(partition_node.neg).toEqual([]);
        //partition_node = poly2.partition($L($V(0,0), $V(10,0)));
        //expect(partition_node.neg).toEqual([]);
        //partition_node = poly2.partition($L($V(10,0), $V(10,10)));
        //expect(partition_node.neg).toEqual([]);
        //partition_node = poly2.partition($L($V(10,10), $V(0,10)));
        //expect(partition_node.neg).toEqual([]);
    })
    beforeEach(function() {
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

        this.v0 = $V(0,0)
        this.v1 = $V(2,0)
        this.v2 = $V(2,2)
        this.v3 = $V(1,2)
        this.v4 = $V(1,5)
        this.v5 = $V(5,5)
        this.v6 = $V(5,4)
        this.v7 = $V(7,4)
        this.v8 = $V(7,6)
        this.v9 = $V(0,6)

        this.Pp = $P(this.v0, this.v1, this.v2, this.v3, this.v4, this.v5, this.v6, this.v7, this.v8, this.v9)




    })
})