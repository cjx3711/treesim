
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
    var thickness = Math.min(node.size, link.size);
    context.lineWidth = thickness * 0.85;
    context.strokeStyle = "#666666";
    context.beginPath();
    context.moveTo(node.x,node.y);
    context.lineTo(link.x,link.y);
    context.stroke();
    context.closePath();
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


  if ( node.type == null || node.type == 'branch' ) {
    // context.strokeStyle = "#795548";
    // context.fillStyle = "#4e342e";
    context.strokeStyle = "#666666";
    context.fillStyle = "#333333";
  } else if ( node.type == 'leaf' ) {
    context.strokeStyle = "#43a047";
    context.fillStyle = "#43a047";
  } else if ( node.type == 'root' ) {
    context.strokeStyle = "#956858";
    context.fillStyle = "#6e544e";
  }

  // Draw body
  context.beginPath();
  context.arc(node.x, node.y, sizeToRadius(node.displaySize) + 5, 0, Math.PI*2, true); 
  context.fill();
  context.closePath();

  // Draw outline
  if ( node.mouseOver ) {
    context.globalAlpha = 1;
    context.lineWidth = 8;
  } else {
    context.globalAlpha = 1;
    context.lineWidth = 5;
  }
  
  context.beginPath();
  context.arc(node.x, node.y, sizeToRadius(node.displaySize) + 5, 0, Math.PI*2, true); 
  context.stroke();
  context.closePath();

  context.lineWidth = 2;

  
  // Draw energy
  context.beginPath();
  // context.globalAlpha = 0.8;
  context.fillStyle = "#ffd54f";
  context.arc(node.x, node.y, Math.min(node.displayEnergy, sizeToRadius(node.displaySize)), 0, Math.PI, true); 
  context.fill();
  context.closePath();
  
  // Draw water
  context.beginPath();
  // context.globalAlpha = 0.8;
  context.fillStyle = "#1976d2";
  context.arc(node.x, node.y, Math.min(node.displayWater, sizeToRadius(node.displaySize)), Math.PI, Math.PI * 2, true); 
  context.fill();
  context.closePath();
  
  // context.fillStyle = "#FF0000";
  // context.font="12px Arial";
  // context.fillText ( node.id+"" ,node.x , node.y);
  
}

function drawPlacementLink(context, cursorPos, placementParent) {
  // Draws the line to indicate which node it will be placed on.
  if ( placementParent ) {
    context.globalAlpha = 0.5;
    context.lineWidth = 2;
    context.strokeStyle = "#4e342e";
    context.beginPath();
    context.moveTo(placementParent.x,placementParent.y);
    context.lineTo(cursorPos.x,cursorPos.y);
    context.stroke();
    context.closePath();
  }
}

function drawCursor(context, cursorPos, cursorMode) {
  // Draws the cursor depending on the cursor mode.
  // Draw cursor
  switch (cursorMode) {
    case 'branch':
      context.strokeStyle = "#795548";
      context.globalAlpha = 0.4;
      context.lineWidth = 3;
      context.beginPath();
      context.arc(cursorPos.x, cursorPos.y, 30, 0, Math.PI*2, true); 
      context.stroke();
      context.closePath();
    break;
    case 'leaf':
      context.strokeStyle = "#43a047";
      context.globalAlpha = 0.4;
      context.lineWidth = 3;
      context.beginPath();
      context.arc(cursorPos.x, cursorPos.y, 30, 0, Math.PI*2, true); 
      context.stroke();
      context.closePath();
    break;
    case 'root':
      context.strokeStyle = "#1976d2";
      context.globalAlpha = 0.4;
      context.lineWidth = 3;
      context.beginPath();
      context.arc(cursorPos.x, cursorPos.y, 30, 0, Math.PI*2, true); 
      context.stroke();
      context.closePath();
    break;
    case 'kill':
      context.strokeStyle = "#9919d2";
      context.globalAlpha = 0.6;
      context.lineWidth = 6;
      context.beginPath();
      context.moveTo(cursorPos.x - 10,cursorPos.y - 10);
      context.lineTo(cursorPos.x + 10,cursorPos.y + 10);
      context.moveTo(cursorPos.x + 10,cursorPos.y - 10);
      context.lineTo(cursorPos.x - 10,cursorPos.y + 10);
      context.stroke();
      context.closePath();
    break;
    default:
      context.globalAlpha = 1;
      context.fillStyle = "#000000";
      context.fillRect (cursorPos.x, cursorPos.y, 4, 4);
    break;
  }
}

function drawMapPos(context, mapPos) {
  context.globalAlpha=0.6;
  context.fillStyle="#DDDDDD";
  context.font="10px Arial";
  context.fillRect(0,15, 60, 15);
  context.globalAlpha=1;
  context.fillStyle="#000000";
  context.font="10px Arial";
  context.fillText ( `[${mapPos.x}, ${mapPos.y}]`, 10, 25);
  context.font="15px Arial";
}