function generateNode (parent) {
  var size = Math.random() * 10 + 10;
  var node = {
    dead : false,
    type: null,
    links: [], // Stores list of nodes. 
    water: size,
    energy: size,
    size: size,
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height
  };
  node.links.push(parent); // First link is always parent
  if ( parent != null ) parent.links.push(node); // Link back to the parent
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