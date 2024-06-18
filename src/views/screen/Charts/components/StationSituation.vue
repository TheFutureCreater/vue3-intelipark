<script setup>
// import * as echarts from 'echarts'
import StationPortStats from './StationPortStats.vue'
import StationNameInput from './StationNameInput.vue'

// const stationId = ref('')

// const search = () => {
//   screenStore.stationId = stationId.value
// }
</script>
<template>
  <div class="situation">
    <div style="height: 20%">
      <StationNameInput></StationNameInput>
    </div>
    <div style="height: 80%">
      <StationPortStats></StationPortStats>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.situation {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
