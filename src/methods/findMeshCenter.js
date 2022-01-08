import { BoundingInfo } from "@babylonjs/core/Legacy/legacy";

export default function (mesh) {
  let min = mesh.getBoundingInfo().boundingBox.minimumWorld;
  let max = mesh.getBoundingInfo().boundingBox.maximumWorld;

  return new BoundingInfo(min, max).boundingBox.centerWorld;
}
