<script setup>
import * as echarts from 'echarts'
import { onMounted, ref, watch } from 'vue'
import ChargingOrders from './ChargingOrders.vue'
import Title from './Title.vue'
import { useScreenStore } from '@/stores'
import { useRoute } from 'vue-router'
import { getEqList } from '@/api/equipments'

const route = useRoute()
const pieChart = ref()
const screenStore = useScreenStore()
const free = ref(0)
const offNetwork = ref(0)
const fault = ref(0)
const occupation = ref(0)
const list = ref({})

watch(
  () => route.query.parkid,
  (newid) => {
    opt_reset(newid)
  }
)

onMounted(() => {
  init()
  opt_reset(route.query.parkid)
  reset_list(route.query.parkid)
})

watch(
  () => route.query.parkid,
  (newid) => reset_list(newid)
)

const reset_list = async (parkid) => {
  list.value = (await getEqList(parkid)).data.data
}

const pie_option = ref({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'horizontal',
    left: 'center',
    textStyle: {
      color: '#fff'
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

const opt_reset = async (parkid) => {
  let pie = echarts.init(pieChart.value)
  await screenStore.refresh_eqState(parkid)

  fault.value = screenStore.EqState.fault
  offNetwork.value = screenStore.EqState.offNetwork
  free.value = screenStore.EqState.free
  occupation.value = screenStore.EqState.occupation
  let data = [
    { value: occupation.value, name: '在用数' },
    { value: free.value, name: '可用数' },
    { value: fault.value, name: '故障数' },
    { value: offNetwork.value, name: '离网数' }
  ]
  pie.setOption({
    series: [
      {
        data: data
      }
    ]
  })
}

//初始化函数
const init = () => {
  // 基于准备好的dom，初始化echarts实例
  let pie = echarts.init(pieChart.value)
  pie_option.value.series[0].data[0].value = occupation.value
  pie_option.value.series[0].data[1].value = free.value
  pie_option.value.series[0].data[2].value = fault.value
  pie_option.value.series[0].data[3].value = offNetwork.value

  pie.setOption(pie_option.value)
  // window.onresize = function () {
  //   //自适应大小
  //   pie.resize()
  // }
}
</script>

<template>
  <div class="leftBox">
    <div class="box">
      <Title content="基础数据"></Title>
      <div id="pie-charts" ref="pieChart"></div>
      <table class="state">
        <thead>
          <tr>
            <td>充电桩号</td>
            <td>开始时间</td>
            <td>当前状态</td>
          </tr>
        </thead>
        <tbody>
          <tr
            :class="{ light: ((index + 1) & 1) === 1 }"
            v-for="(item, index) in list"
            :key="item.connectorId"
          >
            <td>{{ item.connectorId }}</td>
            <td>{{ item.startTime }}</td>
            <td>充电占用中</td>
          </tr>
        </tbody>
      </table>
      <Title content="充电订单"></Title>
      <ChargingOrders></ChargingOrders>
    </div>
  </div>
</template>

<style lang="scss">
.leftBox {
  pointer-events: all;
  position: absolute;
  padding-top: 0;
  padding-left: 20px;
  padding-right: 15px;
  z-index: 10;
  left: 0;
  top: 0px;
  bottom: 15px;
  width: 25%;
  min-width: 310px;
  color: white;
  .box {
    width: 100%;
    height: 100%;
    // border: 2px solid black;
    border-radius: 5px;
    padding: 20px 10px;
    background: linear-gradient(#043753, rgba(0, 0, 0, 0));
    div {
      margin-bottom: 16px;
    }
    #pie-charts {
      width: 100%;
      height: 28%;
      // background-color: #fff;
      // overflow: hidden;
    }

    table {
      width: 100%;
      height: 20%;
      font-size: small;
      text-align: center;
      border-spacing: 0;
      td {
        border-bottom: 1px solid gray;
      }
      .light {
        background-color: rgba(255, 255, 255, 0.3);
        color: white;
      }
    }
  }
}
</style>
