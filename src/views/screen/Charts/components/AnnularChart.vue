//
<script setup>
// import * as echarts from 'echarts'
// import { onMounted, ref } from 'vue'

// const annularChart = ref()

// const props = defineProps({ curNum: Number, totalNum: Number, curInfo: Number })
// const annular_option = ref({
//   tooltip: {
//     trigger: 'item'
//   },
//   series: [
//     {
//       name: '数量',
//       type: 'pie',
//       radius: ['40%', '70%'],
//       avoidLabelOverlap: false,
//       label: {
//         show: false,
//         position: 'center'
//       },
//       emphasis: {
//         label: {
//           show: true,
//           fontSize: 24,
//           fontWeight: 'bold'
//         }
//       },
//       labelLine: {
//         show: false
//       },
//       data: [
//         { value: 40, name: '' },
//         { value: 100, name: '其他' }
//       ]
//     }
//   ]
// })

// onMounted(() => {
//   annular_option.value.series[0].data[0].value = props.curNum
//   annular_option.value.series[0].data[0].name = props.curInfo
//   annular_option.value.series[0].data[1].value = props.totalNum
//   annularChartInit()
// })
// const annularChartInit = () => {
//   let annular = echarts.init(annularChart.value)
//   // let
//   // console.log('---')
//   // console.log(props.curNum)
//   // console.log(props.curInfo)
//   // console.log(props.totalNum)
//   // console.log('---')

//   annular.setOption(annular_option.value)
// }
//
</script>

<template>
  <div class="annularChartBox" ref="annularChart"></div>
</template>

<style>
/* .annularChartBox {
  width: 100%;
  height: 100%;
  position: relative;
} */
</style>
