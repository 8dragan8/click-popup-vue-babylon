import {
  ArcRotateCamera,
  Vector3,
  Animation,
} from "@babylonjs/core/Legacy/legacy";
import moveCamera from "@b/animations/AnimaterPointToPoint";

const ALPHA = 1.2 * Math.PI;
const BETA = 0.45 * Math.PI;
const RADIUS = 100;
const FRAMES_PER_SECOND = 60;
const SPEED_RATIO = 1;
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

    this.wheelDeltaPercentage = 0.01;
  }
  _moveCamera(target, vector, cb) {
    let moveToTarget = new Animation(
      "moveToTarget",
      "target",
      FRAMES_PER_SECOND,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
      false
    );
    moveToTarget.setKeys([
      { frame: 0 * FRAMES_PER_SECOND, value: this.target },
      { frame: 1 * FRAMES_PER_SECOND, value: target },
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
      { frame: 1 * FRAMES_PER_SECOND, value: this.beta },
      { frame: 2 * FRAMES_PER_SECOND, value: Math.abs(vector.y) },
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
      { frame: 1 * FRAMES_PER_SECOND, value: this.alpha },
      { frame: 2 * FRAMES_PER_SECOND, value: Math.abs(vector.z) },
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
      { frame: 5 * FRAMES_PER_SECOND, value: this.radius },
      { frame: 6 * FRAMES_PER_SECOND, value: 10 },
    ]);

    this.animations.push(
      moveToTarget,
      rotateToTargetBeta,
      rotateToTargetAlpha,
      zoomIn
    );

    let animatable = this._scene.beginAnimation(
      this,
      FROM_FRAME,
      6 * FRAMES_PER_SECOND,
      LOOP_MODE,
      SPEED_RATIO
    );
    animatable.onAnimationEnd = () => {
      console.log(this);
      cb("show-iframe");
      this.animations = [];
    };
    animatable.onAnimationLoop = () => {
      console.log("LOOP");
    };
    // this.detachControl();

    // moveCamera(this._scene, {
    //   alpha: Math.abs(vector.z),
    //   beta: Math.abs(vector.y),
    //   radius: 10,
    //   target,
    // });
    // this.attachControl(this._canvas, true);
  }
}
