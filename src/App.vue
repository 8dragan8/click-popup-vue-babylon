<template>
  <div id="app">
    <div id="iframe-virtual-tour" class="iframe-container">
      <iframe
        :src="src"
        ref="iframe"
        @load="onIframeLoaded"
        @unload="onIframeUnloaded"
        :style="iframeStyles"
        v-if="src != ''"
      ></iframe>
      <button @click="hideIframe" v-if="showBackButton">Back</button>
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
      iframeLoaded: false,
      showSpinner: false,
      showBackButton: false,
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
        let radiusLength;
        let cameraRadiusN;
        let value;

        let observable = this.bApp._scene.onBeforeRenderObservable.add(
          (theScene) => {
            if (this.src == "") {
              console.log("setUrl");
              this.src = "http://localhost:91/gold_cc.html";
              // this.src = "https://tour.renderator.com/gold_cc.html";
              this.onIframeLoadStart();
              this.bApp._camera._createAnimations(target, cameraRotation, 10);
            }
            if (this.iframeLoaded) {
              switch (this.bApp._camera.animationStage) {
                case 1:
                  this.bApp._camera._positionCameraAnimation();

                  break;
                case 2:
                  break;
                case 3:
                  cameraRadius0 = this.bApp._camera.radius * 0.45;
                  this.bApp._camera._zoomINCameraAnimation();

                  break;
                case 4:
                  radiusLength = cameraRadius0 - cameraRadiusFinal;
                  cameraRadiusN = this.bApp._camera.radius;

                  value = 1 - cameraRadiusN / radiusLength;

                  this.iframeStyles = {
                    transform: `scale(${value})`,
                    opacity: value,
                  };
                  break;
                case 5:
                  this.iframeStyles = {
                    transform: `scale(${1})`,
                    opacity: 1,
                  };
                  break;
                case 6:
                  this.bApp._camera._reverseAllCameraAnimation();

                  break;
                case 7:
                  radiusLength = cameraRadius0 - cameraRadiusFinal;
                  cameraRadiusN = this.bApp._camera.radius;

                  value = 1 - cameraRadiusN / radiusLength;

                  this.iframeStyles = {
                    transform: `scale(${value})`,
                    opacity: value,
                  };
                  break;
                case 8:
                  this.iframeStyles = {
                    transform: `scale(${0})`,
                    opacity: 0,
                  };
                  theScene.onBeforeRenderObservable.remove(observable);
                  this.bApp._camera.animationStage = 0;
                  this.src = "";
                  this.iframeLoaded = false;
                  break;
              }
            }
          }
        );
      };
    }
  },
  methods: {
    hideIframe() {
      this.showBackButton = false;
      if (this.bApp) this.bApp._camera.animationStage = 6;
    },
    onIframeLoadStart() {
      this.showSpinner = true;
    },
    onIframeLoaded() {
      if (this.src != "") {
        this.iframeLoaded = true;
        this.showSpinner = false;
        this.showBackButton = true;
        if (this.bApp) this.bApp._camera.animationStage = 1;
      }
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
    width: 100%;
    height: 100%;
    transform: scale(0);
    pointer-events: all;
    opacity: 0;
  }
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
