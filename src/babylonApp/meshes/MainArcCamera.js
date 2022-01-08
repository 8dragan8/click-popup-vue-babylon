import { ArcRotateCamera, Vector3 } from "@babylonjs/core/Legacy/legacy";
import moveCamera from "@b/animations/AnimaterPointToPoint";

const ALPHA = 1.2 * Math.PI;
const BETA = 0.45 * Math.PI;
const RADIUS = 100;

export default class MainArcCamera extends ArcRotateCamera {
  constructor(scene, canvas) {
    super("MainArcCamera", ALPHA, BETA, RADIUS, Vector3.Zero(), scene);
    this.attachControl(canvas, true);

    this.minZ = 0.1;
    this.maxZ = 10000;

    this.upperRadiusLimit = 10000;

    // this.lowerBetaLimit = 0;
    // this.upperBetaLimit = Math.PI *2;

    this.wheelDeltaPercentage = 0.01;
  }
  _moveCamera(target) {
    moveCamera(this._scene, {
      alpha: 1 * Math.PI,
      beta: 0.45 * Math.PI,
      radius: 40,
      target,
    });
  }
}
