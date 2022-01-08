import { PBRMaterial, Color3 } from "@babylonjs/core/Legacy/legacy";

export default class GlassMaterial extends PBRMaterial {
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
