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
  BABYLON.SceneLoader.Append("./assets/scene/map/", "Plopmap.gltf", this.scene, function (scene) {
    scene.meshes.forEach(mesh => {
      //console.log(mesh);
      if (mesh.id !== "WeaponBox" &&
        mesh.id !== "Weapon_primitive0" &&
        mesh.id !== "Weapon_primitive1" &&
        mesh.id !== "Weapon_primitive2" &&
        mesh.id !== "Head" &&
        mesh.id !== "Arm-Left" &&
        mesh.id !== "Arm-Right" &&
        mesh.id !== "Chest" &&
        mesh.id !== "Leg-Left" &&
        mesh.id !== "Leg-Right") {
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

    if (typeof _player.playerBox !== 'undefined') {
      // Checker le mouvement du joueur en lui envoyant le ratio de déplacement
      _player._checkMove((_this.fps) / 60);
    }

    _this.scene.render();

    if (typeof _player.playerBox !== 'undefined') {
      // Si launchBullets est a true, on tire
      if (_player.camera.weapons.launchBullets === true) {
        _player.camera.weapons.launchFire();
      }
    }

  });

  var fpsLoop = setInterval(function () {
    document.querySelector('.fps').textContent = _this.fps + ' FPS';
    if (_this.fps < 30) {
      document.querySelector('.fps').style.color = 'red';
    } else {
      document.querySelector('.fps').style.color = 'white';
    }
  }, 300)

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
