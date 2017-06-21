function polToCart(dir, dist) {
  dir = degToRad(dir);
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
  size = size * size;
  var x = nodea.x - nodeb.x;
  var y = nodea.y - nodeb.y;
  return x*x + y*y <= size + buffer * buffer;
}

function radToDeg(rad) {
  return rad * 57.2958;
}

function degToRad(deg) {
  return deg * 0.0174533;
}