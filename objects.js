var id = 0;
function generateNode () {
  var size = Math.random() * 10 + 10;
  var node = {
    id: id++,
    dead : false,
    opacity: 1,
    type: null,
    links: [null], // Stores list of nodes. 
    water: 0, // Actual water level
    energy: 0, // Actual energy level
    size: 0, // Radius ( May change to area )
    displayEnergy: 0, // Energy level to display
    displayWater: 0, // Water level to display
    displaySize: 0, // Size to display
    x: Math.random() * canvas.width, // Position
    y: Math.random() * canvas.height, // Position
    vX: 0, // Velocity
    vY: 0, // Velocity
    fX: 0,
    fY: 0,
    setParent: function(parent) {
      if ( parent != null ) {
        node.links[0] = parent; // First link is always parent
        parent.links.push(node); // Link back to the parent
      }
    },
    setSize: function(size) {
      node.size = size;
      node.water = size * 0.75;
      node.energy = size * 0.75;
      node.displayEnergy = size * 0.75;
      node.displayWater = size * 0.75;
      node.displaySize = size * 0.75;
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
    spawn: function() { // Spawns a new child
      var rand = Math.random();
      var spawn;
      if ( rand < 0.8 ) spawn = addNode(node);
      else if ( rand < 0.9 ) spawn = addEnergy(node);
      else spawn = addWater(node);
      if ( spawn != null ) {
        var spawnSize = 5;
        spawn.setSize(spawnSize);
        node.water -= spawnSize;
        node.energy -= spawnSize;
        node.size -= spawnSize;
      }
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
  node.setSize(size);

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