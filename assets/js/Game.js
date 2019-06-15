// Page loaded, run Game
document.addEventListener('DOMContentLoaded', function () {
  new Game('renderCanvas');
}, false);

Game = function (canvasId) {
  // Canvas et engine définis ici
  var canvas = document.getElementById(canvasId);
  var engine = new BABYLON.Engine(canvas, true);
  this.engine = engine;
  var _this = this;
  _this.actualTime = Date.now();

  // Init scene
  this.scene = this._initScene(engine);
  BABYLON.SceneLoader.Append("./assets/scene/clara/", "test-bordel.babylon", this.scene, function (scene) {
    // Init Arena.js
    var _arena = new Arena(_this);
    // Collision
    scene.collisionsEnabled = true;
    scene.checkCollisions = true;
    scene.meshes.forEach(mesh => {
      mesh.checkCollisions = true;
    });

    scene.clearColor = new BABYLON.Color3(0.650, 0.866, 0.968);
  });

  // Init Player.js
  var _player = new Player(_this, canvas);

  // Permet au jeu de tourner
  engine.runRenderLoop(function () {
    // Récuperer le ratio par les fps
    _this.fps = Math.round(1000 / engine.getDeltaTime());

    // Checker le mouvement du joueur en lui envoyant le ratio de déplacement
    _player._checkMove((_this.fps) / 60);

    _this.scene.render();

    // Si launchBullets est a true, on tire
    if (_player.camera._weapons.launchBullets === true) {
      _player.camera._weapons.launchFire();
    }
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
