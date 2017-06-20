
function drawBlob(context, blob) {
  var x = (blob.to.x - blob.from.x) * blob.percent + blob.from.x;
  var y = (blob.to.y - blob.from.y) * blob.percent + blob.from.y;
  
  context.beginPath();
  context.fillStyle = "#BAAC24";
  context.arc(x, y, blob.value * 0.5, 0, Math.PI*2, true); 
  context.fill();
  context.closePath();
}

function drawLinks(context, node ) {
  if ( node.links[0] != null ) {
    context.beginPath();
    context.moveTo(node.x,node.y);
    context.lineTo(node.links[0].x,node.links[0].y);
    context.lineWidth = 2;
    context.strokeStyle = "#000000";
    context.stroke();
  }
}
function drawNode (context, node ) {
  // Draw body
  context.beginPath();
  context.lineWidth = 3;
  if ( node.type == null ) {
    context.strokeStyle = "#001121";
  } else if ( node.type == 'leaf' ) {
    context.strokeStyle = "#249A21";
  }
  context.fillStyle = "#000000";
  context.arc(node.x, node.y, node.size, 0, Math.PI*2, true); 
  context.fill();
  context.stroke();
  context.closePath();
  
  // Draw energy
  context.beginPath();
  context.fillStyle = "#BAAC24";
  context.arc(node.x, node.y, Math.min(node.energy, node.size), 0, Math.PI*2, true); 
  context.fill();
  context.closePath();
  
}
