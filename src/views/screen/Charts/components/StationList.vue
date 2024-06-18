<script setup>
import { getStationChargingList } from '@/api/station'
// import { useScreenStore } from '@/stores'
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'
// const screenStore = useScreenStore()
const stationList = ref()

onMounted(() => {
  list_init()
  reset_lst()
})

const reset_lst = async () => {
  const res = (await getStationChargingList()).data.data
  let newY = []
  let today = []
  let yestday = []
  let i = 0
  res.forEach((el) => {
    i++
    newY.push(el.stationName)
    today.push(el.todayElectricitySum)
    yestday.push(el.yesterdayElectricitySum)
  })
  if (i < 19) {
    for (; i < 10; i++) {
      newY.push('暂无')
      today.push(0)
      yestday.push(0)
    }
  }
  newY.reverse()
  today.reverse()
  yestday.reverse()
  let lst = echarts.init(stationList.value)
  lst.setOption({
    yAxis: {
      data: newY
    },
    series: [
      {
        name: '今日',
        type: 'bar',
        data: today
      },
      {
        data: yestday
      }
    ]
  })
}

const lst_opt = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
      shadowStyle: {
        color: '#ffffff66'
      }
    }
    // backgroundColor: '#0004'
  },
  legend: {
    bottom: '2%',
    textStyle: {
      color: 'white'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '10%',
    top: '5%',
    containLabel: true
  },
  xAxis: {
    type: 'value',
    boundaryGap: [0, 0.01],
    axisTick: {
      alignWithLabel: true
    },
    axisLine: {
      lineStyle: {
        color: '#fff'
      }
    }
  },
  yAxis: {
    type: 'category',
    data: ['充电站1', '充电站2', '充电站6', '充电站3', '充电站4', '充电站5'],
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
    }
  },
  series: [
    {
      name: '今日',
      type: 'bar',
      data: [182030, 23489, 29034, 104970, 131744, 63023]
    },
    {
      name: '昨日',
      type: 'bar',
      data: [193250, 23438, 31000, 121594, 134141, 68180]
    }
  ]
}

const list_init = () => {
  let lst = echarts.init(stationList.value)
  lst.setOption(lst_opt)
}
</script>

<template>
  <div class="stationList" ref="stationList"></div>
</template>

<style lang="scss" scoped>
.stationList {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
