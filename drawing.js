
function drawBlob(context, blob, mapPos) {
  var x = (blob.to.x - blob.from.x) * blob.percent + blob.from.x - mapPos.x;
  var y = (blob.to.y - blob.from.y) * blob.percent + blob.from.y - mapPos.y;
  
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

function drawLinks(context, node, mapPos ) {
  for ( var l = 1; l < node.links.length; l++ ) { // Skip the parent node
    link = node.links[l];
    var opacity = Math.min(node.opacity, link.opacity);
    context.globalAlpha = opacity;
    var thickness = Math.min(node.size, link.size);
    context.lineWidth = thickness * 0.85;
    context.strokeStyle = "#666666";
    context.beginPath();
    context.moveTo(node.x - mapPos.x, node.y - mapPos.y);
    context.lineTo(link.x - mapPos.x, link.y - mapPos.y);
    context.stroke();
    context.closePath();
  }
}
function drawNode (context, node, mapPos ) {
  const x = node.x - mapPos.x;
  const y = node.y - mapPos.y;
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
  context.arc(x, y, sizeToRadius(node.displaySize) + 5, 0, Math.PI*2, true); 
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
  context.arc(x, y, sizeToRadius(node.displaySize) + 5, 0, Math.PI*2, true); 
  context.stroke();
  context.closePath();

  context.lineWidth = 2;

  // Draw energy
  context.beginPath();
  // context.globalAlpha = 0.8;
  context.fillStyle = "#ffd54f";
  context.arc(x, y, Math.min(node.displayEnergy, sizeToRadius(node.displaySize)), 0, Math.PI, true); 
  context.fill();
  context.closePath();
  
  // Draw water
  context.beginPath();
  // context.globalAlpha = 0.8;
  context.fillStyle = "#1976d2";
  context.arc(x, y, Math.min(node.displayWater, sizeToRadius(node.displaySize)), Math.PI, Math.PI * 2, true); 
  context.fill();
  context.closePath();
  
  // context.fillStyle = "#FF0000";
  // context.font="12px Arial";
  // context.fillText ( node.id+"" ,node.x , node.y);
  
}

function drawPlacementLink(context, cursorPos, placementParent, mapPos) {
  // Draws the line to indicate which node it will be placed on.
  if ( placementParent ) {
    context.globalAlpha = 0.5;
    context.lineWidth = 2;
    context.strokeStyle = "#4e342e";
    context.beginPath();
    context.moveTo(placementParent.x - mapPos.x, placementParent.y - mapPos.y);
    context.lineTo(cursorPos.x - mapPos.x, cursorPos.y - mapPos.y);
    context.stroke();
    context.closePath();
  }
}

function drawCursor(context, cursorPos, cursorMode, mapPos) {
  // Draws the cursor depending on the cursor mode.
  // Draw cursor
  const x = cursorPos.x;
  const y = cursorPos.y;
  switch (cursorMode) {
    case 'branch':
      context.strokeStyle = "#795548";
      context.globalAlpha = 0.4;
      context.lineWidth = 3;
      context.beginPath();
      context.arc(x, y, 30, 0, Math.PI*2, true); 
      context.stroke();
      context.closePath();
    break;
    case 'leaf':
      context.strokeStyle = "#43a047";
      context.globalAlpha = 0.4;
      context.lineWidth = 3;
      context.beginPath();
      context.arc(x, y, 30, 0, Math.PI*2, true); 
      context.stroke();
      context.closePath();
    break;
    case 'root':
      context.strokeStyle = "#1976d2";
      context.globalAlpha = 0.4;
      context.lineWidth = 3;
      context.beginPath();
      context.arc(x, y, 30, 0, Math.PI*2, true); 
      context.stroke();
      context.closePath();
    break;
    case 'kill':
      context.strokeStyle = "#9919d2";
      context.globalAlpha = 0.6;
      context.lineWidth = 6;
      context.beginPath();
      context.moveTo(x - 10,y - 10);
      context.lineTo(x + 10,y + 10);
      context.moveTo(x + 10,y - 10);
      context.lineTo(x - 10,y + 10);
      context.stroke();
      context.closePath();
    break;
    default:
      context.globalAlpha = 1;
      context.fillStyle = "#000000";
      context.fillRect (x, y, 4, 4);
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
  context.fillText ( `[${Math.round(mapPos.x)}, ${Math.round(mapPos.y)}]`, 10, 25);
  context.font="15px Arial";
}