<template>
  <div class="barBox" ref="bar"></div>
</template>

<script setup>
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'

const bar = ref()

onMounted(() => {
  barBoxInit()
})
const barBoxInit = () => {
  let barChart = echarts.init(bar.value)
  const bar_option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisTick: {
          alignWithLabel: true
        },
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        }
      }
    ],
    series: [
      {
        name: 'Direct',
        type: 'bar',
        barWidth: '60%',
        data: [10, 52, 200, 334, 390, 330, 220]
      }
    ]
  }
  barChart.setOption(bar_option)
}
</script>

<style lang="scss">
.barBox {
  width: 100%;
  height: 100%;
  position: relative;
  // background-color: #000;
}
</style>
