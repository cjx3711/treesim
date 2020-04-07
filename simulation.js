/**
 * File: simulation.js
 * All functions that handle the simulation, be it updating or logic will
 */

function updateNode ( node, delta ) {
  if ( !node.dead ) {
    // Update rate of usage
    node.energy -= delta * node.size * 0.04;
    if ( node.energy <= 0 ) {
      node.energy = 0;
    }
    
    node.water -= delta * node.size * 0.04;
    if ( node.water <= 0 ) {
      node.water = 0;
    }
    
    // Update production stats
    if ( node.type == 'leaf' ) {
      node.energy += delta * node.size * 0.3;
      if ( node.energy > node.size ) {
        node.energy = node.size;
      }
    }
    
    if ( node.type == 'root' ) {
      node.water += delta * node.size * 0.3;
      if ( node.water > node.size ) {
        node.water = node.size;
      }
    }
    
    // Grow
    var waterPerc = node.waterPerc();
    var energyPerc = node.energyPerc();
    if ( (waterPerc > 0.75 || energyPerc > 0.75) && (waterPerc + energyPerc) > 0.75 + 0.5 ) {
      if ( node.size < 25 ) node.size += 2 * delta;
      if ( node.size > 20 && waterPerc > 0.75 && energyPerc > 0.75 ) {
        node.spawn();
      }
    }
    if ( waterPerc < 0.25 || energyPerc < 0.25 ) {
      node.size -= 2 * delta;
      if ( node.size <= 5 ) {
        node.dead = true;
      }
    }
  } else {
    node.energy = 0;
    node.water = 0;
    node.opacity -= delta * 0.5;
    if ( node.opacity < 0 ) {
      node.opacity = 0;
    }
  }
  // Update visual display
  node.displayEnergy += (node.energy - node.displayEnergy) * delta * 5;
  node.displayWater += (node.water - node.displayWater) * delta * 5;
  node.displaySize += (node.size - node.displaySize) * delta;
  
  // Update movement
  node.vX += node.fX * delta / node.size;
  node.vY += node.fY * delta / node.size;

  node.x += node.vX * delta;
  node.y += node.vY * delta;

  node.fX = 0;
  node.fY = 0;
  
  // // // Friction
  // if ( Math.abs(node.vX) < 0.01 ) {
  //   node.vX = 0;
  // } else {
  //   node.vX -= (node.vX > 0 ? 1 : -1) * delta * 20;
  // }
  // if ( Math.abs(node.vY) < 0.01 ) {
  //   node.vY = 0;
  // } else {
  //   node.vY -= (node.vY > 0 ? 1 : -1) * delta * 20;
  // }

  node.fX -= node.vX * 10;
  node.fY -= node.vY * 10;
}

function spreadNode(node) {
  for ( var l = 0; l < node.links.length; l++ ) {
    link = node.links[l];
    if ( link == null ) continue;
    var thickness = Math.min(node.size, link.size);
    var desiredDistance = thickness * 5 + 10;
    var currentDist = dist(node, link);
    var distDelta = desiredDistance - currentDist;
    var pullPower = 50;
    var dir = cartToPol(link.x - node.x, link.y - node.y).dir;
    var f = polToCart(dir, distDelta * pullPower);
    // Move the links
    link.fX += f.x; // / node.size;
    link.fY += f.y; // / node.size;
  }
}

function spreadNonRelatedNodes(node1, node2) {
  var dX = node2.x - node1.x
  var dY = node2.y - node1.y
  var math = Math.pow(dX * dX + dY * dY, 1.5)
  if ( math > 1 ) {
    node1.fX -= dX / math * 500000
    node1.fY -= dY / math * 500000
  }
}

/**
 * Logic to decide where to send the energy
 */
function diffuseBlobs() {
  for ( i in nodes ) {
    node = nodes[i];
    if ( node.dead ) continue;
    // Skip the parent node
    for ( var l = 1; l < node.links.length; l++ ) { 
      link = node.links[l];

      if ( link.dead ) continue;
      /* Algo:
       * If one is much smaller than the other
       *  Send energy from bigger to smaller
       *  Either 25% of the sender's energy
       *  or 70% of the required energy whichever is lower
       * If the ratio of the energy difference is more than a threshold,
       *  Send energy.
       *  Either 20% of the sender's energy
       *  or 30% of the required energy whichever is lower
       */
      var big = null;
      var small = null;
      if ( node.size > link.size ) {
        big = node; small = link;
      } else {
        small = node; big = link;
      }
      
      var sizeRatio = big.size / small.size;
      if ( sizeRatio > 1.5 ) { // If it's 2 times bigger
        // Send energy
        var blob = generateEnergyBlob(big, small);
        var energy = Math.min(big.energy * 0.25, small.energyInv() * 0.7);
        if ( energy > 1 ) {
          blob.value = energy;
          big.energy -= energy;
          blobs.push(blob);
        }
        
        // Send water
        var blob = generateWaterBlob(big, small);
        var water = Math.min(big.water * 0.25, small.waterInv() * 0.7);
        if ( water > 1 ) {
          blob.value = water;
          big.water -= water;
          blobs.push(blob);
        }
      } else {
        // Energy calculation
        if ( node.energyPerc() > link.energyPerc() ) {
          big = node; small = link;
        } else {
          small = node; big = link;
        }
        
        var ratio = big.energyPerc() / small.energyPerc();
        if ( ratio > 1.2 ) {
          var blob = generateEnergyBlob(big, small);
          var energy = Math.min(big.energy * 0.2, small.energyInv() * 0.3);
          if ( energy > 0 ) {
            blob.value = energy;
            big.energy -= energy;
            blobs.push(blob);
          }
        }
        
        // Water calculation
        if ( node.waterPerc() > link.waterPerc() ) {
          big = node; small = link;
        } else {
          small = node; big = link;
        }
        
        var ratio = big.waterPerc() / small.waterPerc();
        if ( ratio > 1.1 ) {
          var blob = generateWaterBlob(big, small);
          var water = Math.min(big.water * 0.2, small.waterInv() * 0.3);
          if ( water > 0 ) {
            blob.value = water;
            big.water -= water;
            blobs.push(blob);
          }
        }
      }
    }
  }
}

function updateBlob(blob, delta) {
  blob.percent += delta;
  if ( blob.percent >= 1 && !blob.dead ) {
    blob.dead = true;
    blob.percent = 1;
    if ( blob.type == 'energy' ) {
      blob.to.energy += blob.value;
    } else if ( blob.type == 'water' ) {
      blob.to.water += blob.value;
    }
  }
}
