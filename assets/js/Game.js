// Page loaded, run Game
document.addEventListener('DOMContentLoaded', function () {
  new Game('renderCanvas');
}, false);

Game = function (canvasId) {
  // Canvas et engine définis ici
  var canvas = document.getElementById(canvasId);
  var engine = new BABYLON.Engine(canvas, true);
  var _this = this;

  // Init scene
  this.scene = this._initScene(engine);

  // Init Player.js
  var _player = new Player(_this, canvas);

  // Init Arena.js
  var _arena = new Arena(_this);

  // Permet au jeu de tourner
  engine.runRenderLoop(function () {
    _this.scene.render();
  });

  // Resize window
  window.addEventListener('resize', function () {
    if (engine) {
      engine.resize();
    }
  }, false);
};

Game.prototype = {
  // Prototype d'init scene
  _initScene: function (engine) {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0, 0, 0);
    return scene;
  }
}
