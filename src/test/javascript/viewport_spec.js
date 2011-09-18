describe("The viewport", function() {
    it("can draw a polygon", function () {
        var p = $P($V(0,0), $V(1,0), $V(1,1), $V(0,1));

        var viewport = new ViewportNoClosures([{poly:p}], -2, -2, 2, 2);
        
        var data = {
                width: 5,
                data: [
                    0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0, 0,0,0,0,
                    0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0, 0,0,0,0,
                    0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0, 0,0,0,0,
                    0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0, 0,0,0,0,
                    0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0, 0,0,0,0,
                ]
        };
        
        var tex1= { width: 2, height: 2,
                            data: [ 1,2,3,4,     5,6,7,8,
                              9,10,11,12,     13,14,15.,16] };
        
        var expected = [
            0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0, 0,0,0,0,
            0,0,0,0,  0,0,0,0,  1,2,3,4,  5,6,7,8, 0,0,0,0,
            0,0,0,0,  0,0,0,0,  9,10,11,12,  13,14,15.,16,  0,0,0,0,
            0,0,0,0,  0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0, 
            0,0,0,0,  0,0,0,0,  0,0,0,0, 0,0,0,0, 0,0,0,0
        ];
                              
        viewport.singleBitmap([tex1],data);
        
        console.log(JSON.stringify(data.data, null, 4));
        console.log(JSON.stringify(expected, null, 4));
        expect(data.data).toEqual(expected);
    });
    it("can draw a polygon2", function() {
        var p = $P($V(-5,0), $V(5,0), $V(5,5), $V(4,5), $V(4,2), $V(-5,2));
        var viewport = new ViewportNoClosures([{poly:p}], 0, 1, 2, 3);
        var data = {
            width: 3,
            data: [
                0,0,0,0, 0,0,0,0, 0,0,0,0,
                0,0,0,0, 0,0,0,0, 0,0,0,0,
                0,0,0,0, 0,0,0,0, 0,0,0,0,
            ]
        }
        
        var tex1 = { width: 2, height: 2,
                data: [ 1,2,3,4, 5,6,7,8,
                    9,10,11,12, 13,14,15,16]
        }
        
        viewport.singleBitmap([tex1], data);
        
        expect(data.data).toEqual([
                0,0,0,0, 0,0,0,0, 0,0,0,0,
                0,0,0,0, 0,0,0,0, 0,0,0,0,
                1,2,3,4, 5,6,7,8, 1,2,3,4
        ]);
        
    });
    it("should texture a polygon", function() {
       var p1 = $P($V(0,0), $V(1,0), $V(1,1), $V(0,1));
       var viewport = new ViewportNoClosures([{poly:p1}], 0, 0, 1, 1);
       
       var data = {
               width: 2,
               data: [
                   0,0,0,0,  0,0,0,0,
                   0,0,0,0,  0,0,0,0,
               ]
       };
       var tex1 = { width: 2, height: 2,
                           data: [ 1,2,3,4,     5,6,7,8,
                             9,10,11,12,     13,14,15.,16] };
       
       viewport.singleBitmap([tex1], data);
       
       expect(data.data).toEqual([
           1,2,3,4,  5,6,7,8,  
           9,10,11,12,  13,14,15,16  ]);
   });
       
      it("should repeat the (horizontally) texture in the polygon, with all textures aligned to (0,0) in the world", function () {
          var p1 = $P($V(-2,0), $V(1,0), $V(1,1), $V(-2,1));
          var viewport = new ViewportNoClosures([{poly:p1}], -2, 0, 1, 1);
          
          var data = {
                  width: 4,
                  data: [
                      0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0,
                      0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0
                  ]
          };
          var tex1 = { width: 2, height: 2,
                              data: [ 1,2,3,4,     5,6,7,8,
                                9,10,11,12,     13,14,15.,16] };
          
          viewport.singleBitmap([tex1], data);
          
          expect(data.data).toEqual([
              1,2,3,4,  5,6,7,8,  1,2,3,4,     5,6,7,8,
              9,10,11,12,  13,14,15,16,  9,10,11,12,  13,14,15,16]);
                                
      });
      it("should repeat the texture (vertically) in the polygon, with all textures aligned to (0,0) in the world", function () {
          var p1 = $P($V(0,0), $V(1,0), $V(1,3), $V(0,3));
          var viewport = new ViewportNoClosures([{poly:p1}], 0, 0, 1, 3);
          
          var data = {
                  width: 2,
                  data: [
                      0,0,0,0,     0,0,0,0,
                      0,0,0,0,     0,0,0,0,
                      0,0,0,0,     0,0,0,0,
                      0,0,0,0,     0,0,0,0
                  ]
          };
          var tex1 = { width: 2, height: 2,
                              data: [ 1,2,3,4,     5,6,7,8,
                                9,10,11,12,     13,14,15.,16] };
          
          viewport.singleBitmap([tex1], data);
          
          expect(data.data).toEqual([
                      1,2,3,4,     5,6,7,8,
                      9,10,11,12,     13,14,15.,16,
                      1,2,3,4,     5,6,7,8,
                      9,10,11,12,     13,14,15.,16
          ]);
                                
      });
 
    
    
    it("can draw more than one polygon", function() {
        var p1 = $P($V(0,0), $V(1,0), $V(1,1), $V(0,1));
        var p2 = $P($V(2,0), $V(3,0), $V(3,1), $V(2,1));

        var viewport = new ViewportNoClosures([{poly:p1},{poly:p2}], 0, 0, 4, 1);
        
        var data = {
                width: 5,
                data: [
                    0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0, 0,0,0,0,
                    0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0, 0,0,0,0,
                ]
        };
        
        var tex1 = { width: 2, height: 2,
                            data: [ 255,255,255,255,     128,128,128,128,
                              255,255,255,255,     128,128,128.,128] };
        var tex2 = { width: 2, height: 2,
                            data: [ 200,200,200,200,     100,100,100,100,
                              200,200,200,200,     100,100,100.,100] };
                              
        viewport.singleBitmap([tex1, tex2], data);
        
        expect(data.data).toEqual([
            255,255,255,255,  128,128,128,128,  200,200,200,200,     100,100,100,100, 0,0,0,0,
            255,255,255,255,  128,128,128,128,  200,200,200,200,     100,100,100,100, 0,0,0,0
            //0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0
        ]);
    });
});