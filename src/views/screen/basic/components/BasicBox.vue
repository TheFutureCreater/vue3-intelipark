<template>
  <div class="basicBox"><ParkScreen></ParkScreen></div>
</template>

<script setup>
import ParkScreen from './ParkScreen.vue'
</script>

<style lang="scss" scoped>
.basicBox {
  position: absolute;
  z-index: 10;
  width: 100%;
  top: 90px;
  bottom: 15px;
  // min-width: 1020px;
}
</style>
