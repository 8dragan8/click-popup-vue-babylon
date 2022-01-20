<template>
  <div class="options-container" :style="styleComp">
    <button
      class="option info"
      :class="{
        hidden: !show,
        show: show,
      }"
      @click="handleInfoClick"
    ></button>
    <button
      class="option virtual-tour"
      :class="{
        hidden: !show,
        show: show,
      }"
      @click="handleVTClick"
    ></button>
  </div>
</template>

<script>
export default {
  props: {
    top: Number,
    left: Number,
    trigger: Boolean,
  },
  data() {
    return {
      show: false,
    };
  },
  computed: {
    styleComp: function () {
      return {
        // transform: `translateX(${this.left}px)translateY(${this.top}px)`,
        left: `${this.left}px`,
        top: `${this.top}px`,
      };
    },
  },
  mounted() {
    this.show = this.trigger;
  },
  updated() {
    this.$nextTick(() => {
      this.show = this.trigger;
    });
  },
  methods: {
    handleInfoClick: function (e) {
      console.log("click info");
      this.$emit("clicked-info");
      this.$forceUpdate();
      //   this.show = false;
    },
    handleVTClick: function (e) {
      console.log("click vt");
      this.$emit("clicked-VT");
      this.$forceUpdate();
      //   this.show = false;
    },
  },
};
</script>

<style lang="scss" scoped>
$animation_duration: 0.2s;
$start-scale: 0.6;
.options-container {
  position: absolute;
  width: 150px;
  height: 150px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  //   transition: all 0.3s;
  //   transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
  .option {
    position: absolute;
    width: 50px;
    height: 50px;
    background-color: white;
    border-radius: 50%;
    opacity: 0;
    &:active {
      transition-duration: 0.3s;
      transition-property: scale background-color;
      transform: scale(0.5);
      background-color: blue;
    }
    &:hover {
      transition-duration: 0.3s;
      transition-property: scale background-color;
      transform: scale(0.5);
      background-color: red;
    }
    &.info {
      &.show {
        pointer-events: all;
        animation: open-left $animation_duration
          cubic-bezier(0.47, 0, 0.745, 0.715) forwards;
      }
      &.hidden {
        pointer-events: none;
        animation: close-left $animation_duration
          cubic-bezier(0.47, 0, 0.745, 0.715) forwards;
      }
    }
    &.virtual-tour {
      &.show {
        animation: open-right $animation_duration
          cubic-bezier(0.47, 0, 0.745, 0.715) forwards;
        pointer-events: all;
      }
      &.hidden {
        animation: close-right $animation_duration
          cubic-bezier(0.47, 0, 0.745, 0.715) forwards;
        pointer-events: none;
      }
    }
  }
}
@keyframes open-left {
  0% {
    opacity: 0;
    transform: translate(100%, 100%) scale($start-scale);
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
}
@keyframes open-right {
  0% {
    opacity: 0;
    transform: translate(100%, 100%) scale($start-scale);
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    transform: translate(200%, 0) scale(1);
  }
}
@keyframes close-right {
  0% {
    opacity: 1;
    transform: translate(200%, 0) scale(1);
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(100%, 100%) scale($start-scale);
  }
}
@keyframes close-left {
  0% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(100%, 100%) scale($start-scale);
  }
}
</style>
