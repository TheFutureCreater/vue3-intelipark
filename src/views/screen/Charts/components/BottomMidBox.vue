<template>
  <div class="BottomMidBox">
    <div class="box">
      <Title content="充电记录"></Title>
      <div class="records">
        <table>
          <thead>
            <tr>
              <td>开始时间</td>
              <td>结束时间</td>
              <!-- <td>充电时长</td> -->
              <td>充电量</td>
              <td>费用</td>
            </tr>
          </thead>
          <tbody>
            <tr
              :class="{ light: (index & 1) === 1 }"
              v-for="(item, index) in screenStore.chargingInfo"
              :key="index"
            >
              <td>{{ item.startTime }}</td>
              <td>{{ item.endTime }}</td>
              <!-- <td>{{ item.chargeTime }}</td> -->
              <td>{{ item.electricity }}</td>
              <td>{{ item.cost }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, onMounted } from 'vue'
import Title from './Title.vue'
// import { getChargeInfo } from '@/api/charge'
import { useScreenStore } from '@/stores'
import { useRoute } from 'vue-router'
const route = useRoute()
const screenStore = useScreenStore()
// const parkid = ref('123456789')
// const rs = ref()
// const infolist = ref([])
onMounted(() => {
  screenStore.refresh_crgInfo(route.query.parkid)
})

watch(
  () => route.query.parkid,
  (newid) => screenStore.refresh_crgInfo(newid)
)

// const charge_infoinit = async (parkid) => {
//   // rs.value = await getChargeInfo(parkid)
//   infolist.value = rs.value.data.data.crecords
// }

// charge_infoinit()
</script>
<style lang="scss" scoped>
.BottomMidBox {
  pointer-events: all;
  position: absolute;
  // z-index: 10;
  padding-bottom: 15px;
  padding-right: 15px;
  padding-left: 15px;
  bottom: 0;
  left: 25%;
  height: 30%;
  width: 50%;
  min-width: 620px;
  .box {
    overflow-x: hidden;
    width: 100%;
    height: 100%;
    // border: 2px solid black;
    padding: 20px 10px;
    border-radius: 5px;

    // scroll-behavior: ;
    .records {
      overflow-y: scroll;
      // scroll-snap-type: none;
      scrollbar-width: none;
    }
    background: linear-gradient(#043753, rgba(0, 0, 0, 0));
    table {
      width: 100%;
      height: 20%;
      text-align: center;
      color: white;
      border-spacing: 0;

      .light {
        background-color: rgba(255, 255, 255, 0.3);
        color: white;
      }
    }
  }
}
</style>
