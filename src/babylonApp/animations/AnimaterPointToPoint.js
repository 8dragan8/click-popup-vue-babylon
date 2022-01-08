import { Animation } from "@babylonjs/core/Animations/animation";
import { CubicEase, EasingFunction } from "@babylonjs/core/Animations/easing";

const FRAMES_PER_SECOND = 60;
const SPEED_RATIO = 4;
const LOOP_MODE = false;
const FROM_FRAME = 0;
const TO_FRAME = 200;

function createAnimation({ property, from, to }) {
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
      frame: FROM_FRAME,
      value: from,
    },
    {
      frame: TO_FRAME,
      value: to,
    },
  ]);

  return animation;
}

export default function (scene, { radius, alpha, beta, target }) {
  const camera = scene.activeCamera;
  camera.animations = [
    createAnimation({
      property: "radius",
      from: camera.radius,
      to: radius,
    }),
    createAnimation({
      property: "beta",
      from: camera.beta,
      to: beta,
    }),
    createAnimation({
      property: "alpha",
      from: camera.alpha,
      to: alpha,
    }),
    createAnimation({
      property: "target.x",
      from: camera.target.x,
      to: target.x,
    }),
    createAnimation({
      property: "target.y",
      from: camera.target.y,
      to: target.y,
    }),
    createAnimation({
      property: "target.z",
      from: camera.target.z,
      to: target.z,
    }),
  ];
  console.log("🚀 ~ file: AnimaterPointToPoint.js ~ line 37 ~ camera", camera);

  scene.beginAnimation(camera, FROM_FRAME, TO_FRAME, LOOP_MODE, SPEED_RATIO);
}
