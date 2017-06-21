
function drawBlob(context, blob) {
  var x = (blob.to.x - blob.from.x) * blob.percent + blob.from.x;
  var y = (blob.to.y - blob.from.y) * blob.percent + blob.from.y;
  
  context.beginPath();
  context.fillStyle = "#ffd54f";
  context.arc(x, y, Math.min(6,blob.value), 0, Math.PI*2, true); 
  context.fill();
  context.closePath();
}

function drawLinks(context, node ) {
  for ( var l = 1; l < node.links.length; l++ ) { // Skip the parent node
    link = node.links[l];
    context.beginPath();
    context.moveTo(node.x,node.y);
    context.lineTo(link.x,link.y);
    var radius = Math.min(node.size, link.size);
    context.lineWidth = radius;
    context.strokeStyle = "#4e342e";
    context.stroke();
  }
  // if ( node.links[0] != null ) {
  //   context.beginPath();
  //   context.moveTo(node.x,node.y);
  //   context.lineTo(node.links[0].x,node.links[0].y);
  //   context.lineWidth = 2;
  //   context.strokeStyle = "#4e342e";
  //   context.stroke();
  // }
}
function drawNode (context, node ) {
  // Draw body
  context.beginPath();
  context.lineWidth = 4;
  if ( node.type == null ) {
    context.strokeStyle = "#795548";
  } else if ( node.type == 'leaf' ) {
    context.strokeStyle = "#43a047";
  }
  context.fillStyle = "#4e342e";
  context.arc(node.x, node.y, node.size, 0, Math.PI*2, true); 
  context.fill();
  context.stroke();
  context.closePath();
  
  // Draw energy
  context.beginPath();
  context.fillStyle = "#ffd54f";
  context.arc(node.x, node.y, Math.min(node.displayEnergy, node.size), 0, Math.PI*2, true); 
  context.fill();
  context.closePath();
  
}
