<script setup>
import * as echarts from 'echarts'
import { onMounted, ref, watch } from 'vue'
import { useScreenStore } from '@/stores'

const trend = ref()
const screenStore = useScreenStore()

watch(
  () => [screenStore.days, screenStore.stats],
  () => refresh_trend(),
  {
    deep: true
  }
)

onMounted(() => {
  TrendInit()
  refresh_trend()
})

const refresh_trend = () => {
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

  let trd = echarts.init(trend.value)
  trd.setOption(newopt)
}

const trend_option = ref({
  title: {
    text: '充电趋势',
    top: '2%',
    textStyle: {
      color: 'white',
      fontSize: '16px'
    }
  },
  grid: {
    // containLabel: true,
    top: '25%',
    left: '10%',
    right: '0%',
    bottom: '15%'
  },
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
      smooth: true,
      lineStyle: {
        color: '#30C2F4',
        width: 3,
        type: 'solid'
      }
    }
  ]
})

const TrendInit = () => {
  let trd = echarts.init(trend.value)
  trd.setOption(trend_option.value)
}
</script>

<template>
  <div class="trend" ref="trend"></div>
</template>

<style lang="scss" scoped>
.trend {
  width: 100%;
  height: 60%;
  bottom: 0;
}
</style>
