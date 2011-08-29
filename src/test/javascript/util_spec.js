describe("Misc. Utitilies", function() {

    it("should be able to take two sets x and y and combine to a single set of f(x,y)",function() {
        expect(zip([0,1,2,3],[4,5,6,7], function(x,y) {return x+y;})).toEqual([4,6,8,10]);
    })
    it("should be possible to create an empty (intiailised) array of arb size",function() {
        expect(empty_array(5)).toEqual([0,0,0,0,0]);
    });


    it("should be posssible to keep a stack of timers", function () {
        var t = Timer.start("test")
        expect(t[0]).toBe("test");
        t = Timer.start("test2");
        expect(t[0]).toBe("test2");

        t = Timer.end();
        expect(t[0]).toBe("test2");
        t = Timer.end();
        expect(t[0]).toBe("test");
    });

    it("should be possible to use sub-timers to total the time taken in substeps of a timer, instead of timing on every execution of a step", function() {
        var t = Timer.start("test");

        Timer.substart("step1");
        Timer.subend("step1");
        Timer.substart("step2");
        Timer.subend("step2");

        Timer.substart("step1");
        Timer.subend("step1");
        Timer.substart("step2");
        Timer.subend("step2");

        Timer.substart("step2");
        Timer.subend("step2");

        t = Timer.end();
        expect(t[0]).toBe("test");
        expect(t[3]["step1"][1]).toBe(2);
        expect(t[3]["step2"][1]).toBe(3);
    });
});
