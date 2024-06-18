<script setup>
import LayoutHeader from './LayoutHeader.vue'
// import { useScroll } from '@vueuse/core'
// const { y } = useScroll(window)
</script>

<template>
  <div class="app-header-sticky">
    <LayoutHeader />
  </div>
</template>

<style scoped lang="scss">
.app-header-sticky {
  width: 100%;
  height: 60px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  background-color: #ffffff;
  border-bottom: 1px solid #e4e4e4;
  // 状态一：往上平移自身高度 + 完全透明
  // transform: translateY(-100%);
  // opacity: 0;

  // 状态二：移除平移 + 完全不透明
  // &.show {
  //   transition: all 0.3s linear;
  //   transform: none;
  //   opacity: 1;
  // }
}
</style>
