<script setup>
import { useScreenStore } from '@/stores'
import * as echarts from 'echarts'
import { onMounted, ref, watch } from 'vue'
const screenStore = useScreenStore()

const trend = ref()

onMounted(() => {
  trend_init()
  // reset_dailyData()
})

watch(
  () => screenStore.detailDaysId,
  () => reset_dailyData()
)

const reset_dailyData = () => {
  // console.log(screenStore.stats.dateCountList)
  if (screenStore.detailDaysId >= screenStore.stats.dateCountList.length) {
    return
  }
  let dailyData = []
  screenStore.stats.dateCountList[screenStore.detailDaysId].timeCount.forEach((el) => {
    // console.log(el.electricityCount)
    dailyData.push(el.electricityCount)
  })

  let c = echarts.init(trend.value)
  c.setOption({
    series: [
      {
        name: '当日电量',
        data: dailyData
      }
    ]
  })
}

const trend_init = () => {
  let c = echarts.init(trend.value)
  let c_opt = {
    title: {
      text: '当日用量',
      textStyle: {
        color: 'white'
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['当日电量', '今天电量'],
      textStyle: {
        color: 'white'
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
      data: [
        '0h',
        '1h',
        '2h',
        '3h',
        '4h',
        '5h',
        '6h',
        '7h',
        '8h',
        '9h',
        '10h',
        '11h',
        '12h',
        '13h',
        '14h',
        '15h',
        '16h',
        '17h',
        '18h',
        '19h',
        '20h',
        '21h',
        '22h',
        '23h'
      ],
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
          color: '#999'
        }
      },
      axisLine: {
        lineStyle: {
          color: '#fff'
        }
      },
      axisLabel: {
        formatter: '{value} 度'
      }
    },
    series: [
      {
        name: '当日电量',
        type: 'line',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        areaStyle: {
          opacity: 0.3
        },
        smooth: true
      }
    ]
  }
  c.setOption(c_opt)
}
</script>
<template>
  <div style="height: 100%; width: 100%" ref="trend"></div>
</template>

<style lang="scss" scoped></style>
