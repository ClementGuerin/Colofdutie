Weapons = function (Player) {
  var _this = this;
  // On permet d'accéder à Player n'importe où dans Weapons
  this.Player = Player;

  // Positions selon l'arme non utilisée
  this.bottomPosition = new BABYLON.Vector3(0.6, -2, 1.6);

  // Changement de Y quand l'arme est séléctionnée
  this.topPositionY = -0.5;

  // Créons notre arme
  this.rocketLauncher = this.newWeapon(Player);

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
  newWeapon: function (Player) {
    var newWeapon;
    newWeapon = BABYLON.Mesh.CreateBox('rocketLauncher', 0.5, Player.game.scene);

    // Nous faisons en sorte d'avoir une arme d'apparence plus longue que large
    newWeapon.scaling = new BABYLON.Vector3(0.5, 0.5, 2);

    // On l'associe à la caméra pour qu'il bouge de la même facon
    newWeapon.parent = Player.camera;

    // On positionne le mesh APRES l'avoir attaché à la caméra
    newWeapon.position = this.bottomPosition.clone();
    newWeapon.position.y = this.topPositionY;

    // Ajoutons un material Rouge pour le rendre plus visible
    var materialWeapon = new BABYLON.StandardMaterial('rocketLauncherMat', Player.game.scene);
    materialWeapon.diffuseColor = new BABYLON.Color3(1, 0, 0);
    materialWeapon.backFaceCulling = true;

    newWeapon.material = materialWeapon;

    return newWeapon
  },
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
        direction = direction.pickedPoint.subtractInPlace(this.Player.camera.position);
        direction = direction.normalize();
      }

      this.createRocket(this.Player.camera.playerBox);
      this.canFire = false;
    } else {
      // Nothing to do : cannot fire
    }
  },
  createRocket: function (playerPosition, direction) {
    var positionValue = this.rocketLauncher.absolutePosition.clone();
    var rotationValue = playerPosition.rotation;
    var newRocket = BABYLON.Mesh.CreateBox("rocket", 1, this.Player.game.scene);
    newRocket.direction = new BABYLON.Vector3(
      Math.sin(rotationValue.y) * Math.cos(rotationValue.x),
      Math.sin(-rotationValue.x),
      Math.cos(rotationValue.y) * Math.cos(rotationValue.x)
    )
    newRocket.position = new BABYLON.Vector3(
      positionValue.x + (newRocket.direction.x * 1),
      positionValue.y + (newRocket.direction.y * 1),
      positionValue.z + (newRocket.direction.z * 1));
    newRocket.rotation = new BABYLON.Vector3(rotationValue.x, rotationValue.y, rotationValue.z);
    newRocket.scaling = new BABYLON.Vector3(0.1, 0.1, 01);
    newRocket.isPickable = false;

    newRocket.material = new BABYLON.StandardMaterial("textureWeapon", this.Player.game.scene);
    newRocket.material.diffuseColor = new BABYLON.Color3(1, 1, 1);

    // On donne accès à Player dans registerBeforeRender
    var Player = this.Player;

    newRocket.registerAfterRender(function () {
      // On bouge la roquette vers l'avant
      newRocket.translate(new BABYLON.Vector3(0, 0, 1), 1, 0);

      // On crée un rayon qui part de la base de la roquette vers l'avant
      var rayRocket = new BABYLON.Ray(newRocket.position, newRocket.direction);

      // On regarde quel est le premier objet qu'on touche
      var meshFound = newRocket.getScene().pickWithRay(rayRocket);

      // Si la distance au premier objet touché est inférieure a 10, on détruit la roquette
      if (!meshFound || meshFound.distance < 10) {
        newRocket.dispose();
      }

      if (!meshFound || meshFound.distance < 10) {
        // On vérifie qu'on a bien touché quelque chose
        if (meshFound.pickedMesh) {
          // On crée une sphere qui représentera la zone d'impact
          var explosionRadius = BABYLON.Mesh.CreateSphere("sphere", 5.0, 5, Player.game.scene);
          // On positionne la sphère là où il y a eu impact
          explosionRadius.position = meshFound.pickedPoint;
          // On fait en sorte que les explosions ne soient pas considérées pour le Ray de la roquette
          explosionRadius.isPickable = false;
          // On crée un petit material orange
          explosionRadius.material = new BABYLON.StandardMaterial("textureExplosion", Player.game.scene);
          explosionRadius.material.diffuseColor = new BABYLON.Color3(1, 0.058, 0.058);
          explosionRadius.material.specularColor = new BABYLON.Color3(0, 0, 0);
          explosionRadius.material.alpha = 0.3;
          explosionRadius.material.backFaceCulling = false;

          // Chaque frame, on baisse l'opacité et on efface l'objet quand l'alpha est arrivé à 0
          explosionRadius.registerAfterRender(function () {
            explosionRadius.material.alpha -= 0.02;
            if (explosionRadius.material.alpha <= 0) {
              explosionRadius.dispose();
            }
          });
        }
        newRocket.dispose();
      }
    })
  }
};
