import { PBRMaterial, Color3 } from "@babylonjs/core/Legacy/legacy";

export default class GlassMaterial extends PBRMaterial {
  constructor(scene) {
    super("RedMaterial", scene);
    this.metallic = 0;
    this.roughness = 1;
    this.albedoColor = new Color3.Red();
    this.reflectionColor = new Color3.Black();
    this.emissiveColor = new Color3.Black();
  }
}
