describe('Simplistic 2D vector math',function(){

	it("must be possible to add 2 vectors", function() {
		expect(v2_add([10,10],[0.5,0.5])).toEqual([10.5,10.5]);
	});
	it("should be possible to subtract 2 vectors (even thought its clumsy :) )", function() {
		expect(v2_add([10,10], v2_neg([0.5,0.5]))).toEqual([9.5,9.5]);
	});
	
	it("shuld be possible to perform the dot product of 2 vectors", function() {
		expect(v2_dot([1,2],[3,-4])).toBe(-5)
	});
});
