import { BoundingInfo, Mesh } from "@babylonjs/core/Legacy/legacy";

export default function (mesh) {
  let min = mesh.getBoundingInfo().boundingBox.minimumWorld;
  let max = mesh.getBoundingInfo().boundingBox.maximumWorld;

  //   console.log(Mesh.Center(min, max));

  return new BoundingInfo(min, max).boundingBox.centerWorld;
}
