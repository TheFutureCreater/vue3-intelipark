<script setup>
import ParkInfo from './ParkInfo.vue'
// import ChargingHeatmap from '../../Charts/components/ChargingHeatmap.vue'
import Income from './Income.vue'
// import Usage from './Usage.vue'
import ChargeDetail from './ChargeDetail.vue'
import station from './station.vue'

defineProps({
  actIdx: {
    type: Number,
    default: () => 0
  }
})
</script>

<template>
  <div class="Parks" name="parkScreen" :style="{ left: actIdx * -100 + '%' }">
    <ParkInfo></ParkInfo>
    <!-- <ChargingHeatmap></ChargingHeatmap> -->
    <Income></Income>
    <!-- <Usage></Usage> -->
    <ChargeDetail></ChargeDetail>
    <station></station>
  </div>
</template>

<style lang="scss">
.Parks {
  position: absolute;
  display: flex;
  left: 0;
  top: 90px;
  bottom: 0;
  width: 400%;
  transition: 0.5s;
  z-index: 10;
  pointer-events: none;
}
</style>
