describe("Quad tree", function () {
    it("can place an object, represented by a point into the correct quad", function () {
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

    it("can place an object, represented by a polygon into the correct quad", function () {
        var q = new Quad(50,50);
        var p1 = $P($V(0,0), $V(49,0),$V(49,49),$V(0,49));
        var p2 = $P($V(51,0), $V(100,0),$V(100,49),$V(51,49));
        var p3 = $P($V(0,51), $V(49,51),$V(49,100),$V(0,100));
        var p4 = $P($V(51,51), $V(100,51),$V(100,100),$V(51,51));
        // edge case
        var p5 = $P($V(49,49), $V(51,49), $V(51,51), $V(49,51));

        q.add(PolyPlacer(p1));
        q.add(PolyPlacer(p2));
        q.add(PolyPlacer(p3));
        q.add(PolyPlacer(p4));

        expect(q.bl.length).toBe(1); expect(q.bl[0]).toBe(p1);
        expect(q.br.length).toBe(1); expect(q.br[0]).toBe(p2);
        expect(q.tl.length).toBe(1); expect(q.tl[0]).toBe(p3);
        expect(q.tr.length).toBe(1); expect(q.tr[0]).toBe(p4);

        q.add(PolyPlacer(p5));
        // test the edge case
        expect(q.bl[1]).toBe(p5);
        expect(q.br[1]).toBe(p5);
        expect(q.tl[1]).toBe(p5);
        expect(q.tr[1]).toBe(p5);
    });

    it("can create a recursive quadtree by combining quads", function () {
        var tl = new Quad(25,75); var tr = new Quad(75,75);
        var bl = new Quad(25,25); var br = new Quad(75,25);

        spyOn(bl, "add"); spyOn(br, "add"); spyOn(tr, "add"); spyOn(tl, "add");

        var qt = new QuadTree(50, 50, bl, br, tr, tl);

        qt.add(PointPlacer($V(10,10)));
        expect(bl.add).toHaveBeenCalled();
        qt.add(PointPlacer($V(60,60)));
        expect(tr.add).toHaveBeenCalled();
        qt.add(PointPlacer($V(60,10)));
        expect(br.add).toHaveBeenCalled();
        qt.add(PointPlacer($V(10,60)));
        expect(tl.add).toHaveBeenCalled();

        // The edge case
        qt.add(PointPlacer($V(50,50)));
        expect(bl.add).toHaveBeenCalled();
        expect(br.add).toHaveBeenCalled();
        expect(tr.add).toHaveBeenCalled();
        expect(tl.add).toHaveBeenCalled();

    });

    it("can determine the relative positioning of a point to a square", function () {
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

    it("can retrieve the objects in a quad for a given viewport", function() {
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

    it("can retrieve the objects in a quadtree for a given viewport", function () {
        var tl = new Quad(25,75); var tr = new Quad(75,75);
        var bl = new Quad(25,25); var br = new Quad(75,25);

        spyOn(bl, "forEach"); spyOn(br, "forEach"); spyOn(tr, "forEach"); spyOn(tl, "forEach");

        var qt = new QuadTree(50, 50, bl, br, tr, tl);
        qt.add(PointPlacer($V(10,10)));
        qt.add(PointPlacer($V(60,10)));
        qt.add(PointPlacer($V(10,60)));
        qt.add(PointPlacer($V(60,60)));

        var a = Square(0,0,10,10);

        qt.forEach(a, function (x) {} );

        expect(bl.forEach).toHaveBeenCalled();
    });

    it("can iterate through items which are in more than one quad", function () {
        var q = new Quad(50,50);
        q.add(PointPlacer($V(50,50)));

        var l = [];
        q.forEach(Square(49,49,51,51), function (x) {
          l.push(x);
        });

        expect(l.length).toBe(1);
    })

    it("can iterate through items which are in more than one quad", function () {
        var tl = new Quad(25,75); var tr = new Quad(75,75);
        var bl = new Quad(25,25); var br = new Quad(75,25);
        var qt = new QuadTree(50, 50, bl, br, tr, tl);
        qt.add(PointPlacer($V(50,50)));

        var l = [];
        qt.forEach(Square(49,49,51,51), function (x) {
          l.push(x);
        });
        expect(l.length).toBe(1);
    })

    it("can create a quad tree for given dimensions with all quads smaller than a specified size #2", function() {
        var qt = setupQuadTree(0,0,10,10,2.5,2.5);
        expect(qt.bl.x).toBe(2.5); expect(qt.bl.y).toBe(2.5);
        expect(qt.br.x).toBe(7.5); expect(qt.br.y).toBe(2.5);
        expect(qt.tr.x).toBe(7.5); expect(qt.tr.y).toBe(7.5);
        expect(qt.tl.x).toBe(2.5); expect(qt.tl.y).toBe(7.5);

        expect(qt.bl.bl.x).toBe(1.25); expect(qt.bl.bl.y).toBe(1.25);
        expect(qt.bl.br.x).toBe(3.75); expect(qt.bl.br.y).toBe(1.25);
        expect(qt.bl.tr.x).toBe(3.75); expect(qt.bl.tr.y).toBe(3.75);
        expect(qt.bl.tl.x).toBe(1.25); expect(qt.bl.tl.y).toBe(3.75);

    })

})