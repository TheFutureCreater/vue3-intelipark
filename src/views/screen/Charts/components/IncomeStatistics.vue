<template>
  <div class="incomeStatislics" ref="incomeStatislics"></div>
</template>

<script setup>
import { useScreenStore } from '@/stores'
import * as echarts from 'echarts'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const screenStore = useScreenStore()

const incomeStatislics = ref()

onMounted(() => {
  statislicsInit()
  reset_incomeData(route.query.parkid)
})
watch(
  () => route.query.parkid,
  (newid) => reset_incomeData(newid)
)

watch(
  () => screenStore.days,
  () => reset_incomeData(route.query.parkid)
)

const reset_incomeData = async (parkid) => {
  await screenStore.refresh_userIncomeInfo(parkid)
  let com = [],
    vip = [],
    sum = []
  let xAxis = []
  let d = new Date()
  let time = screenStore.days == 0 ? 7 : 30
  for (let i = 0; i < time; i++) {
    let t = new Date()
    t.setDate(d.getDate() - time + i + 1)
    xAxis.push(t.getMonth() + 1 + '-' + t.getDate())
  }

  screenStore.incomeInfo.forEach((el) => {
    com.push(el.comCost)
    vip.push(el.vipCost)
    sum.push(el.vipCost + el.comCost)
  })

  let grid = echarts.init(incomeStatislics.value)
  grid.setOption({
    xAxis: {
      data: xAxis
    },
    series: [
      {
        data: com
      },
      {
        data: vip
      },
      {
        data: sum
      }
    ]
  })
}

const statislicsInit = () => {
  let grid = echarts.init(incomeStatislics.value)
  const grid_option = {
    title: {
      text: '收入统计',
      textStyle: {
        color: 'pink',
        fontSize: '24px'
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['普通用户', 'VIP用户', '总收入'],
      textStyle: {
        color: 'white',
        fontSize: '24px'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['---', '---', '---', '---', '---', '---', '---'],
      axisLine: {
        lineStyle: {
          color: '#fff'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#fff'
        }
      }
    },
    series: [
      {
        name: '普通用户',
        type: 'line',
        // stack: 'Total',
        data: [0, 0, 0, 0, 0, 0, 0]
      },
      {
        name: 'VIP用户',
        type: 'line',
        // stack: 'Total',
        data: [0, 0, 0, 0, 0, 0, 0]
      },
      {
        name: '总收入',
        type: 'line',
        // stack: 'Total',
        data: [0, 0, 0, 0, 0, 0, 0]
      }
    ]
  }
  grid.setOption(grid_option)
}
</script>

<style lang="scss">
.incomeStatislics {
  position: relative;
  height: 90%;
  width: 95%;
  left: 2.5%;
  // top: 50%;
  // transform: translate(-50%, -50%);
  border: 2px solid white;
  border-radius: 12px;
}
</style>
