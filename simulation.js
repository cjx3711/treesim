

function updateNode ( node, delta ) {
  // Update rate of usage
  node.energy -= delta * node.size * 0.04;
  if ( node.energy <= 0 ) {
    node.energy = 0;
  }
  
  node.water -= delta * node.size * 0.04;
  if ( node.water <= 0 ) {
    node.water = 0;
  }
  
  if ( node.type == 'leaf' ) {
    node.energy += delta * node.size * 0.4;
    if ( node.energy > node.size ) {
      node.energy = node.size;
    }
  }
  
  if ( node.type == 'root' ) {
    node.water += delta * node.size * 0.4;
    if ( node.water > node.size ) {
      node.water = node.size;
    }
  }
  
  node.displayEnergy += (node.energy - node.displayEnergy) * delta * 5;
  node.displayWater += (node.water - node.displayWater) * delta * 5;
}

/**
 * Logic to decide where to send the energy
 */
function diffuseBlobs() {
  for ( i in nodes ) {
    node = nodes[i];
    
    for ( var l = 1; l < node.links.length; l++ ) { // Skip the parent node
      link = node.links[l];

      
      /* Algo:
       * If the ratio of the energy difference is more than a threshold,
       * Send energy.
       * Either 20% of the node's energy
       * or 30% of the energy the receivig node requires
       * whichever is lower
       */
    
       // Energy calculation
      var ratio = (link.energy / link.size) / (node.energy / node.size);
      if ( ratio < 0.9 ) { // Child has more energy
        var blob = generateEnergyBlob(node, link);
        var energy = Math.min(node.energy * 0.2, link.energyInv() * 0.3);
        if ( energy > 0 ) {
          blob.value = energy;
          node.energy -= energy;
          blobs.push(blob);
        }
      } else if ( ratio > 1.2 ) { // Parent has more energy
        var blob = generateEnergyBlob(link, node);
        var energy = Math.min(node.energyInv() * 0.3, link.energy * 0.2);
        if ( energy > 0 ) {
          blob.value = energy;
          link.energy -= energy;
          blobs.push(blob);
        }
      }
      
      // Water calculation
     var ratio = (link.water / link.size) / (node.water / node.size);
     if ( ratio < 0.9 ) { // Child has more water
       var blob = generateWaterBlob(node, link);
       var water = Math.min(node.water * 0.2, link.waterInv() * 0.3);
       if ( water > 0 ) {
         blob.value = water;
         node.water -= water;
         blobs.push(blob);
       }
     } else if ( ratio > 1.2 ) { // Parent has more water
       var blob = generateWaterBlob(link, node);
       var water = Math.min(node.waterInv() * 0.3, link.water * 0.2);
       if ( water > 0 ) {
         blob.value = water;
         link.water -= water;
         blobs.push(blob);
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
