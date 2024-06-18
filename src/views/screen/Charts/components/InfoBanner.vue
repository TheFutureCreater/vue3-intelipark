<template>
  <div class="midbox">
    <div
      :class="{ trapezium: true, active: activeIdx === index }"
      v-for="(item, index) in parkNames"
      :key="index"
      @click="setIndex(index)"
    >
      {{ item }}
    </div>
  </div>
  <InfoScreen :actIdx="activeIdx"></InfoScreen>
</template>

<script setup>
import { ref } from 'vue'
import InfoScreen from '../../basic/components/InfoScreen.vue'
// import { useRoute } from 'vue-router'
// import { useScreenStore } from '@/stores'

// const screenStore = useScreenStore()
// const route = useRoute()
const activeIdx = ref(0)
const parkNames = ref(['园区概况', '收入信息', '用电详情', '充电站信息'])
const screen = ref(document.querySelector('.Parks'))

// watch(
//   () => route.query.parkid,
//   (newid) => {
//     screenStore.refresh_usingRate(newid)
//   }
// )

const setIndex = (index) => {
  activeIdx.value = index
  // console.log(screen.value.style.left)
  screen.value.style.left = index * -100 + '%'
}
</script>
<style scoped lang="scss">
.midbox {
  position: fixed;
  display: flex;
  z-index: 10;
  top: 90px;
  left: 25%;
  height: 60px;
  width: 50%;
  font-weight: 700;
  min-width: 620px;
  color: white;
  .trapezium {
    flex: auto;
    width: 100%;
    height: 100%;
    line-height: 10px;
    margin: 0 20px;
    background-color: #043753;
    border: solid 2px skyblue;
    margin: 0 15px;
    transform: skewX(30deg);
    text-align: center;
    line-height: 60px;
    cursor: pointer;
  }
  .active {
    flex: auto;
    width: 100%;
    height: 100%;
    line-height: 10px;
    margin: 0 20px;
    background-color: skyblue;
    border: solid 2px skyblue;
    margin: 0 15px;
    transform: skewX(30deg);
    text-align: center;
    line-height: 60px;
    cursor: pointer;
    transition: 0.5s;
  }
}
</style>
