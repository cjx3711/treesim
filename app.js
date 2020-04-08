var canvas = document.getElementById("main");
var context = canvas.getContext("2d");
var cursorPos = {x: 0, y: 0}
var prevCursorDown = false;
var cursorDown = false;
var draggingNode = null;

window.onresize = function(event) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.75;
    console.log(canvas.width + " " + canvas.height);
    App.stop();
};


canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.8;

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect(), // abs. size of element
  scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
  scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

  return {
    x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
    y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
  }
}

canvas.addEventListener('mousemove', function(evt) {
  cursorPos = getMousePos(canvas, evt);
}, false);

canvas.addEventListener('mousedown', function(evt) {
  cursorDown = true;
}, false);

canvas.addEventListener('mouseup', function(evt) {
  cursorDown = false;
}, false);

var date = new Date();
var sendBlob = 0;
var App = {
  fps: 30,
  _actualFPS: 0,
  _displayFPS: 0,
  _prevTime : 0,
  _currTime : 0,
  _delta : 0,
  _percentage: 0,
  _intervalID: null,
  start : function (fps) {
    App.stop();
    if ( typeof fps == "undefined" ) {
      this.fps = fps;
    }
    App._prevTime = App._currTime = Date.now();

    
    this._intervalID = setInterval(this.run, 1000 / this.fps);
  },
  stop: function () {
    if ( this._intervalID != null ) {
      clearInterval(this._intervalID);
      this._intervalID = null;
    }
  
  },
  run: function() {
    App.update();
    App.draw();
  },
  update: function() {
    App._currTime = Date.now(); //window.performance.now();
    App._delta = (App._currTime - App._prevTime)/1000;
    App._actualFPS = App._actualFPS * 0.7 +  (1 / App._delta) * 0.3;

    sendBlob += App._delta;

    
    if (cursorDown && !prevCursorDown) { // Clicked
      for (i in nodes) {
        node = nodes[i];
        if (distSq(cursorPos, node.getPos()) < node.size * node.size ) {
          node.dragging = true;
          draggingNode = node;
        }
      }
    } else if (!cursorDown && prevCursorDown) { // Released
      if (draggingNode) {
        draggingNode.fX = 0;
        draggingNode.fY = 0;
        draggingNode.vX = 0;
        draggingNode.vY = 0;
        draggingNode.dragging = false;
        draggingNode = null;
      }
    }
    
    // Interact nodes
    for (i in nodes) {
      node = nodes[i];
      if (distSq(cursorPos, node.getPos()) < node.size * node.size ) {
        node.mouseOver = true;
      } else {
        node.mouseOver = false;
      }
    }

    if ( draggingNode ) {
      draggingNode.x = cursorPos.x;
      draggingNode.y = cursorPos.y;
    }

  
    
    // Update nodes
    for ( i in nodes ) {
      node = nodes[i];
      updateNode(node, App._delta);
    }
    
    // Update blobs
    for ( i in blobs ) {
      var blob = blobs[i];
      updateBlob( blob, App._delta );
    }
    
    // Spread nodes out
    for ( i in nodes ) {
      node = nodes[i];
      spreadNode(node);
    }

    for ( let i in nodes ) {
      for ( let j in nodes ) {
        spreadNonRelatedNodes(nodes[i], nodes[j]);
      }
    }
    
    // Blob diffusion logic
    if ( sendBlob > 0.5 ) {
      App._displayFPS = App._actualFPS;
      sendBlob -= 0.5;
      diffuseBlobs();
    }
    
    // Delete blobs
    for ( var i = 0; i < blobs.length;) {
      var blob = blobs[i];
      // If blob is done, or the parent / child node is dead
      if ( blob.dead || blob.to.dead || blob.from.dead ) {
        blobs.splice(i, 1);
      } else {
        i++;
      }
    }
    
    // Delete nodes
    for (var i = 0; i < nodes.length; ) {
      var node = nodes[i];
      if ( node.dead && node.opacity == 0 ) {
        // Unlink node from all links
        while ( node.links.length > 0 ) {
          var link = node.links.pop();
          if ( link != null ) link.removeLink(node);
        }

        // Remove node
        nodes.splice(i, 1);
      } else {
        i++;
      }
    }
     
    

    
    App._prevTime = App._currTime;
    prevCursorDown = cursorDown;
  },

  draw: function() {
    var width = canvas.width;
    var height = canvas.height;
    context.clearRect(0,0,width,height);

    for ( i in nodes ) {
      var node = nodes[i];
      drawLinks( context, node );
    }
    
    for ( i in nodes ) {
      var node = nodes[i];
      drawNode( context, node );
    }
    
    for ( i in blobs ) {
      var blob = blobs[i];
      drawBlob( context, blob );
    }
    

    context.fillStyle = "#000000";
    context.fillRect (cursorPos.x, cursorPos.y, 4, 4);

    context.globalAlpha=0.6;
    context.fillStyle="#DDDDDD";
    context.fillRect(0,0, 60, 15);
    context.globalAlpha=1;
    context.fillStyle="#000000";
    context.font="10px Arial";
    context.fillText ( "fps: " + Math.round( App._displayFPS ) ,10 , 10);
    context.font="15px Arial";
  }
};

