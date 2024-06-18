<template>
  <div class="rightBox">
    <div class="box">
      <Title content="充电统计"></Title>
      <div class="info">
        <div class="charge-info">
          <SwitchDaysBt></SwitchDaysBt>
          <div id="charge-times">
            充电次数(次)
            <div class="number" style="display: inline-block; transform: translate(0, 15%)">
              <font v-show="screenStore.days === 0">
                {{ screenStore.latestWeekInfo.chargingRecordSum }}
              </font>
              <font v-show="screenStore.days === 1" style="color: red">
                {{ screenStore.latestMonthInfo.chargingRecordSum }}
              </font>
            </div>
          </div>
          <ul>
            <li>
              <div>充电量(度)</div>
              <div class="number">
                <font v-show="screenStore.days === 0">
                  {{ screenStore.latestWeekInfo.electricitySum }}
                </font>
                <font v-show="screenStore.days === 1" style="color: red">
                  {{ screenStore.latestMonthInfo.electricitySum }}
                </font>
              </div>
            </li>
            <li>
              <div>充电时长(小时)</div>
              <div class="number">
                <font v-show="screenStore.days === 0">
                  {{ screenStore.latestWeekInfo.chargeHoursSum }}
                </font>
                <font v-show="screenStore.days === 1" style="color: red">
                  {{ screenStore.latestMonthInfo.chargeHoursSum }}
                </font>
              </div>
            </li>
          </ul>
        </div>
        <ChargingTrend></ChargingTrend>
      </div>
      <!-- <Title content="充电榜单"></Title> -->
      <div class="list">
        <!-- <ChargingList></ChargingList> -->
        <DeviceUsageChart></DeviceUsageChart>
      </div>
    </div>
  </div>
</template>

<script setup>
import Title from './Title.vue'
import ChargingTrend from './ChargingTrend.vue'
// import ChargingList from './ChargingList.vue'
import SwitchDaysBt from './SwitchDaysBt.vue'
import { useScreenStore } from '@/stores'
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import DeviceUsageChart from './DeviceUsageChart.vue'
const route = useRoute()
const screenStore = useScreenStore()

onMounted(() => {
  screenStore.refresh_stats(route.query.parkid)
})

watch(
  () => route.query.parkid,
  (newid) => {
    // screenStore.latestWeekInfo.chargingRecordSum = 200
    screenStore.refresh_stats(newid)
    // console.log(newid)
  }
)
</script>

<style lang="scss">
.rightBox {
  pointer-events: all;
  color: white;
  position: absolute;
  z-index: 10;
  padding-top: 0;
  padding-right: 20px;
  padding-left: 15px;
  right: 0;
  top: 0px;
  bottom: 15px;
  width: 25%;
  min-width: 310px;
  .box {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    padding: 20px 10px;
    background: linear-gradient(#043753, rgba(0, 0, 0, 0));
    .info {
      height: 40%;
      width: 100%;

      .charge-info {
        width: 100%;
        height: 65%;
        // background-color: #fff;

        ul {
          display: flex;
          li {
            text-align: center;
            font-size: 16px;
            flex: 1;
          }
        }
        .number {
          font-size: 32px;
          font-weight: 700;
          color: orange;
        }
        #charge-times {
          text-align: center;
          width: 100%;
          height: 50%;
        }
      }
    }
    .list {
      position: absolute;
      height: 35%;
      bottom: 5%;
      width: 80%;

      // background-color: #fff;
      // li {
      //   font-size: large;
      //   height: 30px;
      //   text-align: center;
      // }
    }
  }
}
</style>
