import { MotionBlurPostProcess } from "@babylonjs/core/Legacy/legacy";
import { Animation } from "@babylonjs/core/Animations/animation";
import { CubicEase, EasingFunction } from "@babylonjs/core/Animations/easing";

const FRAMES_PER_SECOND = 60;
const SPEED_RATIO = 1;
const LOOP_MODE = false;
const FROM_FRAME = 0;
const TO_FRAME = 200;

function createAnimation({ property, from, to, startAt, stopAt }) {
  const ease = new CubicEase();
  ease.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);

  const animation = Animation.CreateAnimation(
    property,
    Animation.ANIMATIONTYPE_FLOAT,
    FRAMES_PER_SECOND,
    ease
  );
  animation.setKeys([
    {
      frame: startAt * FRAMES_PER_SECOND,
      value: from,
    },
    {
      frame: stopAt * FRAMES_PER_SECOND,
      value: to,
    },
  ]);

  return animation;
}

export default function (scene, { radius, alpha, beta, target }) {
  const camera = scene.activeCamera;
  camera.animations = [
    createAnimation({
      property: "beta",
      from: camera.beta,
      to: beta,
      startAt: 13,
      stopAt: 14,
    }),
    createAnimation({
      property: "alpha",
      from: camera.alpha,
      to: alpha,
      startAt: 0,
      stopAt: 2,
    }),
    createAnimation({
      property: "target.x",
      from: camera.target.x,
      to: target.x,
      startAt: 0,
      stopAt: 1,
    }),
    createAnimation({
      property: "target.y",
      from: camera.target.y,
      to: target.y,
      startAt: 0,
      stopAt: 1,
    }),
    createAnimation({
      property: "target.z",
      from: camera.target.z,
      to: target.z,
      startAt: 0,
      stopAt: 1,
    }),
    createAnimation({
      property: "radius",
      from: camera.radius,
      to: radius,
      startAt: 10,
      stopAt: 14,
    }),
  ];
  let mbPostProcess = new MotionBlurPostProcess("mb", scene, 1.0, camera);

  console.log("🚀 ~ file: AnimaterPointToPoint.js ~ line 37 ~ camera", camera);

  let animatable = scene.beginAnimation(
    camera,
    FROM_FRAME,
    14 * FRAMES_PER_SECOND,
    LOOP_MODE,
    SPEED_RATIO
  );

  animatable.onAnimationEnd = () => {
    console.log(
      "🚀 ~ file: AnimaterPointToPoint.js ~ line 98 ~ camera",
      camera._getFirstPostProcess()
    );

    camera.detachPostProcess(camera._getFirstPostProcess());
  };
}
