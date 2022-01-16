const meshSort = {
  isLand: (mesh) => mesh.id.includes("ENV_primitive"),
  isGLand: (mesh) => mesh.id.includes("ENV_G_"),
  isBody: (mesh) => mesh.id.split("_")[1] == "BODY",
  isWindow: (mesh) => mesh.id.split("_")[2] == "glazing",
  isPool: (mesh) =>
    ["pool", "poolDeck"].some((e) => mesh.id.split("_")[2] == e) &&
    mesh.id != "5A_1812_poolDeck_primitive1",

  isWater: (mesh) =>
    mesh.id.split("_")[2] == "water" ||
    mesh.id == "5A_1812_poolDeck_primitive1",

  isInactive: (mesh) => mesh.id.split("_")[1] == "INACTIVE",

  isCloseSurroundingBuilding: (mesh) => mesh.id.substr(0, 8) == "building",

  isFarSurroundingBuilding: (mesh) => mesh.id == "buildings",
  isGarage: (mesh) => mesh.id == "_garage",
};
export default meshSort;
