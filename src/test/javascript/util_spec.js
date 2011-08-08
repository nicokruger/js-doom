describe("Misc. Utitilies", function() {

	it("should be able to take two sets x and y and combine to a single set of f(x,y)",function() {
		expect(zip([0,1,2,3],[4,5,6,7], function(x,y) {return x+y;})).toEqual([4,6,8,10]);
	})
	it("should be possible to create an empty (intiailised) array of arb size",function() {
		expect(empty_array(5)).toEqual([0,0,0,0,0]);
	});


});
