Topdown Doom
============

Basically, a polygon library (2d vectors, lines, polygons, and a BSP-tree implementation which gives partitioning and polygon intersecting). A Quad Tree implementation in JavaScript is also included.

Three rendering methods:

* Rendering polygons using HTML 5 2D canvas, using the canvas fills to fill the polygons.

* Rendering polygons using a custom built 2D rasterizer. This was fun, but frustrtating to do. It works, but I doubt we'll be using it much in the future - it's just too slow.

* A webGL renderer, which uses the renderer in #2 to fill a texture, then creates a single orthographically-projected quad using the generated texture. Again, was a nice experiment but I doubt it'll have much longevity. Also, BROKEN at the moment.

Included are the 30 maps from Doom II, generated using a python script which converted the MAP files in the original doom2.wad into the JSON objects. The JSON objects are completely self-sustained - the textures are base64 encoded inside the map files themselves. Thus, there is a lot of duplication.

There is a small console, a bunch of buttons to move the viewport around, a renderer switcher, and a map switcher.


**Press the "D" button to get everything to start drawing.**

What we still need:
 
* Issues
  * Bug in the BSP tree partitioning, it misses the top-most line of a triangle like ([0,0],[10,0],[10,10]) - it will miss the edge case line [10,10] -> [10,10] which is a pixel that should be part of the triangle.
  * A bug in ViewportCanvas where the textures are not correctly aligned (they move with the viewport, not staying stationary. The behaviour of Viewport2D is correct, although SLOW)

* Features for the future
  * Proper interaction with the viewport would be AWESOME. For eg. using the mouse to drag the screen around. Pressing the current buttons is annoying.
  * Animated textures (shouldn't be too difficult)
  * Making an actual game
    * Player movement
    * Collision detection
    * etc.

Running
=======

Two ways to run it, either using maven, or using rake.

Using maven:

    mvn jasmine:bdd

This runs a server, exposing the unit tests on port 8234. For unit tests, go to http://localhost:8234 . The actual game is available at http://localhost:8234/src/main/javascript .

**Press the "D" button to get everything to start drawing.**

Using rake:

    rake jasmine:headless

This runs the unit tests (very quickly), on the command line. Very handy when developing. You may need the jasmine RubyGem and a Jasmine rake plugin. Should be available on Google.



Why
===
It's been fun hacking on this, learnt a lot in the process. I reckon Javascript is a solid technology with a lot of potential in game development. Its only going to become faster and run on more devices, so lets just play with it!

And what a better way to play than to do a doom-tribute :)



