import "@babylonjs/loaders/glTF";
import {
  Engine,
  Scene,
  Vector3,
  MeshBuilder,
  HemisphericLight,
} from "@babylonjs/core/Legacy/legacy";
import centerOfMeshesArray from "../methods/centerOfMeshesArray";
import MouseHandler from "../methods/MouseHandler";
import findMeshCenter from "../methods/findMeshCenter";

import Window from "@bMesh/window";
import MainArcCamera from "@bMesh/MainArcCamera";
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

    this._camera = new MainArcCamera(this._scene, this._canvas);

    let hemLight = new HemisphericLight("hem01", Vector3.Up(), this._scene);
    hemLight.intensity = 0.35;

    this._addKeyDownListener();
    this._loadAssets();
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

    this._onClick = () => {
      this._window._toggleMaterials();
    };
    this._onDblClick = () => {
      this._camera._moveCamera(cameraTarget, this._window.CameraRotation);
    };

    MouseHandler(this._scene, {
      onClick: this._onClick,
      onDblClick: this._onDblClick,
    });
  }
}
