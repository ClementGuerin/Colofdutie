Player = function (game, canvas) {
  // _this est l'accès à la caméraà l'interieur de Player
  var _this = this;

  // Le jeu, chargé dans l'objet Player
  this.game = game;

  _this.angularSensibility = 180;

  /* window.addEventListener("keyup", function (evt) {

    switch (evt.keyCode) {
      case 90:
        console.log('keyup 90');
        break;
      case 83:
        _this.camera.axisMovement[1] = false;
        break;
      case 81:
        _this.camera.axisMovement[2] = false;
        break;
      case 68:
        _this.camera.axisMovement[3] = false;
        break;
    }
  }, false);

  // Quand les touches sont relachés
  window.addEventListener("keydown", function (evt) {
    switch (evt.keyCode) {
      case 90:
        console.log('keydown 90');
        break;
      case 83:
        _this.camera.axisMovement[1] = true;
        break;
      case 81:
        _this.camera.axisMovement[2] = true;
        break;
      case 68:
        _this.camera.axisMovement[3] = true;
        break;
    }
  }, false); */

  window.addEventListener("mousemove", function (evt) {
    if (_this.rotEngaged === true) {
      _this.camera.rotation.y += evt.movementX * 0.001 * (_this.angularSensibility / 250);
      var nextRotationX = _this.camera.rotation.x + (evt.movementY * 0.001 * (_this.angularSensibility / 250));
      if (nextRotationX < degToRad(90) && nextRotationX > degToRad(-90)) {
        _this.camera.rotation.x += evt.movementY * 0.001 * (_this.angularSensibility / 250);
      }
    }
  }, false);


  // Init camera
  this._initCamera(this.game.scene, canvas);

  // Le joueur doit cliquer dans la scène pour que controlEnabled soit changé
  this.controlEnabled = false;

  // On lance l'event _initPointerLock pour checker le clic dans la scène
  this._initPointerLock();
};

Player.prototype = {
  _initPointerLock: function () {
    var _this = this;

    // Requete pour la capture du pointeur
    var canvas = this.game.scene.getEngine().getRenderingCanvas();
    canvas.addEventListener("click", function (evt) {
      canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
      if (canvas.requestPointerLock) {
        canvas.requestPointerLock();
      }
    }, false);

    // Evenement pour changer le paramètre de rotation
    var pointerlockchange = function (event) {
      _this.controlEnabled = (document.mozPointerLockElement === canvas || document.webkitPointerLockElement === canvas || document.msPointerLockElement === canvas || document.pointerLockElement === canvas);
      if (!_this.controlEnabled) {
        _this.rotEngaged = false;
      } else {
        _this.rotEngaged = true;
      }
    };

    // Event pour changer l'état du pointeur, sous tout les types de navigateur
    document.addEventListener("pointerlockchange", pointerlockchange, false);
    document.addEventListener("mspointerlockchange", pointerlockchange, false);
    document.addEventListener("mozpointerlockchange", pointerlockchange, false);
    document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
  },
  _initCamera: function (scene, canvas) {
    // On crée la caméra
    this.camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 5, 0), scene);

    // Axe de mouvement X et Z
    this.camera.keysUp = [90];
    this.camera.keysDown = [83];
    this.camera.keysLeft = [81];
    this.camera.keysRight = [68];

    // Si le joueur est en vie ou non
    this.isAlive = true;

    // Collisions
    this.camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
    this.camera.checkCollisions = true;
    this.camera.ellipsoid.checkCollisions = true;
    console.log(this.camera);

    // Gravity
    this.camera.applyGravity = true;

    // Speed
    this.camera.speed = 0.4;

    // Jump & Run
    var canJump = true;
    var _self = this;
    window.addEventListener("keyup", function (e) {
      switch (event.keyCode) {
        case 32:
          if (canJump) {
            cameraJump();
            canJump = false;
            let wait = setTimeout(function () {
              canJump = true;
            }, 1000)
          }
          break;
        case 16:
          _self.camera.speed = 0.4;
          break;
      }
    }, false);

    window.addEventListener("keydown", function (e) {
      switch (event.keyCode) {
        case 16:
          _self.camera.speed = 1;
          break;
      }
    }, false);

    var cameraJump = function () {
      var cam = scene.cameras[0];
      cam.animations = [];
      var a = new BABYLON.Animation("a", "position.y", 350, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

      // Animation keys
      var keys = [];
      keys.push({
        frame: 0,
        value: cam.position.y
      });
      keys.push({
        frame: 50,
        value: cam.position.y + 5
      });
      keys.push({
        frame: 300,
        value: cam.position.y
      });
      a.setKeys(keys);

      var easingFunction = new BABYLON.CircleEase();
      easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
      a.setEasingFunction(easingFunction);

      cam.animations.push(a);
      scene.beginAnimation(cam, 0, 350, false);
    }

    this.camera.attachControl(canvas, false);
  }
};