function startSimulation() {
  id = 0;
  nodes.length = 0;
  blobs.length = 0;
  
  var root = generateNode(null);
  root.x = canvas.width / 2 - (canvas.width / 6) + Math.random() * (canvas.width / 3);
  root.y = canvas.height / 2 - (canvas.height / 6) + Math.random() * (canvas.height / 3);
  root.size += Math.random() * 5 + 4;
  nodes.push(root);
  // Create branch nodes
  for ( var i = 0; i < 9; i++) {
    addNode();
  }
  
  // Create leaf nodes
  for ( var i = 0; i < 2; i++) {
    addEnergy();
  }
  
  // Create root nodes
  for ( var i = 0; i < 2; i++) {
    addWater();
  }
  
  App.start();
}

function resumeSimulation() {
  App.start();
}

function stopSimulation() {
  App.stop();
}

function killNode() {
  var node = nodes[Math.floor(Math.random() * nodes.length)];
  node.dead = true;
  node.energy = 0;
  node.water = 0;
}

function addRoot() {
  var root = generateNode(null);
  root.x = canvas.width / 2 - (canvas.width / 6) + Math.random() * (canvas.width / 3);
  root.y = canvas.height / 2 - (canvas.height / 6) + Math.random() * (canvas.height / 3);
  nodes.push(root);
}
function addNode(parent) {
  var tries = 3;
  var distance = parent == undefined ? (Math.random() * 80 + 40) : (Math.random() * 15 + 30); // If it's a spawn, spawn closer
  while(tries > 0) {
    if ( nodes.length == 0 ) addRoot();
    if ( parent == undefined ) parent = nodes[Math.floor(Math.random() * nodes.length)];
    var node = generateNode();
    var coord = polToCart(Math.random() * 360, distance);
    node.x = coord.x + parent.x;
    node.y = coord.y + parent.y;
    if ( !collideAll(node, 20) ) {
      node.setParent(parent);
      nodes.push(node);
      return node;
    }
    tries--;
  }
  return null;
}

function addWater(parent) {
  var tries = 3;
  var distance = parent == undefined ? (Math.random() * 80 + 40) : (Math.random() * 15 + 30); // If it's a spawn, spawn closer
  while(tries > 0) {
    if ( nodes.length == 0 ) addRoot();
    if ( parent == undefined ) parent = nodes[Math.floor(Math.random() * nodes.length)];
    var node = generateNode();
    node.type = 'root';
    var coord = polToCart(Math.random() * 360, distance );
    node.x = coord.x + parent.x;
    node.y = coord.y + parent.y;
    if ( !collideAll(node, 20) ) {
      node.setParent(parent);
      nodes.push(node);
      return node;
    }
    tries--;
  }
  return null;
}

function addEnergy(parent) {
  var tries = 3;
  var distance = parent == undefined ? (Math.random() * 80 + 40) : (Math.random() * 15 + 30); // If it's a spawn, spawn closer
  while(tries > 0) {
    if ( nodes.length == 0 ) addRoot();
    if ( parent == undefined ) parent = nodes[Math.floor(Math.random() * nodes.length)];
    var node = generateNode();
    node.type = 'leaf';
    var coord = polToCart(Math.random() * 360, distance);
    node.x = coord.x + parent.x;
    node.y = coord.y + parent.y;
    if ( !collideAll(node, 20) ) {
      node.setParent(parent);
      nodes.push(node);
      return node;
    }
    tries--;
  }
  return null;
}