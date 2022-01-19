import "@babylonjs/loaders/glTF";
import {
  Engine,
  Scene,
  Vector3,
  HemisphericLight,
  AxesViewer,
  MeshBuilder,
  MotionBlurPostProcess,
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

    this._pickSphere = null;

    this._currentHoveredMesh = null;
    this._lastHoveredMesh = null;

    this._currentSelectedMesh = null;
    this._lastSelectedMesh = null;

    this._appStatus = "start";

    this._scene.createDefaultEnvironment({
      createGround: false,
      createSkybox: false,
    });
    // new AxesViewer(this._scene, 10);

    this._camera = new MainArcCamera(this._scene, this._canvas);

    let hemLight = new HemisphericLight("hem01", Vector3.Up(), this._scene);
    hemLight.intensity = 0.35;
    RegisterMaterials(this._scene);
    this._addKeyDownListener();
    this._loadAssets();
  }
  _pauseApp() {
    this._appStatus = "pause";
  }
  _startApp() {
    this._appStatus = "play";
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

    // let rootAxes = new AxesViewer(this._scene, 5);

    let rootNode = this._scene.getNodeByID("__root__");
    // rootAxes.xAxis.parent = rootNode;
    // rootAxes.yAxis.parent = rootNode;
    // rootAxes.zAxis.parent = rootNode;
    // console.log(
    //   "🚀 ~ file: index.js ~ line 76 ~ BabylonApp ~ _onLoadedGLB ~ rootNode",
    //   rootNode
    // );
    // let windowIndex = 30;

    for (let i = 0; i < meshes.length; i++) {
      const mesh = meshes[i];
      let meshNameArray = mesh.name.split("_");
      if (
        meshSort.isBody(mesh) ||
        meshSort.isPool(mesh) ||
        meshSort.isWater(mesh)
      ) {
        // mesh.isVisible = false;
        if (meshNameArray.includes("primitive0"))
          meshData = centerOfMeshesArray(mesh.parent.getChildren());
      } else if (meshSort.isWindow(mesh)) {
        let newMesh = new Window(this._scene, mesh);
        this._windows.push(newMesh);
        // this._camera.setTarget(newMesh.meshCenter);
      } else if (meshSort.isWindow(mesh)) {
        mesh.dispose();
      }
      // mesh.parent = null;
    }
    // console.log(meshes[0].getHierarchyBoundingVectors(true, false));

    // this._camera.parent = rootNode;
    this._camera.setTarget(meshData);

    this._onClick = () => {
      // interactiveWindow._toggleMaterials();
      this._handleSuiteSelect();
    };
    this._onDblClick = () => {
      this._handleSuiteSelect();
      // interactiveWindow._addSphereToTheCenter();
      if (this._currentHoveredMesh) {
        let targetMesh = this._scene.getMeshByName(this._currentHoveredMesh);
        if (targetMesh) {
          // this._camera.parent = targetMesh;
          // this.onShowIframe("load-iframe");
          this.sweepInHandler(targetMesh.meshCenter, targetMesh.CameraRotation);
        }
      }
    };

    this.handleSuiteHover();

    MouseHandler(this._scene, {
      onClick: this._onClick,
      onDblClick: this._onDblClick,
    });
  }
  _handleSuiteSelect() {
    this._lastSelectedMesh = this._currentSelectedMesh;
    this._currentSelectedMesh = this._currentHoveredMesh;
  }
  handleSuiteHover() {
    // this._pickSphere = this.createPickSphere(1);
    // let usefulMesh = [];

    this._scene.onBeforeRenderObservable.add(() => {
      this._resetMeshesMaterialsOnHover();
      this._resetMeshesMaterialsOnSelect();

      let pickInfo = this._scene.pick(
        this._scene.pointerX,
        this._scene.pointerY
      );
      if (pickInfo.hit) {
        // this._pickSphere.position = pickInfo.pickedPoint;
        if (pickInfo.pickedMesh) {
          let pickedMesh = pickInfo.pickedMesh;
          if (pickedMesh instanceof Window) {
            if (this._currentHoveredMesh != pickedMesh.name) {
              // console.log(
              //   "pickedMesh",
              //   pickInfo,
              //   this._camera.position,
              //   pickedMesh
              // );
              this._lastHoveredMesh = this._currentHoveredMesh;
              this._currentHoveredMesh = pickedMesh.name;
            }
          } else {
            this._lastHoveredMesh = this._currentHoveredMesh;
            this._currentHoveredMesh = null;
          }
        } else {
          this._lastHoveredMesh = this._currentHoveredMesh;
          this._currentHoveredMesh = null;
        }
      } else {
        this._lastHoveredMesh = this._currentHoveredMesh;
        this._currentHoveredMesh = null;
      }
    });
  }
  _resetMeshesMaterialsOnHover() {
    if (this._lastHoveredMesh) {
      if (this._currentSelectedMesh != this._lastHoveredMesh) {
        this._scene.getMeshByName(this._lastHoveredMesh)._resetMaterial();
      }
    }
    if (this._currentHoveredMesh) {
      if (this._currentSelectedMesh != this._currentHoveredMesh) {
        this._scene
          .getMeshByName(this._currentHoveredMesh)
          ._highlightAvailable();
      }
    }
  }
  _resetMeshesMaterialsOnSelect() {
    if (this._lastSelectedMesh) {
      this._scene.getMeshByName(this._lastSelectedMesh)._resetMaterial();
    }
    if (this._currentSelectedMesh) {
      this._scene
        .getMeshByName(this._currentSelectedMesh)
        ._highlightAvailable();
    }
  }
  createPickSphere(diameter = 0.5) {
    let sphere = MeshBuilder.CreateSphere(
      "pick sphere",
      { diameter },
      this._scene
    );
    sphere.isPickable = false;
    sphere.material = this._scene.getMaterialByName("RedMaterial");

    sphere.material.backFaceCulling = false;

    return sphere;
  }
}
