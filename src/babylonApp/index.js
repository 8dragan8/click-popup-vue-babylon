import "@babylonjs/loaders/glTF";
import {
  Engine,
  Scene,
  Vector3,
  HemisphericLight,
  AxesViewer,
} from "@babylonjs/core/Legacy/legacy";
import centerOfMeshesArray from "../methods/centerOfMeshesArray";
import MouseHandler from "../methods/MouseHandler";
import meshSort from "../methods/meshSort";
import RegisterMaterials from "@bMat";

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

    this._windows = [];

    this._engine = new Engine(this._canvas);
    this._scene = new Scene(this._engine);
    this._babylonAssetManager = new AppAssets(this._scene);

    // this._scene.clearColor = new Color3.Black();

    this._scene.createDefaultEnvironment({
      createGround: false,
      createSkybox: false,
    });
    new AxesViewer(this._scene, 10);

    this._camera = new MainArcCamera(this._scene, this._canvas);

    let hemLight = new HemisphericLight("hem01", Vector3.Up(), this._scene);
    hemLight.intensity = 0.35;
    RegisterMaterials(this._scene);
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
    let meshData = null;

    let rootAxes = new AxesViewer(this._scene, 5);

    let rootNode = this._scene.getNodeByID("__root__");
    rootAxes.xAxis.parent = rootNode;
    rootAxes.yAxis.parent = rootNode;
    rootAxes.zAxis.parent = rootNode;
    console.log(
      "🚀 ~ file: index.js ~ line 76 ~ BabylonApp ~ _onLoadedGLB ~ rootNode",
      rootNode
    );
    let windowIndex = 3;

    for (let i = 0; i < meshes.length; i++) {
      const mesh = meshes[i];
      let meshNameArray = mesh.name.split("_");
      if (
        meshSort.isBody(mesh) ||
        meshSort.isPool(mesh) ||
        meshSort.isWater(mesh)
      ) {
        mesh.isVisible = false;
        if (meshNameArray.includes("primitive0"))
          meshData = centerOfMeshesArray(mesh.parent.getChildren());
      } else if (meshSort.isWindow(mesh) && i < 3) {
        let newMesh = new Window(this._scene, mesh);
        this._windows.push(newMesh);
        // this._camera.setTarget(newMesh.meshCenter);
      } else if (meshSort.isWindow(mesh)) {
        mesh.dispose();
      }
      // mesh.parent = null;
    }
    console.log(meshes[0].getHierarchyBoundingVectors(true, false));

    // this._camera.parent = rootNode;
    // this._camera.setTarget(meshData);
    let interactiveWindow = this._windows[windowIndex];

    this._onClick = () => {
      interactiveWindow._toggleMaterials();
    };
    this._onDblClick = () => {
      // interactiveWindow._addSphereToTheCenter();
      this._camera._moveCamera(
        interactiveWindow.meshCenter,
        interactiveWindow.CameraRotation
      );
    };

    // MouseHandler(this._scene, {
    //   onClick: this._onClick,
    //   onDblClick: this._onDblClick,
    // });
  }
}
