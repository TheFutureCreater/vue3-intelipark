<template>
  <div class="incomeBox">
    <SwitchDaysBt></SwitchDaysBt>
    <div class="infobox">
      <div class="column">
        <div style="height: 10%; text-align: center; font-size: 24px; font-weight: 900; color: white">
          <div style="display: inline-block; height: 100%; width: 50%">VIP用户:{{ vip }}</div>
          <div style="display: inline-block; height: 100%; width: 50%">普通用户：{{ com }}</div>
        </div>
        <IncomeStatistics></IncomeStatistics>
      </div>
      <div class="column">
        <Usage></Usage>
      </div>
    </div>
  </div>
</template>

<script setup>
// import BarChart from './BarChart.vue'
import SwitchDaysBt from '../../Charts/components/SwitchDaysBt.vue'
import IncomeStatistics from '../../Charts/components/IncomeStatistics.vue'

// import AnnularChart from '../../Charts/components/AnnularChart.vue'
// import { getEqState } from '@/api/equipments'
import { ref } from 'vue'
import Usage from './Usage.vue'
import { getUserStats } from '@/api/userinfo'

const vip = ref(0)
const com = ref(0)

const reset_userStats = async () => {
  const res = (await getUserStats()).data.data
  vip.value = res.vipUser
  com.value = res.comUser
}

reset_userStats()
// const parkid = ref('123456789')
// const totalNum = ref(0)
// const rs = ref(0)
// const free = ref(0)
// const offNetwork = ref(0)
// const fault = ref(0)
// const occupation = ref(0)

// const init_data = async () => {
//   rs.value = await getEqState(parkid.value)
//   fault.value = rs.value.data.data.crecoredstats[0].fault
//   offNetwork.value = rs.value.data.data.crecoredstats[0].offNetwork
//   free.value = rs.value.data.data.crecoredstats[0].free
//   occupation.value = rs.value.data.data.crecoredstats[0].occupation
//   totalNum.value = occupation.value + free.value + offNetwork.value + fault.value
//   // console.log('sum: ' + totalNum.value)
//   // console.log('fault: ' + fault.value)
//   // console.log('offNetwork: ' + offNetwork.value)
//   // console.log('free: ' + free.value)
//   // console.log('occupation: ' + occupation.value)
// }

// init_data()

// onMounted(() => {})
</script>

<style lang="scss">
.incomeBox {
  position: relative;
  width: 100%;
  height: 100%;
  .infobox {
    pointer-events: all;
    display: flex;
    position: relative;
    // left: 10%;
    width: 90%;
    top: 10%;
    height: 85%;

    background: linear-gradient(#043753, #0437539f);
    // left: 50%;
    // transform: translate(10%, 0);
    margin: 0 auto;
    .column {
      flex: 3;
    }
    .column:nth-child(1) {
      flex: 8;
    }
    .panel {
      border: solid white 2px;
      border-radius: 12px;
      height: 30%;
      width: 100%;
      margin-bottom: 24px;
    }
  }
}
</style>
