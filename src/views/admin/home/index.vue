<script setup>
import * as echarts from 'echarts'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { getUserInfoListService } from '@/api/user'

const place = ref('')
const temperature = ref('')
const weather = ref('')
const regNum = ref(0)
const pieChart = ref()
const lineChart = ref()

onMounted(() => {
  init()
  geoFindMe()
  LineChartInit()
})

const getWeather = async (lat, lon) => {
  const info = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
    params: {
      lat: lat,
      lon: lon,
      appid: '164e165ac5917a9306610abeb50ed15c',
      lang: 'zh_cn',
      units: 'metric'
    }
  })
  console.log(info.data)
  place.value = info.data.name
  temperature.value = info.data.main.temp + '℃'
  weather.value = info.data.weather[0].description
}

const geoFindMe = () => {
  const status = document.querySelector('#place')

  function success(position) {
    const latitude = position.coords.latitude
    const longitude = position.coords.longitude
    getWeather(latitude, longitude)
  }

  function error() {
    status.textContent = '无法获取你的位置'
  }

  if (!navigator.geolocation) {
    status.textContent = '你的浏览器不支持地理位置'
  } else {
    status.textContent = '定位中……'
    navigator.geolocation.getCurrentPosition(success, error)
  }
}

const getRegUserNum = async () => {
  const rs = await getUserInfoListService({ pageNum: 1, pageSize: 1 })
  regNum.value = rs.data.data.totalRow
}
getRegUserNum()

const pie_option = ref({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'horizontal',
    left: 'center',
    textStyle: {
      color: '#000'
    }
  },
  series: [
    {
      top: '0%',
      name: '数量',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 12, name: '在用数' },
        { value: 447, name: '可用数' },
        { value: 2, name: '故障数' },
        { value: 10, name: '离网数' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(255, 255, 255, 0.5)'
        }
      }
    }
  ]
})

//初始化函数
const init = () => {
  // 基于准备好的dom，初始化echarts实例
  let pie = echarts.init(pieChart.value)

  pie.setOption(pie_option.value)
}

const order_option = ref({
  xAxis: {
    type: 'category',
    data: ['5-17', '5-18', '5-19', '5-20', '5-21', '5-22', '5-23'],
    axisLine: {
      lineStyle: {
        color: '#000'
      }
    }
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        type: 'dashed',
        color: '#000'
      }
    },
    axisLine: {
      lineStyle: {
        color: '#000'
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
  <BoxContainer>
    <BoxItem :title="true" size="150">
      <template #header>
        <span>园区气象</span>
      </template>
      <template #content>
        <div class="weather-box">
          <span id="place">{{ place }}</span
          ><br />
          <span id="temperature">{{ temperature }}</span>
          <span id="weather">{{ weather }}</span>
        </div>
      </template>
    </BoxItem>
    <BoxItem :title="true" size="150">
      <template #header>
        <span>已注册用户</span>
      </template>
      <template #content>
        <div class="reg-num-box">
          <span> 当前已注册 {{ regNum }} 个用户 </span>
        </div>
      </template>
    </BoxItem>
  </BoxContainer>

  <BoxContainer>
    <BoxItem :title="true" size="400">
      <template #header>
        <span>充电设备使用状况</span>
      </template>
      <template #content>
        <div id="pie-charts" ref="pieChart"></div>
      </template>
    </BoxItem>
    <BoxItem :title="true" size="400">
      <template #header>
        <span>充电订单状况使用状况</span>
      </template>
      <template #content>
        <div id="line-chart" ref="lineChart"></div>
      </template>
    </BoxItem>
  </BoxContainer>
</template>

<style lang="scss" scoped>
.weather-box {
  text-align: center;
  padding: 0 10px;

  span {
    font-weight: 700;
  }
  #place {
    font-size: 50px;
  }
  #temperature {
    font-size: 25px;
    margin-right: 30px;
  }
  #weather {
    font-size: 25px;
    color: rgb(221, 109, 63);
  }
}

.reg-num-box {
  padding: 0 20px;
  font-weight: 600;
  font-size: 50px;
}

#pie-charts {
  width: 400px;
  height: 300px;
}

#line-chart {
  width: 600px;
  height: 300px;
}
</style>
