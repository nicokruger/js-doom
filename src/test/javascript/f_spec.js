describe("Functional Tools", function() {
	it("should add terms of a list together",function() {
		expect(sum([0,1,2,3,4])).toBe(10);
	});
	it("should map a set of x with a function to set of f(x)",function() {
		expect(map([0,1,2,3], function(a) {return a+1;})).toEqual([1,2,3,4]);
	});
	it("should be able to take two sets x and y and combine to a single set of f(x,y)",function() {
		expect(zip([0,1,2,3],[4,5,6,7], function(x,y) {return x+y;})).toEqual([4,6,8,10]);
	})
	it("should be able to combine two objects",function() {
		expect(combine({a:{attr1:"value1"}},{a:{attr2:"value2"}})).toEqual({a: { attr1: "value1", attr2: "value2"}});
	});
	describe("Additinoal functional-like object and list tools", function() {
		it("should be possible iterate over an object in a functional way",function() {
			var total = 0;
			var f = { a:1,b:2,c:3 };
			f.each(function(key,val) { total += val });
			expect(total).toBe(6);
		});
		it("should be possible to iterate over the keys of an object in a sorted manner",function() {
			var f = {z:10,y:9,x:8};
			var l = [];
			f.eachSorted(function(key,val) { l.push(key) });
			expect(l).toEqual(["x","y","z"]);
		});
	});

});
