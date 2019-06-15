Arena = function (game) {
  // Init var
  this.game = game;
  var scene = game.scene;

  // Create Skybox
  var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {
    size: 1000.0
  }, scene);
  var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./assets/images/skybox", scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skybox.material = skyboxMaterial;

  // Création de notre lumière principale
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 10, 0), scene);
  var light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0, -1, 0), scene);
  light2.intensity = 0.8;

  // // Material pour le sol
  // var ground = BABYLON.MeshBuilder.CreateGround("ground", {
  //   width: 50,
  //   height: 50,
  //   subdivisions: 4
  // }, scene);

  // var materialGround = new BABYLON.StandardMaterial("wallTexture", scene);
  // materialGround.diffuseTexture = new BABYLON.Texture("assets/images/grass.jpg", scene);
  // materialGround.diffuseTexture.uScale = 8.0;
  // materialGround.diffuseTexture.vScale = 8.0;
  // ground.material = materialGround;
  // ground.checkCollisions = true;


}
