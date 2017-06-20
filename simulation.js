

function updateNode ( node, delta ) {
  // Update rate of usage
  node.energy -= delta * node.size * 0.08;
  if ( node.energy <= 0 ) {
    node.energy = 0;
  }
  
  if ( node.type == 'leaf' ) {
    node.energy += delta * node.size * 0.5;
    if ( node.energy > node.size ) {
      node.energy = node.size;
    }
  }
}

/**
 * Logic to decide where to send the energy
 */
function diffuseBlobs() {
  for ( i in nodes ) {
    node = nodes[i];
    
    for ( var l = 1; l < node.links.length; l++ ) {
      link = node.links[l];
    }
    if ( node.parent == null ) {
      continue;
    }
    var parentPerc = node.parent.energy / node.parent.size;
    var childPerc = node.energy / node.size;
    
    var ratio = parentPerc / childPerc;
    
    if ( ratio < 0.8 ) { // Child has more energy
      var blob = generateEnergyBlob(node, node.parent);
      blob.value = node.energy / 2;
      node.energy /= 2;
      blobs.push(blob);
    } else if ( ratio > 1.4 ) { // Parent has more energy
      var blob = generateEnergyBlob(node.parent, node);
      blob.value = node.parent.energy / 2;
      node.parent.energy /= 2;
      blobs.push(blob);
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
