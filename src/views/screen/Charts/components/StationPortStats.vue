<script setup>
import { useScreenStore } from '@/stores'
import * as echarts from 'echarts'
import { onMounted, ref, watch } from 'vue'
const screenStore = useScreenStore()
const port = ref()

watch(
  () => screenStore.stationId,
  async () => {
    await screenStore.refresh_ConnectorStatus()
    data[0].value = screenStore.connectorStatus.fastTotal
    data[1].value = screenStore.connectorStatus.slowTotal
    reset_p()
  }
)

const reset_p = () => {
  let p = echarts.init(port.value)
  p.setOption({
    series: [
      {
        data: data
      }
    ]
  })
}

onMounted(() => {
  portChart_init()
})

let data = [
  { value: 0, name: '快充' },
  { value: 0, name: '慢充' }
]
const p_opt = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: 'middle',
    right: '10%',
    orient: 'vertical',
    formatter: function (name) {
      // 添加
      let total = 0
      let target
      for (let i = 0; i < data.length; i++) {
        total += data[i].value
        if (data[i].name === name) {
          target = data[i].value
        }
      }
      var arr =
        total != 0
          ? [name + '                ', ((target / total) * 100).toFixed(2) + '%               ', target]
          : [name + '                ', (0).toFixed(2) + '%               ', target]
      return arr.join('  ')
    },
    textStyle: {
      // 添加
      padding: [8, 0, 0, 0],
      color: 'white',
      rich: {
        a: {
          fontSize: 15,
          width: 110
        },
        b: {
          fontSize: 15,
          width: 70,
          color: '#c1c1c1'
        },
        c: {
          fontSize: 15
        }
      }
    }
  },
  series: [
    {
      type: 'pie',
      left: '0%',
      center: ['24%', '50%'],
      radius: ['70%', '80%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '20',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: data
    }
  ]
}
const portChart_init = () => {
  let p = echarts.init(port.value)
  p.setOption(p_opt)
}
</script>
<template>
  <div class="portStats" ref="port"></div>
</template>
<style scoped lang="scss">
.portStats {
  height: 100%;
  width: 100%;
  //   background-color: blue;
}
</style>
