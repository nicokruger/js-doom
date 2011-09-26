describe("Timer utilities", function() {
    it("should be posssible to keep a stack of timers", function () {
        var t = renderlib.util.Timer.start("test")
        expect(t[0]).toBe("test");
        t = renderlib.util.Timer.start("test2");
        expect(t[0]).toBe("test2");

        t = renderlib.util.Timer.end();
        expect(t[0]).toBe("test2");
        t = renderlib.util.Timer.end();
        expect(t[0]).toBe("test");
    });

    it("should be possible to use sub-timers to total the time taken in substeps of a timer, instead of timing on every execution of a step", function() {
        var t = renderlib.util.Timer.start("test");

        renderlib.util.Timer.substart("step1");
        renderlib.util.Timer.subend("step1");
        renderlib.util.Timer.substart("step2");
        renderlib.util.Timer.subend("step2");

        renderlib.util.Timer.substart("step1");
        renderlib.util.Timer.subend("step1");
        renderlib.util.Timer.substart("step2");
        renderlib.util.Timer.subend("step2");

        renderlib.util.Timer.substart("step2");
        renderlib.util.Timer.subend("step2");

        t = renderlib.util.Timer.end();
        expect(t[0]).toBe("test");
        expect(t[3]["step1"][1]).toBe(2);
        expect(t[3]["step2"][1]).toBe(3);
    });
});
