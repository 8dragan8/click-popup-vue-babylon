import "@babylonjs/loaders/glTF";
import {
  Engine,
  Scene,
  AssetsManager,
  ArcRotateCamera,
  Vector3,
  // CubeTexture,
  // MeshBuilder,
  // StandardMaterial,
  // Texture,
  // FreeCamera,
  // PBRMaterial,
  Color3,
  HemisphericLight,
  // ShadowGenerator,
  // DirectionalLight
} from "@babylonjs/core/Legacy/legacy";
import centerOfMeshesArray from "../methods/centerOfMeshesArray";
const scene = {
  engine: null,
  scene: null,
  renderLoop: null,
  modelUrl: null,

  destroyScene: function () {
    // if (this.scene) this.scene.debugLayer.hide();
    if (this.engine) this.engine.stopRenderLoop();
    this.engine = null;
    this.scene = null;
    this.renderLoop = null;
    this.modelUrl = null;
  },

  updateScene: function (canvas, modelUrl) {
    if (modelUrl != null) {
      if (this.modelUrl != modelUrl.href) {
        this.destroyScene();
        this.createScene(canvas, modelUrl);
      }
    }
  },
  createScene: function (canvas) {
    const engine = new Engine(canvas);
    const scene = new Scene(engine);
    const babylonAssetManager = new AssetsManager(scene);

    this.engine = engine;
    this.scene = scene;
    this.scene.clearColor = new Color3.Black();

    this.scene.createDefaultEnvironment({
      createGround: false,
      createSkybox: false,
    });

    this.modelUrl = "/3dModels/cropped_down_Louvre.glb";

    scene.debugLayer.show();
    scene.debugLayer.setAsActiveScene();

    let glbTask = babylonAssetManager.addMeshTask("glbTask", "", this.modelUrl);

    let assetManager = babylonAssetManager.load();

    babylonAssetManager.onFinish = (task) => {
      switch (task[0]._isCompleted) {
        case true:
          console.log(`Success loading:`, task[0], assetManager);
          break;
        case false:
          console.log(`Error loading:`, task[0]._errorObject.message);
          break;
      }
    };

    const camera = new ArcRotateCamera(
      "camera1",
      1.2 * Math.PI,
      0.45 * Math.PI,
      100,
      new Vector3.Zero(),
      scene
    );
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, true);

    camera.maxZ = 10000;
    camera.minZ = 0.1;
    camera.upperRadiusLimit = 10000;
    // camera.lowerBetaLimit = 0;
    // camera.upperBetaLimit = Math.PI *2;
    camera.wheelDeltaPercentage = 0.01;

    let hemLight = new HemisphericLight("hem01", Vector3.Up(), scene);
    hemLight.intensity = 0.35;

    glbTask.onSuccess = (task) => {
      let meshes = task.loadedMeshes;

      let meshData = null;
      for (let i = 0; i < meshes.length; i++) {
        const mesh = meshes[i];
        let meshName = mesh.name;
        if (meshName == "1A_BODY_primitive0")
          meshData = centerOfMeshesArray(mesh.parent.getChildren());
      }
      camera.setTarget(meshData);
    };

    this.renderLoop = engine.runRenderLoop(() => {
      scene.render();
    });
  },
};

export { scene };
