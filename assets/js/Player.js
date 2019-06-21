Player = function (game, canvas) {
  var _this = this;

  // Le jeu, chargé dans l'objet Player
  this.game = game;

  // Vitesse de base
  this.speed = 0.2;

  // Si le tir est activée ou non
  this.weponShoot = false;

  // On désactive les contrôles par défaut de la camera
  this.axisMovement = [false, false, false, false];

  // Si le joueur peut sauter ou non
  this.canJump = true;

  // La hauteur de saut
  this.jumpHeight = 3.5;

  this.cameraView = 0;

  // Init camera
  this._initCamera(this.game.scene, canvas);

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
      case 16:
        _this.speed = 0.35;
        break;
      case 32:
        if (_this.canJump) {
          // On définit la hauteur de saut à la position actuelle du joueur
          // plus la variable jumpHeight
          _this.jumpNeed = _this.playerBox.position.y + _this.jumpHeight;
          _this.canJump = false;
        }
        break;
      case 86:
        if (_this.cameraView !== 2) {
          _this.cameraView++
        } else {
          _this.cameraView = 0;
        }
        switch (_this.cameraView) {
          case 0:
            _this.camera.position = new BABYLON.Vector3(0, 0, 0);
            _this.camera.rotation = new BABYLON.Vector3(0, 0, 0);
            document.querySelector('.crosshair').style.display = '';
            break;
          case 1:
            _this.camera.position = new BABYLON.Vector3(0, 0, -5);
            _this.camera.rotation = new BABYLON.Vector3(0, 0, 0);
            document.querySelector('.crosshair').style.display = 'none';
            break;
          case 2:
            _this.camera.position = new BABYLON.Vector3(0, 0, 10);
            _this.camera.rotation = new BABYLON.Vector3(0, degToRad(180), 0);
            document.querySelector('.crosshair').style.display = 'none';
            break;
        }
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
      case 16:
        _this.speed = 0.2;
        break;
    }
  }, false);

  // Détection des mouvements de la souris
  this.angularSensibility = 260;
  // Quand la souris bouge dans la scène
  window.addEventListener("mousemove", function (evt) {
    if (_this.rotEngaged === true) {
      _this.playerBox.rotation.y += evt.movementX * 0.001 * (_this.angularSensibility / 250);
      var nextRotationX = _this.head.rotation.x + (evt.movementY * 0.001 * (_this.angularSensibility / 250));
      if (nextRotationX < degToRad(90) && nextRotationX > degToRad(-90)) {
        _this.head.rotation.x += evt.movementY * 0.001 * (_this.angularSensibility / 250);
      }
    }
  }, false);

  // On récupère le canvas de la scène
  var canvas = this.game.scene.getEngine().getRenderingCanvas();

  // On affecte le clic et on vérifie qu'il est bien utilisé dans la scène (_this.controlEnabled)
  canvas.addEventListener("mousedown", function (evt) {
    switch (evt.which) {
      case 1:
        if (_this.controlEnabled && !_this.weponShoot) {
          _this.weponShoot = true;
          _this.handleUserMouseDown();
        }
        break;
      case 3:
        _this.camera.weapons.weaponScope(_this, true)
        break;
    }
  }, false);

  // On fait pareil quand l'utilisateur relache le clic de la souris
  canvas.addEventListener("mouseup", function (evt) {
    switch (evt.which) {
      case 1:
        if (_this.controlEnabled && _this.weponShoot) {
          _this.weponShoot = false;
          _this.handleUserMouseUp();
        }
        break;
      case 3:
        _this.camera.weapons.weaponScope(_this, false)
        break;
    }
  }, false);

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
    var _this = this;


    // On crée la caméra
    this.camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 1, 0), scene);
    // Split camera
    // this.camera2 = new BABYLON.FreeCamera("camera2", new BABYLON.Vector3(0, 1, 0), scene);
    // scene.activeCameras.push(this.camera);
    // scene.activeCameras.push(this.camera2);
    // this.camera.viewport = new BABYLON.Viewport(0, 0, 0.5, 1.0);
    // this.camera2.viewport = new BABYLON.Viewport(0.5, 0, 0.5, 1.0);
    // -------------------
    this.camera.ellipsoid = new BABYLON.Vector3(1.6, 1, 1.6);
    this.camera.weapons = new Weapons(_this);

    // Create playerBox
    this.playerBox = BABYLON.MeshBuilder.CreateBox("playerBox", {
      height: 2.41,
      width: 1.6,
      depth: 1.6
    }, scene);
    this.playerBox.position = new BABYLON.Vector3(0, 1.28, 0);
    let playerBoxMaterial = new BABYLON.StandardMaterial("playerBoxMaterial", scene);
    playerBoxMaterial.alpha = 0;
    this.playerBox.material = playerBoxMaterial;
    this.playerBox.applyGravity = true;
    this.originHeight = this.playerBox.position.clone();


    BABYLON.SceneLoader.ImportMesh(['PlayerModel'], "./assets/models/player/", "PlayerModelScene.gltf", scene, function (meshes) {
      meshes.forEach(mesh => {
        mesh.rotationQuaternion = null;
        // mesh.position = new BABYLON.Vector3(0, 0, 0);
        mesh.parent = _this.playerBox;
        switch (mesh.id) {
          case 'Head':
            _this.head = mesh;
            _this.head.position.y = 0.544;
            _this.camera.rotation = new BABYLON.Vector3(0, degToRad(0), 0);
            _this.camera.position.y -= 0.25;
            break;
          case 'Arm-Left':
            _this.armLeft = mesh;
            _this.armLeft.rotation.x = degToRad(-90);
            _this.armLeft.position.y = 0.15;
            break;
          case 'Arm-Right':
            _this.armRight = mesh;
            _this.armRight.rotation.x = degToRad(-90);
            _this.armRight.position.y = 0.15;
            break;
          case 'Chest':
            _this.chest = mesh;
            _this.chest.position.y = -0.08;
            break;
          case 'Leg-Left':
            _this.legLeft = mesh;
            _this.legLeft.position.y = -0.83;
            break;
          case 'Leg-Right':
            _this.legRight = mesh;
            _this.legRight.position.y = -0.83;
            break;
        }
      });
    });

    this.camera.parent = this.playerBox;

    // Render meshes
    scene.registerAfterRender(function () {
      if (_this.camera !== 'undefined' && typeof _this.head !== 'undefined' && typeof _this.playerBox !== 'undefined') {
        // _this.camera.position = _this.head.absolutePosition;
        _this.camera.rotation.x = _this.head.rotation.x
        // _this.camera.rotation.y = _this.playerBox.rotation.y
      }
    })

    // Si le joueur est en vie ou non
    this.isAlive = true;

    // On ajoute l'axe de mouvement
    this.camera.axisMovement = [false, false, false, false];
  },
  _checkMove: function (ratioFps) {
    var _this = this;
    let relativeSpeed = this.speed / ratioFps;
    if (this.camera.axisMovement[0]) {
      forward = new BABYLON.Vector3(
        parseFloat(Math.sin(parseFloat(this.playerBox.rotation.y))) * relativeSpeed,
        0,
        parseFloat(Math.cos(parseFloat(this.playerBox.rotation.y))) * relativeSpeed
      );
      this.playerBox.moveWithCollisions(forward);
    }
    if (this.camera.axisMovement[1]) {
      backward = new BABYLON.Vector3(
        parseFloat(-Math.sin(parseFloat(this.playerBox.rotation.y))) * relativeSpeed,
        0,
        parseFloat(-Math.cos(parseFloat(this.playerBox.rotation.y))) * relativeSpeed
      );
      this.playerBox.moveWithCollisions(backward);
    }
    if (this.camera.axisMovement[2]) {
      right = new BABYLON.Vector3(
        parseFloat(Math.sin(parseFloat(this.playerBox.rotation.y) + degToRad(-90))) * relativeSpeed,
        0,
        parseFloat(Math.cos(parseFloat(this.playerBox.rotation.y) + degToRad(-90))) * relativeSpeed
      );
      this.playerBox.moveWithCollisions(right);
    }
    if (this.camera.axisMovement[3]) {
      left = new BABYLON.Vector3(
        parseFloat(-Math.sin(parseFloat(this.playerBox.rotation.y) + degToRad(-90))) * relativeSpeed,
        0,
        parseFloat(-Math.cos(parseFloat(this.playerBox.rotation.y) + degToRad(-90))) * relativeSpeed
      );
      this.playerBox.moveWithCollisions(left);
    }
    // Si l'utilisateur saute
    if (this.jumpNeed) {
      // Lerp
      percentMove = this.jumpNeed - this.playerBox.position.y;
      // Axe de mouvement
      up = new BABYLON.Vector3(0, percentMove / 2 * relativeSpeed, 0);
      this.playerBox.moveWithCollisions(up);
      // On vérifie si le joueur a atteind la hauteur désiré
      var rayPlayer = new BABYLON.Ray(this.playerBox.position, new BABYLON.Vector3(0, 1, 0));
      var distPlayer = this.game.scene.pickWithRay(rayPlayer, function (item) {
        if (item.name == "Head" ||
          item.id == "Arm-Left" ||
          item.id == "Arm-Right" ||
          item.id == 'Chest' ||
          item.id == "Leg-Left" ||
          item.id == "Leg-Right" ||
          item.id == 'playerBox' ||
          item.id == "Weapon_primitive0" ||
          item.id == "Weapon_primitive1" ||
          item.id == "Weapon_primitive2" ||
          item.id == "WeaponBox")
          return false;
        else
          return true;
      });
      if (this.playerBox.position.y + 1 > this.jumpNeed || distPlayer.distance <= 0.8) {
        // Si c'est le cas, on prépare airTime
        this.airTime = 0;
        this.jumpNeed = false;
      }
    } else {
      // On trace un rayon depuis le joueur
      var rayPlayer = new BABYLON.Ray(this.playerBox.position, new BABYLON.Vector3(0, -1, 0));

      // On regarde quel est le premier objet qu'on touche
      // On exclue tout les mesh qui appartiennent au joueur
      var distPlayer = this.game.scene.pickWithRay(rayPlayer, function (item) {
        if (item.name == "Head" ||
          item.id == "Arm-Left" ||
          item.id == "Arm-Right" ||
          item.id == 'Chest' ||
          item.id == "Leg-Left" ||
          item.id == "Leg-Right" ||
          item.id == 'playerBox' ||
          item.id == "Weapon_primitive0" ||
          item.id == "Weapon_primitive1" ||
          item.id == "Weapon_primitive2" ||
          item.id == "WeaponBox")
          return false;
        else
          return true;
      });

      var targetHeight = this.originHeight.y;

      if (distPlayer.distance <= targetHeight) {
        if (!this.canJump) {
          _this.canJump = true;
        }
        this.airTime = 0;
      } else {
        this.airTime++;
        this.playerBox.moveWithCollisions(new BABYLON.Vector3(0, (-this.airTime / 20) * relativeSpeed, 0));
      }
    }
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
