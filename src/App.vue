<template>
  <div id="app">
    <div id="iframe-virtual-tour" class="iframe-container" v-show="loadIframe">
      <iframe
        :src="src"
        class="mounted"
        :class="{ loaded: iframeObserver && showIframe }"
        ref="iframe"
        @load="onIframeLoaded"
        @unload="onIframeUnloaded"
      ></iframe>
    </div>
    <canvas
      ref="babylonCanvas"
      :width="canvasSize.width"
      :height="canvasSize.height"
    />
  </div>
</template>

<script>
import BabylonApp from "@b";
import handleResize from "./methods/resize";

export default {
  name: "App",
  data() {
    return {
      iframeObserver: false,
      showIframe: false,
      loadIframe: false,
      babylonCanvas: null,
      src: "",

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
            this.showIframe = true;

            break;
          case "load-iframe":
            console.log("load-iframe");
            this.src = "http://localhost:91/gold_cc.html";
            this.loadIframe = true;

            break;
        }
      };
    }
  },
  methods: {
    onIframeLoaded() {
      this.iframeObserver = true;
      //   alert("Iframe loaded");
    },
    onIframeUnloaded() {
      this.iframeObserver = false;
      //   alert("Ifram unloaded");
    },
    closeDisclamer() {
      this.isDisclamerRead = true;
    },
  },
};
</script>

<style lang="scss">
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
body {
  color: white;
  overflow: hidden;
  background-color: black;
  width: 100vw;
  height: 100vh;
}
#app {
  width: 100%;
  height: 100%;
  position: relative;
}
canvas {
  width: 100%;
  height: 100%;
}
.iframe-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mounted {
  display: none;
  width: 100%;
  height: 100%;
  transform: scale(0);
}
.loaded {
  display: block;
  animation: scaleUP 0.5s linear 0.5s forwards;
}
@keyframes scaleUP {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
</style>
