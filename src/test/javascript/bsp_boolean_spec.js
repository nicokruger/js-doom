describe("BSP trees", function() {

    describe("Using BSP trees for boolean operations on polygons", function () {
        it("should be possible to determine the intersection between two polygons", function() {
            var poly1 = $P($V(1.0, 1.0), $V(2.0, 1.0), $V(2.0, 2.0), $V(1.0, 2.0));
            var poly2 = $P($V(0.5, 0.5), $V(1.5, 0.5), $V(1.5, 1.5), $V(0.5, 1.5));

            var I = poly1.intersection(poly2);

            expect(I.edges).toEqual([
                $L($V(1.5, 1.0), $V(1.5, 1.5)),
                $L($V(1.5, 1.5), $V(1.0, 1.5)),
                $L($V(1.0, 1.5), $V(1.0, 1.0)),
                $L($V(1.0, 1.0), $V(1.5,1.0)),
                ]);
            expect(I.area()).toBe(0.25);

            poly2 = $P($V(1.5,0.5), $V(1.5,1.5), $V(0.5,1.5), $V(0.5,0.5))
            I = poly1.intersection(poly2);
            expect(I.edges).toEqual([
                $L($V(1.5,1.0), $V(1.5,1.5)),
                $L($V(1.5,1.5), $V(1.0,1.5)),
                $L($V(1.0,1.5), $V(1.0,1.0)),
                $L($V(1.0,1.0), $V(1.5,1.0))
            ]);
            expect(I.area()).toBe(0.25);

            poly2 = $P($V(1.5,1.5), $V(2.5,1.5), $V(2.5,2.5), $V(1.5,2.5))
            I = poly1.intersection(poly2);
            expect(I.edges).toEqual([
                $L($V(1.5,2.0), $V(1.5,1.5)),
                $L($V(1.5,1.5), $V(2.0,1.5)),
                $L($V(2.0,1.5), $V(2.0,2.0)),
                $L($V(2.0,2.0), $V(1.5,2.0))
            ]);
        })

        it("should be able to detertmine the intersection even if an intersection point is on a vertex", function () {

            var P1 = $P($V(100,200), $V(200,200), $V(200,300), $V(100,300));

            var P2 = circle_to_poly([100.0, 229.0], 120.0, 10);
            var I1 = P1.intersection(P2);
            expect(Math.round(I1.area(),0)).toBe(9985);

            P2 = circle_to_poly([100.0, 229.0], 120.0, 16);
            I1 = P2.intersection(P1);
            expect(Math.round(I1.area(),0)).toBe(9974);

            var pn;
            P2 = circle_to_poly([100.0, 229.0], 120.0, 25);
            I1 = P2.intersection(P1);
            pn = P2.partition($L($V(200,200), $V(200,300))); // CHANGE THIS TO 301 and it works!!!
            expect(pn.neg).toNotEqual([]);
            expect(Math.round(I1.area(),0)).toBe(9987);

            P2 = circle_to_poly([100.0, 229.0], 120.0, 26);
            I1 = P2.intersection(P1);
            pn = P2.partition($L($V(200,200), $V(200,300)));
            expect(pn.neg).toNotEqual([]);
            expect(Math.round(I1.area(),0)).toBe(9987);

        })
    });

})