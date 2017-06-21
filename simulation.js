

function updateNode ( node, delta ) {
  // Update rate of usage
  node.energy -= delta * node.size * 0.04;
  if ( node.energy <= 0 ) {
    node.energy = 0;
  }
  
  if ( node.type == 'leaf' ) {
    node.energy += delta * node.size * 0.3;
    if ( node.energy > node.size ) {
      node.energy = node.size;
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
      var linkPerc = link.energy / link.size;
      var nodePerc = node.energy / node.size;
      
      var ratio = linkPerc / nodePerc;
      
      if ( ratio < 0.9 ) { // Child has more energy
        var blob = generateEnergyBlob(node, link);
        var energy = Math.min(node.energy * 0.2, link.energy * 0.2);
        blob.value = energy;
        node.energy -= energy;
        blobs.push(blob);
      } else if ( ratio > 1.2 ) { // Parent has more energy
        var blob = generateEnergyBlob(link, node);
        var energy = Math.min(node.energy * 0.2, link.energy * 0.2);
        blob.value = energy;
        link.energy -= energy;
        blobs.push(blob);
      }
    }
  }
}

function updateBlob(blob, delta) {
  blob.percent += delta;
  if ( blob.percent >= 1 && !blob.dead ) {
    blob.dead = true;
    blob.percent = 1;
    blob.to.energy += blob.value;
  }
}
