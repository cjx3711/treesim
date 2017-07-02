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
  node.x += node.vX * delta;
  node.y += node.vY * delta;
  
  // Friction
  if ( Math.abs(node.vX) < 0.01 ) {
    node.vX = 0;
  } else {
    node.vX -= (node.vX > 0 ? 1 : -1) * delta * 20;
  }
  if ( Math.abs(node.vY) < 0.01 ) {
    node.vY = 0;
  } else {
    node.vY -= (node.vY > 0 ? 1 : -1) * delta * 20;
  }
}

function spreadNode(node, delta) {
  for ( var l = 0; l < node.links.length; l++ ) {
    link = node.links[l];
    if ( link == null ) continue;
    var thickness = Math.min(node.size, link.size);
    var desiredDistance = thickness * 5;
    var currentDist = dist(node, link);
    var distDelta = desiredDistance - currentDist;
    var pullPower = 20;
    var weightRatio = node.size / link.size;
    var dir = cartToPol(link.x - node.x, link.y - node.y).dir;
    var vel = polToCart(dir, unit(distDelta) * pullPower * weightRatio);
    // Move the links
    link.vX += vel.x * delta;
    link.vY += vel.y * delta;
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
    
       // Energy calculation
      // var ratio = (link.energy / link.size) / (node.energy / node.size);
      // if ( ratio < 0.9 ) { // Child has more energy
      //   var blob = generateEnergyBlob(node, link);
      //   var energy = Math.min(node.energy * 0.2, link.energyInv() * 0.3);
      //   if ( energy > 0 ) {
      //     blob.value = energy;
      //     node.energy -= energy;
      //     blobs.push(blob);
      //   }
      // } else if ( ratio > 1.2 ) { // Parent has more energy
      //   var blob = generateEnergyBlob(link, node);
      //   var energy = Math.min(node.energyInv() * 0.3, link.energy * 0.2);
      //   if ( energy > 0 ) {
      //     blob.value = energy;
      //     link.energy -= energy;
      //     blobs.push(blob);
      //   }
      // }
      
      // Water calculation
      // var ratio = (link.water / link.size) / (node.water / node.size);
      // if ( ratio < 0.9 ) { // Child has more water
      //  var blob = generateWaterBlob(node, link);
      //  var water = Math.min(node.water * 0.2, link.waterInv() * 0.3);
      //  if ( water > 0 ) {
      //    blob.value = water;
      //    node.water -= water;
      //    blobs.push(blob);
      //  }
      // } else if ( ratio > 1.2 ) { // Parent has more water
      //   var blob = generateWaterBlob(link, node);
      //   var water = Math.min(link.water * 0.2, node.waterInv() * 0.3);
      //   if ( water > 0 ) {
      //    blob.value = water;
      //    link.water -= water;
      //    blobs.push(blob);
      //   }
      // }
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
