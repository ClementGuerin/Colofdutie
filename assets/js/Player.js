Player = function (game, canvas) {
  // Scene du jeu
  this.scene = game.scene;

  // Init camera
  this._initCamera(this.scene, canvas);
};

Player.prototype = {
  _initCamera: function (scene, canvas) {
    // Create camera
    this.camera = new BABYLON.ArcRotateCamera("camera", 1, 1, 65, new BABYLON.Vector3.Zero(), scene);

    // Init camera
    this.camera.setTarget(BABYLON.Vector3.Zero());

    // Camera movements
    this.camera.attachControl(canvas, true);
  }
}
