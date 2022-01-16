import { AssetsManager, MeshAssetTask } from "@babylonjs/core/Legacy/legacy";

export class AppAssets extends AssetsManager {
  constructor(scene) {
    super(scene);
    this._modelUrl = "/3dModels/Louvre_just_object.glb";

    this._glbTask = new MeshAssetTask("glbTask", "", this._modelUrl);
    this._tasks.push(this._glbTask);
    console.log(
      "🚀 ~ file: AppAssets.js ~ line 12 ~ AppAssets ~ constructor ~ this",
      this
    );
  }

  onFinish(task) {
    switch (task[0]._isCompleted) {
      case true:
        if (task[0]._errorObject != undefined) {
          console.log(`Error loading:`, task[0]._errorObject.exception, task);
        } else {
          console.log(`Success loading:`, task[0]);
          console.log(
            "🚀 ~ file: default.js ~ line 36 ~ AppAssets ~ task",
            task
          );
          this._scene._engine.runRenderLoop(() => {
            this._scene.render();
          });
        }
        break;
      case false:
        console.log(`Error loading:`, task[0]._errorObject.exception, task);
        break;
    }
  }
  onProgress(remainingCount, totalCount) {
    this._scene._engine.loadingUIText =
      "We are loading the scene. " +
      remainingCount +
      " out of " +
      totalCount +
      " items still need to be loaded.";
    // console.log(
    //   "We are loading the scene. " +
    //     remainingCount +
    //     " out of " +
    //     totalCount +
    //     " items still need to be loaded."
    // );
  }

  _addTaskOnSuccess(cb) {
    this._glbTask.onSuccess = cb;
  }
}
