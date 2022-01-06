<template>
  <canvas
    ref="babylonCanvas"
    :width="canvasSize.width"
    :height="canvasSize.height"
  />
</template>

<script>
import { scene } from "../scenes/default";
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
    scene.destroyScene();
    this.babylonCanvas = this.$refs.babylonCanvas;

    window.addEventListener("resize", () => {
      this.canvasSize = handleResize();
    });

    this.canvasSize = handleResize();

    if (this.babylonCanvas) {
      scene.createScene(this.babylonCanvas);
    }
  },
  updated() {
    if (this.babylonCanvas) {
      scene.updateScene(this.babylonCanvas);
    }
  },
  beforeUnmount() {
    scene.destroyScene();
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
