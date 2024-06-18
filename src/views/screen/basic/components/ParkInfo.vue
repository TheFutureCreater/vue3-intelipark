<script setup>
import LeftBox from '../../Charts/components/LeftBox.vue'
import RightBox from '../../Charts/components/RightBox.vue'
import BottomMidBox from '../../Charts/components/BottomMidBox.vue'
</script>

<template>
  <div class="parkInfo">
    <LeftBox></LeftBox>
    <RightBox></RightBox>
    <BottomMidBox></BottomMidBox>
  </div>
</template>

<style lang="scss" scoped>
.parkInfo {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
