<template>
  <div id="iframe-virtual-tour" class="iframe-container">
    <iframe
      :src="src"
      class="mounted"
      :class="{ loaded: iframeObserver && showIframe }"
      ref="iframe"
      @load="onIframeLoaded"
      @unload="onIframeUnloaded"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: "Virtual-tour",
  data() {
    return {
      iframeObserver: false,
      isDisclamerRead: false,
    };
  },
  props: { src: String, showIframe: Boolean },

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
<style lang="scss" scoped>
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
