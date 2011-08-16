describe("Quad tree optimisation", function () {
    it("should be possible to place an object, represented by a point into the correct quad", function () {
        var q = new Quad(50,50);

        q.add(PointPlacer($V(10,10)));
        q.add(PointPlacer($V(60,10)));
        q.add(PointPlacer($V(10,60)));
        q.add(PointPlacer($V(60,60)));
        // the funny edge case
        q.add(PointPlacer($V(50,50)));

        expect(q.bl[0]).toEqual($V(10,10));
        expect(q.tr[0]).toEqual($V(60,60));
        expect(q.tl[0]).toEqual($V(10,60));
        expect(q.br[0]).toEqual($V(60,10));

        // test the edge case
        expect(q.bl[1]).toEqual($V(50,50));
        expect(q.tr[1]).toEqual($V(50,50));
        expect(q.tl[1]).toEqual($V(50,50));
        expect(q.br[1]).toEqual($V(50,50));
    });

    it("should be possible to create a recursive quadtree by combining quads", function () {
        var q1 = new Quad(25,75); var q2 = new Quad(75,75);
        var q3 = new Quad(25,25); var q4 = new Quad(75,25);

        spyOn(q1, "add"); spyOn(q2, "add"); spyOn(q3, "add"); spyOn(q4, "add");

        var qt = new QuadTree(50, 50, q1, q2, q3, q4);

        qt.add(PointPlacer($V(10,10)));
        expect(q3.add).toHaveBeenCalled();
        qt.add(PointPlacer($V(60,60)));
        expect(q2.add).toHaveBeenCalled();
        qt.add(PointPlacer($V(60,10)));
        expect(q4.add).toHaveBeenCalled();
        qt.add(PointPlacer($V(10,60)));
        expect(q1.add).toHaveBeenCalled();

        // The edge case
        qt.add(PointPlacer($V(50,50)));
        expect(q1.add).toHaveBeenCalled();
        expect(q2.add).toHaveBeenCalled();
        expect(q3.add).toHaveBeenCalled();
        expect(q4.add).toHaveBeenCalled();

    });

    it("should be able to determine the relative positioning of a point to a square", function () {
        var a = Square(0,0,100,100);
        var p = $V(50,50);
        var f = jasmine.createSpy();

        a.bottomLeft(p.x, p.y, f);
        a.bottomRight(p.x, p.y, f);
        a.topLeft(p.x, p.y, f);
        a.topRight(p.x, p.y, f);
        expect(f.callCount).toBe(4);

        a = Square(90,90,100,100);
        f = jasmine.createSpy();
        a.bottomLeft(p.x, p.y, f);
        a.bottomRight(p.x, p.y, f);
        a.topLeft(p.x, p.y, f);
        a.topRight(p.x, p.y, f);
        expect(f.callCount).toBe(1);
    });

    it("should be possible to retrieve the objects in a quad for a given viewport", function() {
        var a = Square(0,0,10,10);
        var p = $V(50,50);

        var q = new Quad(50,50);
        q.add(PointPlacer($V(10,10)));
        q.add(PointPlacer($V(20,20)));
        q.add(PointPlacer($V(100,100)));

        var l = [];
        q.forEach(a, function(x) {
            l.push(x);
        });

        expect(l.length).toBe(2);
    });

    it("should be possible to retrieve the objects in a quadtree for a given viewport", function () {
        var q1 = new Quad(25,75); var q2 = new Quad(75,75);
        var q3 = new Quad(25,25); var q4 = new Quad(75,25);

        spyOn(q1, "forEach"); spyOn(q2, "forEach"); spyOn(q3, "forEach"); spyOn(q4, "forEach");

        var qt = new QuadTree(50, 50, q1, q2, q3, q4);
        qt.add(PointPlacer($V(10,10)));
        qt.add(PointPlacer($V(60,10)));
        qt.add(PointPlacer($V(10,60)));
        qt.add(PointPlacer($V(60,60)));

        var a = Square(0,0,10,10);

        qt.forEach(a, function (x) {} );

        expect(q3.forEach).toHaveBeenCalled();
    });

    it("should not duplicate iterate through items which are in more than one quad", function () {
        var q = new Quad(50,50);
        q.add(PointPlacer($V(50,50)));

        var l = [];
        q.forEach(Square(49,49,51,51), function (x) {
          l.push(x);
        });

        expect(l.length).toBe(1);
    })

    it("should not duplicate iterate through items which are in more than one quadtree", function () {
        var q1 = new Quad(25,75); var q2 = new Quad(75,75);
        var q3 = new Quad(25,25); var q4 = new Quad(75,25);
        var qt = new QuadTree(50, 50, q1, q2, q3, q4);
        qt.add(PointPlacer($V(50,50)));

        var l = [];
        qt.forEach(Square(49,49,51,51), function (x) {
          l.push(x);
        });
        expect(l.length).toBe(1);
    })
})