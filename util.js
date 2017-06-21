function polToCart(dir, dist) {
  var x = dist*Math.cos(dir);
  var y = dist*Math.sin(dir);
  return {
    x: x, y: y
  }
}

function cartToPol(x, y) {
  var r = Math.sqrt(x*x + y*y);
  var theta = Math.atan2(y,x);
  return {
    dir: theta, dist: r
  }
}

function unit(x) {
  if ( x == 0 ) return 0;
  return x > 0 ? 1 : -1;
}
function distSq(a, b) {
  var x = a.x - b.x;
  var y = a.y - b.y;
  return x*x + y*y;
}

function dist(a, b) {
  return Math.sqrt(distSq(a,b));
}
/**
 * Does a collision against all the nodes.
 */
function collideAll(node, buffer) {
  if ( buffer == undefined ) buffer = 0;
  
  for ( i in nodes ) {
    testNode = nodes[i];
    if ( node == testNode ) continue; // Don't collide self
    if ( collide ( node, testNode, buffer ) ) {
      return true;
    }
  }
  return false;
}

function collide(nodea, nodeb, buffer) {
  if ( buffer == undefined ) buffer = 0;
  var size = nodea.size + nodeb.size;
  return distSq(nodea, nodeb) <= size * size + buffer * buffer;
}

function radToDeg(rad) {
  return rad * 57.2958;
}

function degToRad(deg) {
  return deg * 0.0174533;
}