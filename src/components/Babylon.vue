<template>
  <canvas
    ref="babylonCanvas"
    :width="canvasSize.width"
    :height="canvasSize.height"
  />
</template>

<script>
import BabylonApp from "@b";
import handleResize from "../methods/resize";

export default {
  name: "Babylon",
  props: {},
  data() {
    return {
      babylonCanvas: null,

      canvasSize: {
        width: 800,
        height: 800,
      },
    };
  },

  mounted() {
    this.babylonCanvas = this.$refs.babylonCanvas;

    window.addEventListener("resize", () => {
      this.canvasSize = handleResize();
    });

    this.canvasSize = handleResize();

    if (this.babylonCanvas) {
      this.bApp = new BabylonApp(this.babylonCanvas);
      this.bApp.onShowIframe = (e) => {
        switch (e) {
          case "show-iframe":
            console.log("show-iframe");
            this.$emit("show-iframe");

            break;
          case "load-iframe":
            console.log("load-iframe");
            this.$emit("load-iframe");

            break;
        }
      };
    }
  },
  updated() {
    // if (this.babylonCanvas) {
    //   // scene.updateScene(this.babylonCanvas);
    // }
  },
  beforeUnmount() {
    // scene.destroyScene();
    window.removeEventListener("resize", handleResize);
  },
};
</script>
<style lang="scss" scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>
