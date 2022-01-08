import { PBRMaterial, Color3 } from "@babylonjs/core/Legacy/legacy";

export default class GlassAvailableMaterial extends PBRMaterial {
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
