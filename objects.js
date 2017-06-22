var id = 0;
function generateNode () {
  var size = Math.random() * 10 + 10;
  var node = {
    id: id++,
    dead : false,
    opacity: 1,
    type: null,
    links: [null], // Stores list of nodes. 
    water: size * 0.75, // Actual water level
    energy: size * 0.75, // Actual energy level
    displayEnergy: size * 0.75, // Energy level to display
    displayWater: size * 0.75, // Water level to display
    size: size, // Radius ( May change to area )
    x: Math.random() * canvas.width, // Position
    y: Math.random() * canvas.height,
    vX: 0, // Velocity
    vY: 0,
    setParent: function(parent) {
      if ( parent != null ) {
        node.links[0] = parent; // First link is always parent
        parent.links.push(node); // Link back to the parent
      }
    },
    energyPerc: function() {
      return node.energy / node.size;
    },
    waterPerc: function() {
      return node.water / node.size;
    },
    energyInv: function() {
      return node.size - node.energy;
    },
    waterInv: function() {
      return node.size - node.water;
    },
    removeLink: function(link) {
      for (var r = 0; r < node.links.length;) {
        if ( link == node.links[r] ) {
          if ( r == 0 ) node.links[0] = null;
          else node.links.splice(r, 1);
          return;
        } else {
          r++;
        }
      }
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