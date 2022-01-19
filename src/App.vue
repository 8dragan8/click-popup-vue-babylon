<template>
  <div id="app">
    <div id="iframe-virtual-tour" class="iframe-container">
      <iframe
        :src="src"
        :class="{
          fadeOut: iframeStatus == 'fadeOut',
          fadeIn: iframeStatus == 'fadeIn',
        }"
        ref="iframe"
        @load="onIframeLoaded"
        @unload="onIframeUnloaded"
        :style="iframeStyles"
      ></iframe>
      <button @click="hideIframe">Back</button>
    </div>
    <canvas
      ref="babylonCanvas"
      :width="canvasSize.width"
      :height="canvasSize.height"
    />
    <LoadingAnimation v-show="showSpinner" />
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
      iframeLoaded: false,
      showSpinner: false,
      loadIframe: false,
      babylonCanvas: null,
      src: "",

      canvasSize: {
        width: 800,
        height: 800,
      },
      iframeStyles: { transform: "scale(0)", opacity: 0 },
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

      this.bApp.sweepInHandler = (target, cameraRotation) => {
        let cameraRadius0 = 0;
        let cameraRadiusFinal = 10;
        let iframeDuration = 10;

        let observable = this.bApp._scene.onBeforeRenderObservable.add(
          (theScene) => {
            if (this.src == "") {
              console.log("setUrl");
              // this.src = "http://localhost:91/gold_cc.html";
              this.src = "https://tour.renderator.com/gold_cc.html";
              this.onIframeLoadStart();
              this.bApp._camera._createAnimations(target, cameraRotation);
            }

            if (this.iframeLoaded && this.bApp._camera.animationStage == 1) {
              this.bApp._camera._positionCameraAnimation();
            }
            if (this.iframeLoaded && this.bApp._camera.animationStage == 2) {
              //
            }
            if (this.iframeLoaded && this.bApp._camera.animationStage == 3) {
              cameraRadius0 = this.bApp._camera.radius * 0.45;
              this.bApp._camera._zoomINCameraAnimation();
            }
            if (this.iframeLoaded && this.bApp._camera.animationStage == 4) {
              let radiusLength = cameraRadius0 - cameraRadiusFinal;
              let cameraRadiusN = this.bApp._camera.radius;

              let value = 1 - cameraRadiusN / radiusLength;

              this.iframeStyles = {
                transform: `scale(${value})`,
                opacity: value,
              };
            }
            if (this.iframeLoaded && this.bApp._camera.animationStage == 5) {
              this.iframeStyles = {
                transform: `scale(${1})`,
                opacity: 1,
              };
              // theScene.onBeforeRenderObservable.remove(observable);
              // this.bApp._camera.animationStage = 0;
            }
            if (this.iframeLoaded && this.bApp._camera.animationStage == 6) {
              this.bApp._camera._reverseAllCameraAnimation();
            }
            if (this.iframeLoaded && this.bApp._camera.animationStage == 7) {
              let radiusLength = cameraRadius0 - cameraRadiusFinal;
              let cameraRadiusN = this.bApp._camera.radius;

              let value = 1 - cameraRadiusN / radiusLength;

              this.iframeStyles = {
                transform: `scale(${value})`,
                opacity: value,
              };
            }
            if (this.iframeLoaded && this.bApp._camera.animationStage == 8) {
              this.iframeStyles = {
                transform: `scale(${0})`,
                opacity: 0,
              };
              theScene.onBeforeRenderObservable.remove(observable);
              this.bApp._camera.animationStage = 0;
              this.src = "";
              this.iframeLoaded = false;
            }
          }
        );
      };
    }
  },
  methods: {
    hideIframe() {
      // this.iframeStatus = "fadeOut";
      // setTimeout(() => {
      //   this.iframeStatus = "hidden";
      // }, 0.5 * 1000);
      if (this.bApp) this.bApp._camera.animationStage = 6;
    },
    showIframe() {
      this.iframeStatus = "fadeIn";
      // setTimeout(() => {
      //   this.iframeStatus = "show";
      // }, 0.5 * 1000);
    },
    onIframeLoaded() {
      // this.iframeStatus == "loaded";
      console.log("🚀 ~ onIframeLoaded");
      this.iframeLoaded = true;
      this.showSpinner = false;
      if (this.bApp) this.bApp._camera.animationStage = 1;
    },
    onIframeLoadStart() {
      console.log("🚀 ~ onIframeLoadStart");
      this.showSpinner = true;
    },
    onIframeUnloaded() {
      console.log("onIframeUnloaded");
      this.iframeLoaded = false;
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
    // display: none;
    width: 100%;
    height: 100%;
    transform: scale(0);
    pointer-events: all;
    opacity: 0;
  }
  // .fadeOut {
  //   display: block;
  //   // transform: scale(0);
  //   // opacity: 0;
  //   animation-timing-function: linear;
  //   animation-name: scaleUP;
  //   animation-duration: 2s;
  //   animation-delay: 0;
  //   animation-direction: reverse;
  // }
  .show {
  }
  // .fadeIn {
  //   // display: block;
  //   // transform: scale(0);
  //   // opacity: 0;
  //   animation-timing-function: linear;
  //   animation-name: scaleUP;
  //   animation-duration: 2s;
  //   animation-delay: 0;
  //   animation-direction: normal;
  // }
}
@keyframes scaleUP {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
