Weapons = function (Player) {
  var _this = this;
  // On permet d'accéder à Player n'importe où dans Weapons
  this.Player = Player;

  // Positions selon l'arme non utilisée
  this.bottomPosition = new BABYLON.Vector3(0.6, -2, 1.6);

  // Changement de Y quand l'arme est séléctionnée
  this.topPositionY = -0.5;

  // Créons notre arme
  this.rocketLauncher = null;

  BABYLON.SceneLoader.ImportMesh(["WeaponBox"], "./assets/models/weapon/", "Weapon.gltf", Player.game.scene, function (meshes, particleSystems, skeletons) {
    meshes.forEach(mesh => {
      if (mesh.id == 'WeaponBox') {
        mesh.rotationQuaternion = null;
        mesh.checkCollisions = false;
        mesh.isPickable = false;
        _this.rocketLauncher = mesh;
        _this.rocketLauncher.parent = Player.playerBox;
        _this.rocketLauncher.position = new BABYLON.Vector3(0, -0.5, 1);
        _this.rocketLauncher.rotation.y = degToRad(90);
      }
    });
  });

  // Cadence de tir
  this.fireRate = 100;

  // Delta de calcul pour savoir quand le tir est a nouveau disponible
  this._deltaFireRate = this.fireRate;

  // Variable qui va changer selon le temps
  this.canFire = true;

  // Variable qui changera à l'appel du tir depuis le Player
  this.launchBullets = false;

  // Engine va nous être utile pour la cadence de tir
  var engine = this.Player.game.scene.getEngine();

  this.Player.game.scene.registerBeforeRender(function () {
    if (!_this.canFire) {
      _this._deltaFireRate -= engine.getDeltaTime();
      if (_this._deltaFireRate <= 0 && _this.Player.isAlive) {
        _this.canFire = true;
        _this._deltaFireRate = _this.fireRate;
      }
    }
  });

};

Weapons.prototype = {
  fire: function (pickInfo) {
    this.launchBullets = true;
  },
  stopFire: function (pickInfo) {
    this.launchBullets = false;
  },
  launchFire: function () {
    if (this.canFire) {
      var renderWidth = this.Player.game.engine.getRenderWidth(true);
      var renderHeight = this.Player.game.engine.getRenderHeight(true);

      var direction = this.Player.game.scene.pick(renderWidth / 2, renderHeight / 2);
      if (direction.pickedPoint !== null) {
        direction = direction.pickedPoint.subtractInPlace(this.Player.playerBox.absolutePosition);
        direction = direction.normalize();
      }

      this.createRocket(this.Player.playerBox, direction);
      this.canFire = false;
      let piou = new BABYLON.Sound("piou", "./assets/sounds/piou.wav", this.Player.game.scene, null, {
        loop: false,
        autoplay: true
      });
    } else {
      // Nothing to do : cannot fire
    }
  },
  createRocket: function (playerPosition, direction) {
    var positionValue = this.rocketLauncher.absolutePosition.clone();
    var rotationValue = playerPosition.rotation;
    var newRocket = BABYLON.Mesh.CreateBox("rocket", 1, this.Player.game.scene);
    newRocket.direction = new BABYLON.Vector3(
      Math.sin(rotationValue.y) * Math.cos(this.Player.head.rotation.x),
      Math.sin(-this.Player.head.rotation.x),
      Math.cos(rotationValue.y) * Math.cos(this.Player.head.rotation.x)
    )
    newRocket.position = new BABYLON.Vector3(
      positionValue.x + (newRocket.direction.x),
      positionValue.y + (newRocket.direction.y + 0.5),
      positionValue.z + (newRocket.direction.z));
    newRocket.rotation = new BABYLON.Vector3(this.Player.head.rotation.x, rotationValue.y, rotationValue.z);
    newRocket.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
    newRocket.isPickable = false;

    newRocket.material = new BABYLON.StandardMaterial("textureWeapon", this.Player.game.scene);
    newRocket.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
    newRocket.material.alpha = 0.15;

    // On donne accès à Player dans registerBeforeRender
    var Player = this.Player;

    newRocket.registerAfterRender(function () {
      var bulletSpeed = 50;

      newRocket.material.alpha = 1;
      var rayRocket = new BABYLON.Ray(newRocket.position, newRocket.direction);
      // On bouge la roquette vers l'avant
      newRocket.translate(new BABYLON.Vector3(0, 0, bulletSpeed), 1, 0);

      // On crée un rayon qui part de la base de la roquette vers l'avant

      // On regarde quel est le premier objet qu'on touche
      var meshFound = newRocket.getScene().pickWithRay(rayRocket);

      if (!meshFound || meshFound.distance < bulletSpeed) {
        // On vérifie qu'on a bien touché quelque chose
        if (meshFound.pickedMesh) {
          // Create mesh impact
          let braw = new BABYLON.Sound("braw", "./assets/sounds/braw.wav", Player.game.scene, null, {
            loop: false,
            autoplay: true
          });
          var impactMesh = BABYLON.Mesh.CreateBox("impact", 0.1, Player.game.scene);
          impactMesh.material = new BABYLON.StandardMaterial("textureImpact", Player.game.scene);
          impactMesh.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
          impactMesh.isPickable = false;
          impactMesh.position = meshFound.pickedPoint;
          impactMesh.rotation = newRocket.rotation;
          // var waitImpactDispose = setTimeout(function () {
          //   impactMesh.dispose();
          // }, 5000);
          newRocket.dispose();
        }
      }
    })
  },
  weaponScope: function (Player, state) {
    if (state) {
      Player.game.scene.meshes.forEach(mesh => {
        if (mesh.name === 'WeaponBox') {
          mesh.position.y = -0.5;
        }
      });

    } else {
      Player.game.scene.meshes.forEach(mesh => {
        if (mesh.name === 'WeaponBox') {
          // mesh.position.y = -0.25;
        }
      })
    }
  }
};
