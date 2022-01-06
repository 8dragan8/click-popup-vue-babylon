<template>
  <div id="app"><Babylon /></div>
</template>

<script>
import Babylon from "./components/Babylon.vue";

export default {
  name: "App",
  components: {
    Babylon,
  },
  data() {
    return {};
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
