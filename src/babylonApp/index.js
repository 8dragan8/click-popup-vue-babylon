import "@babylonjs/loaders/glTF";
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  BoundingInfo,
  CubeTexture,
  MeshBuilder,
  StandardMaterial,
  Texture,
  FreeCamera,
  PBRMaterial,
  Color3,
  HemisphericLight,
  ShadowGenerator,
  DirectionalLight,
} from "@babylonjs/core/Legacy/legacy";
import centerOfMeshesArray from "../methods/centerOfMeshesArray";
import moveCamera from "@b/animations/AnimaterPointToPoint";

import findMeshCenter from "../methods/findMeshCenter";
import Window from "@bMesh/window";
import { AppAssets } from "@bHelper/AppAssets";

export default class BabylonApp {
  constructor(canvas) {
    this._engine = null;
    this._scene = null;
    this._camera = null;
    this._renderLoop = null;
    this._canvas = canvas;

    this._window = null;

    this._engine = new Engine(this._canvas);
    this._scene = new Scene(this._engine);
    this._babylonAssetManager = new AppAssets(this._scene);

    // this._scene.clearColor = new Color3.Black();

    this._scene.createDefaultEnvironment({
      createGround: false,
      createSkybox: false,
    });

    this._createCamera();

    let hemLight = new HemisphericLight("hem01", Vector3.Up(), this._scene);
    hemLight.intensity = 0.35;

    this._addKeyDownListener();
    this._loadAssets();
  }
  _createCamera() {
    const camera = new ArcRotateCamera(
      "camera1",
      1.2 * Math.PI,
      0.45 * Math.PI,
      100,
      new Vector3.Zero(),
      this._scene
    );
    camera.setTarget(Vector3.Zero());
    camera.attachControl(this._canvas, true);

    camera.maxZ = 10000;
    camera.minZ = 0.1;
    camera.upperRadiusLimit = 10000;
    // camera.lowerBetaLimit = 0;
    // camera.upperBetaLimit = Math.PI *2;
    camera.wheelDeltaPercentage = 0.01;
    this._camera = camera;
  }

  _loadAssets() {
    this._babylonAssetManager._addTaskOnSuccess((task) =>
      this._onLoadedGLB(task)
    );
    this._babylonAssetManager.load();
  }

  _toggleInspector() {
    if (this._scene.debugLayer.isVisible()) {
      this._scene.debugLayer.hide();
    } else {
      this._scene.debugLayer.show();
    }
  }

  _addKeyDownListener() {
    window.addEventListener("keydown", (e) => {
      // hide/show the Inspector
      // Shift+Ctrl+Alt+I
      if (e.shiftKey && e.ctrlKey && e.altKey && e.key === "I") {
        this._toggleInspector();
      }
    });
  }
  _onLoadedGLB(task) {
    let meshes = task.loadedMeshes;
    let cameraTarget = null;
    let meshData = null;
    for (let i = 0; i < meshes.length; i++) {
      const mesh = meshes[i];
      let meshName = mesh.name;
      if (meshName == "1A_BODY_primitive0")
        meshData = centerOfMeshesArray(mesh.parent.getChildren());
      if (meshName == "1A_4044_glazing") {
        this._window = new Window(this._scene, mesh);

        let centerSphere = new MeshBuilder.CreateSphere(
          "centerSphere",
          {},
          this._scene
        );

        cameraTarget = findMeshCenter(mesh);
        centerSphere.position = cameraTarget;
      }
    }
    this._camera.setTarget(meshData);

    this._scene.onPointerUp = () => {
      this._window._toggleMaterials();
      moveCamera(this._scene, {
        alpha: 1 * Math.PI,
        beta: 0.45 * Math.PI,
        radius: 40,
        target: cameraTarget,
      });
    };
  }
}
