Arena = function (game) {
  // Init var
  this.game = game;
  var scene = game.scene;

  // Create main light
  var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 10, 10), scene);
  light.intensity = 1;

  /*
  // Create sphere
  var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);
  sphere.position.y = 1;

  // Create ground
  var ground = BABYLON.Mesh.CreateGround('ground1', 20, 20, 2, scene);
  // Ground Texture
  var materialGround = new BABYLON.StandardMaterial("groundTexture", scene);
  materialGround.diffuseTexture = new BABYLON.Texture("assets/images/grass.jpg", scene);
  materialGround.diffuseTexture.uScale = 4.0;
  materialGround.diffuseTexture.vScale = 4.0;
  ground.material = materialGround;

  // Create cube
  var mainBox = BABYLON.Mesh.CreateBox("box1", 20, scene);
  mainBox.scaling.y = 200;
  mainBox.scaling.x = 5;
  mainBox.position = new BABYLON.Vector3(55, 1, 55);
  mainBox.rotation.y = (Math.PI * 45) / 180;
  mainBox.checkCollisions = true;

    // Cube texture
    var materialBox = new BABYLON.StandardMaterial("boxTexture", scene);
    materialBox.diffuseTexture = new BABYLON.Texture("assets/images/brick.jpg", scene);
    mainBox.material = materialBox;

    // Clone cube
    var mainBox2 = mainBox.clone("box2");
    mainBox2.scaling.y = 2;
    mainBox2.position = new BABYLON.Vector3(5, ((3 / 2) * mainBox2.scaling.y), -5);

    var mainBox3 = mainBox.clone("box3");
    mainBox3.scaling.y = 3;
    mainBox3.position = new BABYLON.Vector3(-5, ((3 / 2) * mainBox3.scaling.y), -5);

    var mainBox4 = mainBox.clone("box4");
    mainBox4.scaling.y = 4;
    mainBox4.position = new BABYLON.Vector3(-5, ((3 / 2) * mainBox4.scaling.y), 5);


    // Create cylinder
    var cylinder = BABYLON.Mesh.CreateCylinder("cyl1", 20, 5, 5, 20, 4, scene);
    cylinder.position.y = 20 / 2;

    // Cylinder texture
    cylinder.material = materialBox; */

}
