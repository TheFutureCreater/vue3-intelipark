<template>
  <div class="weather">
    <span id="place">{{ place }}</span>
    <span id="temperature">{{ temperature }}</span>
    <span id="weather">{{ weather }}</span>
    <span id="humidity">湿度：{{ humidity }} %</span>
    <span id="visibility">能见度：{{ visibility }} km</span>
  </div>
</template>

<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'

const place = ref('')
const temperature = ref('')
const weather = ref('')
const humidity = ref(0)
const visibility = ref(0)

onMounted(() => {
  geoFindMe()
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
  humidity.value = info.data.main.humidity
  visibility.value = info.data.visibility
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
</script>

<style lang="scss">
.weather {
  position: absolute;
  z-index: 10;
  top: 60px;
  left: 0;
  height: 30px;
  width: 100%;
  background: rgba(225, 225, 225, 0.3);
  span {
    color: white;
    font-weight: 700;
    font-size: large;
  }
  #place {
    margin-left: 60px;
    color: rgb(151, 58, 0);
  }
  #temperature {
    margin-left: 30px;
  }
  #weather {
    margin-left: 30px;
    color: rgb(221, 109, 63);
  }
  #humidity {
    margin-left: 30px;
    color: rgb(54, 109, 217);
  }
  #visibility {
    margin-left: 30px;
    color: rgb(29, 174, 61);
  }
}
</style>
