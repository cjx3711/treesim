
function drawBlob(context, blob) {
  var x = (blob.to.x - blob.from.x) * blob.percent + blob.from.x;
  var y = (blob.to.y - blob.from.y) * blob.percent + blob.from.y;
  
  context.globalAlpha = 1;
  context.beginPath();
  if ( blob.type == 'energy' ) {
    context.fillStyle = "#ffd54f";
  } else {
    context.fillStyle = "#1976d2";
  }
  context.arc(x, y, Math.max(2, sizeToRadius(blob.value * 0.3)), 0, Math.PI*2, true); 
  context.fill();
  context.closePath();
}

function drawLinks(context, node ) {
  for ( var l = 1; l < node.links.length; l++ ) { // Skip the parent node
    link = node.links[l];
    var opacity = Math.min(node.opacity, link.opacity);
    context.globalAlpha = opacity;
    context.beginPath();
    context.moveTo(node.x,node.y);
    context.lineTo(link.x,link.y);
    var thickness = Math.min(node.size, link.size);
    context.lineWidth = thickness;
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
  context.globalAlpha = node.opacity;
  // Draw body
  context.beginPath();
  context.fillStyle = "#4e342e";
  context.arc(node.x, node.y, sizeToRadius(node.displaySize), 0, Math.PI*2, true); 
  context.fill();
  context.closePath();
  
  context.lineWidth = 2;
  
  // Draw energy
  context.beginPath();
  // context.globalAlpha = 0.5;
  context.fillStyle = "#ffd54f";
  context.arc(node.x, node.y, Math.min(node.displayEnergy, sizeToRadius(node.displaySize)), 0, Math.PI, true); 
  context.fill();
  context.closePath();
  
  // Draw water
  context.beginPath();
  // context.globalAlpha = 0.5;
  context.fillStyle = "#1976d2 ";
  context.arc(node.x, node.y, Math.min(node.displayWater, sizeToRadius(node.displaySize)), Math.PI, Math.PI * 2, true); 
  context.fill();
  context.closePath();
  
  // Draw outline
  if ( node.type == null ) {
    context.strokeStyle = "#795548";
  } else if ( node.type == 'leaf' ) {
    context.strokeStyle = "#43a047";
  } else if ( node.type == 'root' ) {
    context.strokeStyle = "#1976d2";
  }
  
  context.beginPath();
  context.globalAlpha = 1;
  context.lineWidth = 3;
  context.arc(node.x, node.y, sizeToRadius(node.displaySize), 0, Math.PI*2, true); 
  context.stroke();
  context.closePath();
  
  // context.fillStyle = "#FF0000";
  // context.font="12px Arial";
  // context.fillText ( node.id+"" ,node.x , node.y);
  
}
