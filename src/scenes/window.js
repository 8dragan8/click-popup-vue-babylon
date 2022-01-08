import { Mesh, PBRMaterial, Color3 } from "@babylonjs/core/Legacy/legacy";

class GlassMaterial extends PBRMaterial {
  constructor(scene) {
    super("GlassMaterial", scene);
    // this.reflectionTexture = textures.reflectionTexture
    this.environmentIntensity = 1;
    this.metallic = 1;
    this.roughness = 0;
    this.alpha = 0.35;
    this.albedoColor = Color3.FromHexString("#5d6264");
    this.emissiveColor = new Color3.Black();
  }
}
class GlassAvailableMaterial extends PBRMaterial {
  constructor(scene) {
    super("GlassAvailableMaterial", scene);
    this.environmentIntensity = 1;
    this.metallic = 1;
    this.roughness = 0;
    this.alpha = 0.8;
    this.emissiveColor = new Color3.Green();
    this.albedoColor = new Color3.Green();
  }
}

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
}
