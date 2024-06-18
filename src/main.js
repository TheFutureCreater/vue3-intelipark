import './assets/main.scss'
// import BaiduMap from 'vue-baidu-map-3x'

import { createApp } from 'vue'
import pinia from '@/stores/index'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(pinia)
app.use(router)

// app.use(BaiduMap, {
//   ak: 'VMzd9KuZ4TQcLQT1kjiyVfDcCIESbuDM'
//   // v:'2.0',  // 默认使用3.0
//   // type: 'WebGL' // ||API 默认API  (使用此模式 BMap=BMapGL)
// })

app.mount('#app')
