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
    <!-- <CursorOptions
      :top="quickInfoPositionTop"
      :left="quickInfoPositionLeft"
      :trigger="showOptionsSelector"
      @clicked-info="showOptionsSelector = false"
      @clicked-VT="showOptionsSelector = false"
    /> -->
  </div>
</template>

<script>
import BabylonApp from "@b";
import handleResize from "./methods/resize";
import LoadingAnimation from "./components/LoadingAnimation.vue";
import AnimateRadians from "@b/animations/AnimateRadians";

// import CursorOptions from "./components/CursorOptions.vue";

Number.prototype.mapTo0to1 = function (from, to) {
  let result;

  if (from < to) {
    let inputRange = to - from;
    let segment = 1 / inputRange;
    result = (this - from) * segment;
  } else {
    let inputRange = from - to;
    let segment = 1 / inputRange;
    result = (from - this) * segment;
  }
  return Math.min(1, Math.max(0, result));
};

export default {
  name: "App",
  components: { LoadingAnimation },
  data() {
    return {
      iframeLoaded: false,
      showSpinner: false,
      showBackButton: false,
      showOptionsSelector: false,
      babylonCanvas: null,
      src: "",
      quickInfoPositionLeft: 0,
      quickInfoPositionTop: 0,
      canvasSize: {
        width: 800,
        height: 800,
      },
      iframeStyles: { transform: "scale(0)", opacity: 0 },
    };
  },
  mounted() {
    this.babylonCanvas = this.$refs.babylonCanvas;

    // window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("resize", () => {
      this.canvasSize = handleResize();
    });

    this.canvasSize = handleResize();

    if (this.babylonCanvas) {
      this.bApp = new BabylonApp(this.babylonCanvas);
      if (this.bApp) {
        let animateFloat = new AnimateRadians({
          duration: 1,
          from: this.bApp._camera.alpha,
          to: 1.7,
          fps: 60,
        });
        console.log(
          "🚀 ~ file: App.vue ~ line 92 ~ mounted ~ animateFloat",
          animateFloat
        );
        // this.bApp._scene.onBeforeRenderObservable.add((theScene) => {
        //   console.log("camera alpha", theScene.activeCamera.alpha);
        // });
        this.bApp.toggleOptionsSelector = (condition) => {
          console.log("toggleOptionsSelector", condition);

          if (condition == "open") {
            this.quickInfoPositionLeft = this.bApp._scene.pointerX;
            this.quickInfoPositionTop = this.bApp._scene.pointerY;
            this.showOptionsSelector = true;
          } else {
            this.showOptionsSelector = false;
          }
        };

        this.bApp.sweepInHandler = (targetMesh) => {
          let cameraRadius0 = 0;
          let cameraRadiusFinal = 10;
          let radiusLength;
          let cameraRadiusN;
          let value;

          let observable = this.bApp._scene.onBeforeRenderObservable.add(
            (theScene) => {
              // console.log("camRay", this.bApp._camera.getForwardRay());
              if (this.src == "") {
                console.log("setUrl");
                // this.src = "http://localhost:91/gold_cc.html";
                this.src = "https://tour.renderator.com/gold_cc.html";
                this.onIframeLoadStart();
                this.bApp._camera._createAnimations(
                  targetMesh.meshCenter,
                  targetMesh.CameraRotation,
                  cameraRadiusFinal
                );
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
                    value = this.bApp._camera.radius.mapTo0to1(
                      cameraRadius0,
                      cameraRadiusFinal
                    );

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
                    value = this.bApp._camera.radius.mapTo0to1(
                      cameraRadius0,
                      cameraRadiusFinal
                    );

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
    handleMouseMove(e) {
      this.quickInfoPositionLeft = e.pageX;
      this.quickInfoPositionTop = e.pageY;
      // this.quickInfoPositionLeft = e.offsetX;
      // this.quickInfoPositionTop = e.offsetY;
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
    border: none;
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
