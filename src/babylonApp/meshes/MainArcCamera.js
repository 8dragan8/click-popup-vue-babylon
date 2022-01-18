import { ArcRotateCamera, Vector3 } from "@babylonjs/core/Legacy/legacy";
import moveCamera from "@b/animations/AnimaterPointToPoint";

const ALPHA = 1.2 * Math.PI;
const BETA = 0.45 * Math.PI;
const RADIUS = 100;

export default class MainArcCamera extends ArcRotateCamera {
  constructor(scene, canvas) {
    super("MainArcCamera", ALPHA, BETA, RADIUS, Vector3.Zero(), scene);
    this.attachControl(canvas, true);
    this._canvas = canvas;
    this.minZ = 0.1;
    this.maxZ = 10000;

    this.upperRadiusLimit = 10000;

    // this.lowerBetaLimit = 0;
    // this.upperBetaLimit = Math.PI *2;

    this.wheelDeltaPercentage = 0.01;
  }
  _moveCamera(target, vector) {
    console.log(
      "🚀 ~ file: MainArcCamera.js ~ line 24 ~ MainArcCamera ~ _moveCamera ~ target",
      target
    );
    console.log(
      "🚀 ~ file: MainArcCamera.js ~ line 24 ~ MainArcCamera ~ _moveCamera ~ vector",
      vector
    );
    this.detachControl();
    moveCamera(this._scene, {
      alpha: Math.abs(vector.z),
      beta: Math.abs(vector.y),
      radius: 10,
      target,
    });
    this.attachControl(this._canvas, true);
  }
}
