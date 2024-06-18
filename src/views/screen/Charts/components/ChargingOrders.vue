<script setup>
// import { getChargeStats } from '@/api/charge'
import * as echarts from 'echarts'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useScreenStore } from '@/stores'
const route = useRoute()
const lineChart = ref()
// const rsl = ref()
const screenStore = useScreenStore()

onMounted(() => {
  // rsl.value = await getChargeStats(parkid, 7)
  // rsl.value.data.data.crecoredstats
  LineChartInit()
  // refresh_order(route.query.parkid)
  // screenStore.refresh_stats()
})

watch(
  () => [screenStore.days, screenStore.stats],
  () => refresh_order(),
  {
    deep: true
  }
)

watch(
  () => route.query.parkid,
  (newid) => screenStore.refresh_stats(newid)
)

const refresh_order = () => {
  // rsl.value = await getChargeStats(parkid, daysStore.days === 0 ? 7 : 30)
  // await screenStore.refresh_stats(parkid)
  let xAxis = []
  let d = new Date()
  let time = screenStore.days == 0 ? 7 : 30
  for (let i = 0; i < time; i++) {
    let t = new Date()
    t.setDate(d.getDate() - time + i + 1)
    xAxis.push(t.getMonth() + 1 + '-' + t.getDate())
  }
  let newopt = {
    xAxis: {
      data: xAxis
    },
    series: [
      {
        data:
          screenStore.days == 0
            ? screenStore.latestWeekInfo.chargingRecordCountArray
            : screenStore.latestMonthInfo.chargingRecordCountArray
      }
    ]
  }
  let order = echarts.init(lineChart.value)
  order.setOption(newopt)
}

const order_option = ref({
  xAxis: {
    type: 'category',
    data: ['---', '---', '---', '---', '---', '---', '---'],
    axisLine: {
      lineStyle: {
        color: '#fff'
      }
    }
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        type: 'dashed',
        color: '#fff'
      }
    },
    axisLine: {
      lineStyle: {
        color: '#fff'
      }
    }
  },
  series: [
    {
      data: [100, 80, 85, 83, 90, 16, 14],
      type: 'line',
      symbol: 'circle',
      symbolSize: 12,
      lineStyle: {
        color: '#30C2F4',
        width: 3,
        type: 'solid'
      },
      itemStyle: {
        borderWidth: 3,
        borderColor: '#BAE4F0',
        color: '#BAE4F0'
      }
    }
  ]
})

const LineChartInit = () => {
  let order = echarts.init(lineChart.value)

  // order_option.value.series[0].data = crecoredstats
  order.setOption(order_option.value)
}
</script>

<template>
  <div id="line-chart" ref="lineChart"></div>
</template>

<style lang="scss">
#line-chart {
  width: 100%;
  height: 35%;
}
</style>
