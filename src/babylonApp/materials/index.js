import GlassAvailableMaterial from "@bMat/GlassAvailableMaterial";
import GlassMaterial from "@bMat/GlassMaterial";
import RedMaterial from "@bMat/RedMaterial";
export default function registerMaterials(scene) {
  new GlassMaterial(scene);
  new GlassAvailableMaterial(scene);
  new RedMaterial(scene);
}
