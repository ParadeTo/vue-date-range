<template>
  <transition :name="openTransition ? moveDirection : ''">
    <div v-if="toggleShow" :style="styleStr" key="show">
      <slot></slot>
    </div>
    <div v-else :style="styleStr" key="unShow">
      <slot></slot>
    </div>
  </transition>
</template>
<script>
  export default {
    props: {
      openTransition: {
        type: Boolean
      },
      toggleShow: {
        type: Boolean
      },
      moveDirection: {
        type: String
      },
      styleStr: {
        type: String,
        default: "height: 100%;"
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  .move-right-enter-active, .move-right-leave-active {
    transition: transform .3s;
  }
  .move-right-enter-active {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .move-right-leave-to /* .fade-leave-active below version 2.1.8 */ {
    transform: translateX(100%);
  }
  .move-right-enter {
    transform: translateX(-100%);
  }

  .move-left-enter-active, .move-left-leave-active {
    transition: transform .3s;
  }
  .move-left-enter-active {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .move-left-leave-to /* .fade-leave-active below version 2.1.8 */ {
    transform: translateX(-100%);
  }
  .move-left-enter {
    transform: translateX(100%);
  }
</style>