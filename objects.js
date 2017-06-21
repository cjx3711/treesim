function generateNode () {
  var size = Math.random() * 10 + 10;
  var node = {
    dead : false,
    type: null,
    links: [null], // Stores list of nodes. 
    water: size,
    energy: size,
    displayEnergy: size,
    displayWater: size,
    size: size,
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vX: 0,
    vY: 0,
    setParent: function(parent) {
      if ( parent != null ) {
        node.links[0] = parent; // First link is always parent
        parent.links.push(node); // Link back to the parent
      }
    },
    energyInv: function() {
      return node.size - node.energy;
    },
    waterInv: function() {
      return node.size - node.water;
    }
  };

  return node;
}

function generateEnergyBlob(from, to) {
  return {
    dead: false,
    type: 'energy',
    value: 0,
    percent: 0,
    from: from,
    to: to
  }
}

function generateWaterBlob(from, to) {
  return {
    dead: false,
    type: 'water',
    value: 0,
    percent: 0,
    from: from,
    to: to
  }
}