import { AssetsManager } from "@babylonjs/core/Legacy/legacy";

export class AppAssets extends AssetsManager {
  constructor(scene, engine) {
    super(scene);
    this._engine = engine;
    this._scene = scene;
    this._modelUrl = "/3dModels/cropped_down_Louvre.glb";

    this._glbTask = this.addMeshTask("glbTask", "", this._modelUrl);
  }

  onFinish(task) {
    switch (task[0]._isCompleted) {
      case true:
        if (task[0]._errorObject != undefined) {
          console.log(`Error loading:`, task[0]._errorObject.message);
        } else {
          console.log(`Success loading:`, task[0]);
          console.log(
            "🚀 ~ file: default.js ~ line 36 ~ AppAssets ~ task",
            task
          );
          this._engine.runRenderLoop(() => {
            this._scene.render();
          });
        }
        break;
      case false:
        console.log(`Error loading:`, task[0]._errorObject.message);
        break;
    }
  }
  onProgress(remainingCount, totalCount) {
    console.log(
      "We are loading the scene. " +
        remainingCount +
        " out of " +
        totalCount +
        " items still need to be loaded."
    );
  }

  _addTaskOnSuccess(cb) {
    this._glbTask.onSuccess = cb;
  }
}
