describe("Timer utilities", function() {
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
