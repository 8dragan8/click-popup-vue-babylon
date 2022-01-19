import {
  ArcRotateCamera,
  Vector3,
  Animation,
  MotionBlurPostProcess,
} from "@babylonjs/core/Legacy/legacy";
import moveCamera from "@b/animations/AnimaterPointToPoint";

const ALPHA = 1.2 * Math.PI;
const BETA = 0.45 * Math.PI;
const RADIUS = 100;
const FRAMES_PER_SECOND = 30;
const SPEED_RATIO = 1.5;
const LOOP_MODE = false;
const FROM_FRAME = 0;
const TO_FRAME = 200;

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
    this.animationStage = 0;
    this.wheelDeltaPercentage = 0.01;
  }
  _createAnimations(target, vector, cb) {
    let moveToTarget = new Animation(
      "moveToTarget",
      "target",
      FRAMES_PER_SECOND,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
      false
    );
    moveToTarget.setKeys([
      { frame: 3 * FRAMES_PER_SECOND, value: this.target },
      { frame: 4 * FRAMES_PER_SECOND, value: target },
    ]);
    let rotateToTargetBeta = new Animation(
      "rotateToTargetBeta",
      "beta",
      FRAMES_PER_SECOND,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
      false
    );
    rotateToTargetBeta.setKeys([
      { frame: 3 * FRAMES_PER_SECOND, value: this.beta },
      { frame: 4 * FRAMES_PER_SECOND, value: Math.abs(vector.y) },
    ]);
    let rotateToTargetAlpha = new Animation(
      "rotateToTargetAlpha",
      "alpha",
      FRAMES_PER_SECOND,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
      false
    );
    rotateToTargetAlpha.setKeys([
      { frame: 3 * FRAMES_PER_SECOND, value: this.alpha },
      { frame: 4 * FRAMES_PER_SECOND, value: Math.abs(vector.z) },
    ]);
    let zoomIn = new Animation(
      "zoomIn",
      "radius",
      FRAMES_PER_SECOND,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
      false
    );
    zoomIn.setKeys([
      { frame: 0 * FRAMES_PER_SECOND, value: this.radius },
      { frame: 2 * FRAMES_PER_SECOND, value: 10 },
    ]);

    this._positioningAnimations = [
      moveToTarget,
      rotateToTargetBeta,
      rotateToTargetAlpha,
    ];
    this._zooInAnimations = [zoomIn];
    // console.log(
    //   "animations",
    //   moveToTarget,
    //   rotateToTargetBeta,
    //   rotateToTargetAlpha,
    //   zoomIn
    // );
  }

  _zoomINCameraAnimation() {
    console.log("zooInAnimations", this.animationStage);
    this.animationStage = 4;
    let animatable1 = this._scene.beginDirectAnimation(
      this,
      this._zooInAnimations,
      FROM_FRAME,
      2 * FRAMES_PER_SECOND,
      LOOP_MODE,
      SPEED_RATIO
    );
    animatable1.pause();
    animatable1.restart();
    animatable1.onAnimationEnd = () => {
      this.animationStage = 5;
      this.detachPostProcess(this._getFirstPostProcess());
      this.attachControl(this._canvas, true);
    };
  }
  _positionCameraAnimation() {
    console.log("_positionCameraAnimation", this.animationStage);

    this.animationStage = 2;
    let animatable2 = this._scene.beginDirectAnimation(
      this,
      this._positioningAnimations,
      FROM_FRAME,
      2 * FRAMES_PER_SECOND,
      LOOP_MODE,
      SPEED_RATIO
    );
    animatable2.pause();
    new MotionBlurPostProcess("mb", this._scene, 1.0, this);
    this.detachControl();
    animatable2.restart();

    animatable2.onAnimationEnd = () => {
      this.animationStage = 3;
    };
  }
  _reverseAllCameraAnimation() {
    console.log("_reverseAllCameraAnimation", this.animationStage);

    this.animationStage = 7;
    let animatable3 = this._scene.beginDirectAnimation(
      this,
      this._zooInAnimations,
      2 * FRAMES_PER_SECOND,
      FROM_FRAME,
      LOOP_MODE,
      SPEED_RATIO
    );
    animatable3.pause();

    new MotionBlurPostProcess("mb", this._scene, 1.0, this);
    this.detachControl();
    animatable3.restart();

    animatable3.onAnimationEnd = () => {
      this.animationStage = 8;
      this.detachPostProcess(this._getFirstPostProcess());
      this.attachControl(this._canvas, true);
    };
  }
}
