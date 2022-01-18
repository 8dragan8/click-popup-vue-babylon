<template>
  <div id="app">
    <div
      id="iframe-virtual-tour"
      class="iframe-container"
      v-show="this.iframeObserver && this.iframeStatus != 'hidden'"
    >
      <iframe
        :src="src"
        class="show"
        :class="{
          fadeOut: iframeStatus == 'fadeOut',
          fadeIn: iframeStatus == 'fadeIn',
        }"
        ref="iframe"
        @load="onIframeLoaded"
        @unload="onIframeUnloaded"
      ></iframe>
      <button @click="hideIframe">Back</button>
    </div>
    <canvas
      ref="babylonCanvas"
      :width="canvasSize.width"
      :height="canvasSize.height"
    />
    <LoadingAnimation v-show="loadIframe && !showIframe" />
  </div>
</template>

<script>
import BabylonApp from "@b";
import handleResize from "./methods/resize";
import LoadingAnimation from "./components/LoadingAnimation.vue";

export default {
  name: "App",
  components: { LoadingAnimation },
  data() {
    return {
      iframeStatus: "hidden",
      iframeObserver: false,
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
      this.bApp.hideIframe = () => {
        this.hideIframe();
      };
      this.bApp.onShowIframe = (e) => {
        switch (e) {
          case "show-iframe":
            console.log("show-iframe");
            this.showIframe();

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
    hideIframe() {
      this.iframeStatus = "fadeOut";
      // setTimeout(() => {
      //   this.iframeStatus = "hidden";
      // }, 0.5 * 1000);
    },
    showIframe() {
      this.iframeStatus = "fadeIn";
      // setTimeout(() => {
      //   this.iframeStatus = "show";
      // }, 0.5 * 1000);
    },
    onIframeLoaded() {
      // this.iframeStatus == "loaded";
      this.iframeObserver = true;
    },
    onIframeUnloaded() {
      this.iframeObserver = false;
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
  pointer-events: none;

  button {
    position: absolute;
    top: 0;
    left: 0;
    padding: 10px;
    pointer-events: all;
  }
  iframe {
    display: none;
    width: 100%;
    height: 100%;
    transform: scale(0);
    pointer-events: all;
  }
  .fadeOut {
    animation: scaleUP 0.5s linear backwards;
  }
  .show {
    display: block;
  }
  .fadeIn {
    animation: scaleUP 0.5s linear forwards;
  }
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
