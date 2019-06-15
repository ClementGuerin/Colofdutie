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
  var _arena = new Arena(_this);
  BABYLON.SceneLoader.Append("./assets/scene/clara/", "test-bordel.babylon", this.scene, function (scene) {
    scene.meshes.forEach(mesh => {
      //console.log(mesh);
      if (mesh.id !== "headMainPlayer" && mesh.id !== "rocketLauncher" && mesh.id !== "hitBoxPlayer") {
        mesh.checkCollisions = true;
      }
    });
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
    if (_player.camera.weapons.launchBullets === true) {
      _player.camera.weapons.launchFire();
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
    scene.clearColor = new BABYLON.Color3(0.9, 0.9, 0.9);
    scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
    scene.collisionsEnabled = true;
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
