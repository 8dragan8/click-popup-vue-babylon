const path = require("path");

module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias.set("@b", path.resolve(__dirname, "./src/babylonApp"));
    config.resolve.alias.set(
      "@bMat",
      path.resolve(__dirname, "./src/babylonApp/materials")
    );
    config.resolve.alias.set(
      "@bMesh",
      path.resolve(__dirname, "./src/babylonApp/meshes")
    );
    config.resolve.alias.set(
      "@bHelper",
      path.resolve(__dirname, "./src/babylonApp/heleperClasses")
    );
  },
};
