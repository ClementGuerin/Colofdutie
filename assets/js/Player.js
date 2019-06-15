Player = function (game, canvas) {
  var _this = this;

  // Le jeu, chargé dans l'objet Player
  this.game = game;

  // Vitesse de base
  this.speed = 0.1;

  // Si le tir est activée ou non
  this.weponShoot = false;

  // On désactive les contrôles par défaut de la camera
  this.axisMovement = [false, false, false, false];

  // Actions quand on appuis sur une touche
  window.addEventListener("keydown", function (evt) {
    switch (evt.keyCode) {
      case 90:
        _this.camera.axisMovement[0] = true;
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
  }, false);

  // Actions quand on relache sur une touche
  window.addEventListener("keyup", function (evt) {

    switch (evt.keyCode) {
      case 90:
        _this.camera.axisMovement[0] = false;
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

  // Détection des mouvements de la souris
  this.angularSensibility = 260;
  // Quand la souris bouge dans la scène
  window.addEventListener("mousemove", function (evt) {
    if (_this.rotEngaged === true) {
      _this.camera.playerBox.rotation.y += evt.movementX * 0.001 * (_this.angularSensibility / 250);
      var nextRotationX = _this.camera.playerBox.rotation.x + (evt.movementY * 0.001 * (_this.angularSensibility / 250));
      if (nextRotationX < degToRad(90) && nextRotationX > degToRad(-90)) {
        _this.camera.playerBox.rotation.x += evt.movementY * 0.001 * (_this.angularSensibility / 250);
      }
    }
  }, false);

  // On récupère le canvas de la scène
  var canvas = this.game.scene.getEngine().getRenderingCanvas();

  // On affecte le clic et on vérifie qu'il est bien utilisé dans la scène (_this.controlEnabled)
  canvas.addEventListener("mousedown", function (evt) {
    if (_this.controlEnabled && !_this.weponShoot) {
      _this.weponShoot = true;
      _this.handleUserMouseDown();
    }
  }, false);

  // On fait pareil quand l'utilisateur relache le clic de la souris
  canvas.addEventListener("mouseup", function (evt) {
    if (_this.controlEnabled && _this.weponShoot) {
      _this.weponShoot = false;
      _this.handleUserMouseUp();
    }
  }, false);

  // Le joueur doit cliquer dans la scène pour que controlEnabled soit changé
  this.controlEnabled = false;

  // On lance l'event _initPointerLock pour checker le clic dans la scène
  this._initPointerLock();


  // Init camera
  this._initCamera(this.game.scene, canvas);
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
    var playerBox = BABYLON.Mesh.CreateBox("headMainPlayer", 3, scene);
    playerBox.position = new BABYLON.Vector3(15, 5, 15);
    playerBox.ellipsoid = new BABYLON.Vector3(1.2, 2, 1.2);
    // On crée la caméra
    this.camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 0, 0), scene);
    this.camera.playerBox = playerBox
    this.camera.parent = this.camera.playerBox;

    // Ajout des collisions avec playerBox
    this.camera.playerBox.checkCollisions = true;
    this.camera.playerBox.applyGravity = true;

    // Si le joueur est en vie ou non
    this.isAlive = true;

    // Pour savoir que c'est le joueur principal
    this.camera.isMain = true;

    // On crée les armes !
    this.camera.weapons = new Weapons(this);

    // On ajoute l'axe de mouvement
    this.camera.axisMovement = [false, false, false, false];

    var hitBoxPlayer = BABYLON.Mesh.CreateBox("hitBoxPlayer", 3, scene);
    hitBoxPlayer.parent = this.camera.playerBox;
    hitBoxPlayer.scaling.y = 2;
    hitBoxPlayer.isPickable = true;
    hitBoxPlayer.isMain = true;
  },
  _checkMove: function (ratioFps) {
    let relativeSpeed = this.speed / ratioFps;
    if (this.camera.axisMovement[0]) {
      forward = new BABYLON.Vector3(
        parseFloat(Math.sin(parseFloat(this.camera.playerBox.rotation.y))) * relativeSpeed,
        0,
        parseFloat(Math.cos(parseFloat(this.camera.playerBox.rotation.y))) * relativeSpeed
      );
      this.camera.playerBox.moveWithCollisions(forward);
    }
    if (this.camera.axisMovement[1]) {
      backward = new BABYLON.Vector3(
        parseFloat(-Math.sin(parseFloat(this.camera.playerBox.rotation.y))) * relativeSpeed,
        0,
        parseFloat(-Math.cos(parseFloat(this.camera.playerBox.rotation.y))) * relativeSpeed
      );
      this.camera.playerBox.moveWithCollisions(backward);
    }
    if (this.camera.axisMovement[2]) {
      left = new BABYLON.Vector3(
        parseFloat(Math.sin(parseFloat(this.camera.playerBox.rotation.y) + degToRad(-90))) * relativeSpeed,
        0,
        parseFloat(Math.cos(parseFloat(this.camera.playerBox.rotation.y) + degToRad(-90))) * relativeSpeed
      );
      this.camera.playerBox.moveWithCollisions(left);
    }
    if (this.camera.axisMovement[3]) {
      right = new BABYLON.Vector3(
        parseFloat(-Math.sin(parseFloat(this.camera.playerBox.rotation.y) + degToRad(-90))) * relativeSpeed,
        0,
        parseFloat(-Math.cos(parseFloat(this.camera.playerBox.rotation.y) + degToRad(-90))) * relativeSpeed
      );
      this.camera.playerBox.moveWithCollisions(right);
    }
    this.camera.playerBox.moveWithCollisions(new BABYLON.Vector3(0, (-1.5) * relativeSpeed, 0));
  },
  handleUserMouseDown: function () {
    if (this.isAlive === true) {
      this.camera.weapons.fire();
    }
  },
  handleUserMouseUp: function () {
    if (this.isAlive === true) {
      this.camera.weapons.stopFire();
    }
  }
};
