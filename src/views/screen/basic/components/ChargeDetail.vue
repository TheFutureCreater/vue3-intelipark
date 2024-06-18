<script setup>
import * as echarts from 'echarts'
import { onMounted, ref, watch } from 'vue'

import ChargeDailyTrend from '../../Charts/components/ChargeDailyTrend.vue'
import { useScreenStore } from '@/stores'
import ChargingHeatmap from '../../Charts/components/ChargingHeatmap.vue'
const screenStore = useScreenStore()

const charge = ref([])

watch(
  () => screenStore.stats,
  () => {
    window_index.value = 5
    screenStore.detailDaysId = reset_crgData()
  },
  {
    deep: true
  }
)

onMounted(() => {
  crg_init()
})

const daysInMonth = (year, month) => {
  // 确定该月份的天数
  switch (month) {
    case 1: // January
    case 3: // March
    case 5: // May
    case 7: // July
    case 8: // August
    case 10: // October
    case 12: // December
      return 31
    case 4: // April
    case 6: // June
    case 9: // September
    case 11: // November
      return 30
    case 2: // February
      // 判断闰年
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        return 29 // 闰年2月份有29天
      } else {
        return 28 // 平年2月份有28天
      }
    default:
      return -1 // 月份不合法
  }
}

const reset_crgData = () => {
  let d = new Date()
  let sumDays = 0
  // console.log(screenStore.stats.dateCountList[sumDays].electricityCount)
  charge.value.forEach((el, index) => {
    // let value = screenStore.stats.dateCountList[sumDays].electricityCount
    let crt = echarts.init(el)
    let curTime = new Date()
    curTime.setMonth(d.getMonth() - 5 + index)
    curTime.setDate(1)
    let days = daysInMonth(curTime.getFullYear(), curTime.getMonth() + 1)
    // console.log(days)
    // console.log(screenStore.stats.dateCountList[sumDays].electricityCount)
    let newData = []
    let newCrg = []
    let newXAxis = []
    for (let i = 0; i < days && sumDays < screenStore.stats.dateCountList.length; i++) {
      newXAxis.push(curTime.getMonth() + 1 + '-' + (curTime.getDate() + i))
      newData.push({ value: screenStore.stats.dateCountList[sumDays].costCount, id: sumDays })
      newCrg.push({ value: screenStore.stats.dateCountList[sumDays].chargeHours, id: sumDays++ })
    }
    // console.log(
    //   // screenStore.stats.dateCountList[sumDays - 1].date,
    //   screenStore.stats.dateCountList[sumDays - 1].electricityCount
    // )
    crt.setOption({
      xAxis: [
        {
          data: newXAxis
        }
      ],
      series: [
        {
          data: newData
        },
        {
          data: newCrg
        }
      ]
    })
    crt.on('click', 'series', function (param) {
      console.log(param.data.id)
      screenStore.detailDaysId = param.data.id
    })
    crt.getZr().on('click', function (params) {
      // screenStore.detailDaysId =
      let pointInPixel = [params.offsetX, params.offsetY]
      if (crt.containPixel('grid', pointInPixel)) {
        let pointInGrid = crt.convertFromPixel(
          {
            seriesIndex: 0
          },
          pointInPixel
        )
        let xIndex = pointInGrid[0] //索引
        let seriesObj = crt.getOption() //图表object对象
        //获得图表中点击的列
        // var month = op.xAxis[0].data[handleIndex] //获取点击的列名
        // console.log(xIndex)
        // console.log(seriesObj.series[0].data[xIndex].id)
        screenStore.detailDaysId = seriesObj.series[0].data[xIndex].id
      }
    })
  })
  return sumDays - 1
}

// let timer = null

