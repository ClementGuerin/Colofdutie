Player = function (game, canvas) {
  // _this est l'accès à la caméraà l'interieur de Player
  var _this = this;

  // Le jeu, chargé dans l'objet Player
  this.game = game;

  // Init camera
  this._initCamera(this.game.scene, canvas);

};

Player.prototype = {
  _initCamera: function (scene, canvas) {
    // On crée la caméra
    this.camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(20, 20, 20), scene);

    // Si le joueur est en vie ou non
    this.isAlive = true;

    // Collisions
    this.camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
    this.camera.checkCollisions = true;
    this.camera.ellipsoid.checkCollisions = true;
    console.log(this.camera);

    // Gravity
    this.camera.applyGravity = true;

    this.camera.attachControl(canvas, false);
  }
};
