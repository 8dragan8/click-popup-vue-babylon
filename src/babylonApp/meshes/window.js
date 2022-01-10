import { Mesh } from "@babylonjs/core/Legacy/legacy";
import GlassAvailableMaterial from "@bMat/GlassAvailableMaterial";
import GlassMaterial from "@bMat/GlassMaterial";

export default class Window extends Mesh {
  constructor(scene, mesh) {
    super(mesh.name, scene, null, mesh);
    mesh.dispose();

    this.defaultMaterial = new GlassMaterial(scene);
    this.availableMaterial = new GlassAvailableMaterial(scene);

    this.material = this.defaultMaterial;
  }
  _highlightAvailable() {
    this.material = this.availableMaterial;
  }
  _resetMaterial() {
    this.material = this.defaultMaterial;
  }
  _toggleMaterials() {
    if (this.material.name == this.defaultMaterial.name) {
      this.material = this.availableMaterial;
    } else if (this.material.name == this.availableMaterial.name) {
      this.material = this.defaultMaterial;
    }
  }
  get CameraRotation() {
    return this.absoluteRotationQuaternion.toEulerAngles();
  }
}