const crg_init = () => {
  charge.value.forEach((el) => {
    let crt = echarts.init(el)
    crt.setOption({
      tooltip: {
        trigger: 'axis',
        // formatter: function (params) {
        //   //   // if (timer === null) {
        //   //   //   timer = setTimeout('console.log(params[0].data.id)', 10)
        //   //   // } else {
        //   //   //   clearTimeout(timer)
        //   //   //   // timer = setTimeout('console.log(params[0].data.id)', 10)
        //   //   // }
        //   // console.log(params[0].data.id)
        //   // return params[0].data.id
        //   return params[0].data.id
        // },
        axisPointer: {
          type: 'shadow'
        },
        feature: {
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      grid: {
        left: '3%',
        right: '6%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: [
            '---',
            '---',
            '---',
            '---',
            '---',
            '---',
            '---',
            '---',
            '---',
            '---',
            '---',
            '---',
            '---',
            '---',
            '---',
            '---',
            '---',
            '---',
            '---',
            '---',
            '---',
            '---',
            '---',
            '---',
            '---',
            '---',
            '---',
            '---',
            '---',
            '---'
          ],
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
          name: '消费',
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#666'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
          axisLabel: {
            formatter: '{value} 元'
          }
        },
        {
          type: 'value',
          name: '充电时长',
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#666'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
          axisLabel: {
            formatter: '{value} 分钟'
          }
        }
      ],
      series: [
        {
          name: '消费',
          type: 'line',
          smooth: true,
          barWidth: '60%',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          itemStyle: {
            borderWidth: 3,
            borderColor: '#fed2ad',
            color: '#e89957'
          }
        },
        {
          name: '充电时长',
          type: 'line',
          smooth: true,
          barWidth: '60%',
          yAxisIndex: 1,
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          itemStyle: {
            borderWidth: 3,
            borderColor: '#ff00ad',
            color: '#82995f'
          }
        }
      ]
    })
  })
}

const viewports = ref()
const window_index = ref(5)

const prev_month = () => {
  if (window_index.value > 0) window_index.value--
}
const post_month = () => {
  if (window_index.value < 5) window_index.value++
}
</script>

<template>
  <div class="detailBox">
    <div class="detail">
      <div
        class="prev"
        :style="{ flex: 1, cursor: window_index == 0 ? 'not-allowed' : 'pointer' }"
        @click="prev_month"
      ></div>
      <div class="column" style="flex: 22; overflow-x: hidden">
        <div class="infomations" ref="viewports" :style="{ left: window_index * -100 + '%' }">
          <div class="viewport" ref="charge" v-for="index in 6" :key="index"></div>
        </div>
      </div>
      <div
        class="post"
        :style="{ flex: 1, cursor: window_index == 5 ? 'not-allowed' : 'pointer' }"
        @click="post_month"
      ></div>
      <div class="column" style="flex: 16">
        <div class="panel">
          <ChargeDailyTrend></ChargeDailyTrend>
        </div>
        <div class="panel">
          <ChargingHeatmap></ChargingHeatmap>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.detailBox {
  position: relative;
  height: 100%;
  width: 100%;
  .detail {
    pointer-events: all;
    display: flex;
    position: absolute;
    width: 90%;
    height: 85%;
    bottom: 5%;
    background: linear-gradient(#043753, #0437539f);
    left: 50%;
    transform: translate(-50%, 0);

    .infomations {
      position: relative;
      width: 600%;
      height: 100%;
      display: flex;
      left: 0%;
      transition: 0.5s;
      overflow: hidden;
      .viewport {
        position: relative;
        height: 100%;
        width: 100%;
      }
    }
    .post,
    .prev {
      text-align: center;
      pointer-events: all;
      float: left;
      height: 100%;
      // background-color: #0002;
      font-size: 24px;
      color: white;
      // cursor: pointer;
      &:hover {
        transition: 0.3s;
        background-color: #fff3;
      }
    }
    .post {
      background: #0002 no-repeat center url(/src/assets/screen/left_arrowhead.svg);
    }
    .prev {
      background: #0002 no-repeat center url(/src/assets/screen/right_arrowhead.svg);
    }
    .column {
      .panel {
        width: 100%;
        height: 50%;
      }
    }
  }
}
</style>
