var canvas = document.getElementById("main");
var context = canvas.getContext("2d");

window.onresize = function(event) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.75;
    console.log(canvas.width + " " + canvas.height);
    App.stop();
};
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.8;

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
    
    for ( i in nodes ) {
      node = nodes[i];
      updateNode(node, App._delta);
    }
  
    
    for ( i in blobs ) {
      var blob = blobs[i];
      updateBlob( blob, App._delta );
    }
    
    for ( i in nodes ) {
      node = nodes[i];
      spreadNode(node, App._delta);
    }
    
    if ( sendBlob > 0.5 ) {
      App._displayFPS = App._actualFPS;
      sendBlob -= 0.5;
      diffuseBlobs();
    }
    
    // Delete blobs
    for ( var i = 0; i < blobs.length;) {
      if ( blobs[i].dead ) {
        blobs.splice(i, 1);
      } else {
        i++;
      }
    }
    
    App._prevTime = App._currTime;
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
  nodes.length = 0;
  blobs.length = 0;
  
  var root = generateNode(null);
  root.x = canvas.width / 2 - (canvas.width / 6) + Math.random() * (canvas.width / 3);
  root.y = canvas.height / 2 - (canvas.height / 6) + Math.random() * (canvas.height / 3);
  
  root.size += Math.random() * 5 + 4;
  nodes.push(root);
  // Create branch nodes
  for ( var i = 0; i < 6;) {
    var parent = nodes[Math.floor(Math.random() * nodes.length)];
    var node = generateNode();
    var coord = polToCart(Math.random() * 360, Math.random() * 80 + 40);
    node.x = coord.x + parent.x;
    node.y = coord.y + parent.y;
    if ( !collideAll(node, 20) ) {
      node.setParent(parent);
      nodes.push(node);
      i++;
    }
  }
  
  // Create leaf nodes
  for ( var i = 0; i < 3; ) {
    var parent = nodes[Math.floor(Math.random() * nodes.length)];
    var node = generateNode();
    node.type = 'leaf';
    var coord = polToCart(Math.random() * 360, Math.random() * 80 + 40);
    node.x = coord.x + parent.x;
    node.y = coord.y + parent.y;
    if ( !collideAll(node, 20) ) {
      node.setParent(parent);
      nodes.push(node);
      i++;
    }
  }
  
  // Create root nodes
  for ( var i = 0; i < 3; ) {
    var parent = nodes[Math.floor(Math.random() * nodes.length)];
    var node = generateNode();
    node.type = 'root';
    var coord = polToCart(Math.random() * 360, Math.random() * 80 + 40);
    node.x = coord.x + parent.x;
    node.y = coord.y + parent.y;
    if ( !collideAll(node, 20) ) {
      node.setParent(parent);
      nodes.push(node);
      i++;
    }
  }
  App.start();
}

function stopSimulation() {
  App.stop();
}