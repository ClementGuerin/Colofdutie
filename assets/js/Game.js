// Page loaded, run Game
document.addEventListener('DOMContentLoaded', function () {
  new Game('renderCanvas');
}, false);

Game = function (canvasId) {
  // Canvas et engine définis ici
  var canvas = document.getElementById(canvasId);
  var engine = new BABYLON.Engine(canvas, true);
  var _this = this;
  _this.actualTime = Date.now();

  // Init scene
  this.scene = this._initScene(engine);
  BABYLON.SceneLoader.Append("./assets/scene/", "scene.gltf", this.scene, function (scene) {
    // Collision
    scene.collisionsEnabled = true;
    scene.checkCollisions = true;

    // Gravity
    scene.gravity = new BABYLON.Vector3(0, -0.9, 0);
  });

  // Init Player.js
  var _player = new Player(_this, canvas);

  // Init Arena.js
  var _arena = new Arena(_this);

  // Permet au jeu de tourner
  engine.runRenderLoop(function () {
    // Récuperer le ratio par les fps
    _this.fps = Math.round(1000 / engine.getDeltaTime());

    // Checker le mouvement du joueur en lui envoyant le ratio de déplacement
    _player._checkMove((_this.fps) / 60);

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

// ------------------------- TRANSFO DE DEGRES/RADIANS
function degToRad(deg) {
  return (Math.PI * deg) / 180
}
// ----------------------------------------------------

// -------------------------- TRANSFO DE DEGRES/RADIANS
function radToDeg(rad) {
  // return (Math.PI*deg)/180
  return (rad * 180) / Math.PI
}
// ----------------------------------------------------
