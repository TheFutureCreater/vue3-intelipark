<template>
  <div class="deviceUsage" ref="device"></div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import * as echarts from 'echarts'
import 'echarts-liquidfill'
import { onMounted, ref, watch } from 'vue'
import { useScreenStore } from '@/stores'
const route = useRoute()
const screenStore = useScreenStore()
const device = ref()
const rates = [0.875, 0.75, 0.625, 0.5, 0.375, 0.25, 0.125, 0]
const colors = ['blue', 'cyan', 'green', 'chartreuse', 'yellow', 'orange', 'brown', 'red']
const uc_option = ref({
  title: {
    text: '充电桩使用率',
    left: 'center',
    // bottom: '10%',
    textStyle: {
      color: 'white',
      fontSize: '24px'
    }
  },
  series: [
    {
      type: 'liquidFill',
      data: [1],
      color: ['blue'],
      center: ['50%', '60%'],
      radius: '70%',
      label: {
        formatter: '使用率',
        fontSize: 20
      },
      itemStyle: {
        opacity: 0.6
      },
      emphasis: {
        itemStyle: {
          opacity: 0.9
        }
      }
    }
  ]
})

onMounted(() => {
  UsageChartInit()
  UsageChart_reset(route.query.parkid)
})

watch(
  () => route.query.parkid,
  (newid) => UsageChart_reset(newid)
)

const UsageChart_reset = async (parkid) => {
  await screenStore.refresh_usingRate(parkid)
  // let usingRate = 100

  let color = 'red'
  // let rate = usingRate / 100.0
  for (let i = 0; i < rates.length; i++) {
    if (screenStore.rate >= rates[i]) {
      color = colors[i]
      break
    }
  }

  const newOpt = {
    series: [
      {
        data: [screenStore.rate],

        color: [color],
        label: {
          formatter: '使用率' + screenStore.eqUsingRate + '%'
        }
      }
    ]
  }

  let usageChart = echarts.init(device.value)
  usageChart.setOption(newOpt)
}

const UsageChartInit = () => {
  let usageChart = echarts.init(device.value)
  usageChart.setOption(uc_option.value)
}
</script>

<style lang="scss" scoped>
.deviceUsage {
  width: 100%;
  height: 100%;
  // background-color: cyan
  position: relative;
}
</style>
