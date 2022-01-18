<template>
  <div id="app">
    <VirtualTour
      src="http://localhost:91/gold_cc.html"
      v-if="loadIframe"
      :showIframe="showIframe"
    />
    <Babylon
      @load-iframe="loadIframe = true"
      @show-iframe="showIframe = true"
    />
  </div>
</template>

<script>
import Babylon from "./components/Babylon.vue";
import VirtualTour from "./components/VirtualTour.vue";

export default {
  name: "App",
  components: {
    Babylon,
    VirtualTour,
  },
  data() {
    return {
      showIframe: false,
      loadIframe: false,
    };
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
</style>
