<script setup>
import { getChargingSubselctions } from '@/api/charge'
import StationList from '../../Charts/components/StationList.vue'
import Situation from '../../Charts/components/StationSituation.vue'
import * as echarts from 'echarts'
import { onMounted, ref, watch } from 'vue'
import { useScreenStore } from '@/stores'
const screenStore = useScreenStore()

const station = ref()
const topCount = ref(0)
const highCount = ref(0)
const lowCount = ref(0)
const normalCount = ref(0)

onMounted(() => {
  st_init()
})

watch(
  () => screenStore.stationId,
  () => reset_subsections()
)

const reset_subsections = async () => {
  const res = (await getChargingSubselctions(screenStore.stationId, screenStore.today)).data.data
  topCount.value = res.topCount
  highCount.value = res.highCount
  lowCount.value = res.lowCount
  normalCount.value = res.normalCount

  // let visualMap = []
  // let pieces = []
  let data = []

  for (let i = 0; i < res.subsectionsCounts.length; i++) {
    let start = getSeriesIndex(res.subsectionsCounts[i].feeFormat.startTime)
    let end = 23
    if (i < res.subsectionsCounts.length - 1)
      end = getSeriesIndex(res.subsectionsCounts[i + 1].feeFormat.startTime)
    // pieces.push({
    //   min: start,
    //   max: end,
    //   color: getColor(res.subsectionsCounts[i].feeFormat.feeType)
    // })
    data.push([
      start + 'h',
      end - start,
      res.subsectionsCounts[i].count,
      res.subsectionsCounts[i].feeFormat.startTime,
      [res.subsectionsCounts[i].feeFormat.elecPrice, res.subsectionsCounts[i].feeFormat.servicePrice]
    ])
  }
  let st = echarts.init(station.value)
  st.setOption({
    // visualMap: [
    //   {
    //     pieces: pieces
    //   }
    // ]
    series: [
      {
        data: data.map((item, index) => {
          return {
            value: item,
            itemStyle: {
              color: getColor(res.subsectionsCounts[index].feeFormat.feeType)
            }
          }
        })
      }
    ]
  })
}

const getSeriesIndex = (timeStr) => {
  // "123".substring
  let hour = timeStr.substring(0, 2)
  return parseInt(hour)
}

const getColor = (type) => {
  //  0   1   2   3
  //  尖  峰  平  谷
  switch (type) {
    case 0:
      return '#ff3400'
    case 1:
      return '#ff6699'
    case 2:
      return '#39ff005f'
    case 3:
      return '#66ccff'
    default:
      return 'black'
  }
}

const st_init = () => {
  let st = echarts.init(station.value)
  const st_opt = {
    title: {
      text: '今天电量',
      textStyle: {
        color: 'white'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (datas) {
        var res =
          '开始时间:' +
          datas[0].value[3] +
          '<br/>' +
          '电费价格:' +
          datas[0].value[4][0] +
          '<br/>' +
          '服务费价格:' +
          datas[0].value[4][1] +
          '<br/>' +
          '用电量:' +
          datas[0].value[2]
        //   val
        // for (var i = 0, length = datas.length; i < length; i++) {
        //   val = datas[i].value * 100 + '%'
        //   res += datas[i].seriesName + '：' + val + '<br/>'
        // }
        // console.log(datas)
        return res
      }
    },
    legend: {
      data: ['今天电量'],
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
      boundaryGap: true,
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
      }
    },
    series: [
      {
        // name: '当日电量',
        type: 'custom',
        renderItem: function (params, api) {
          // 通过值获取图形在图表里的像素坐标
          var start = api.coord([api.value(0), api.value(2)])

          // 通过值获取图形在图表里的宽和高
          var size = api.size([api.value(0), api.value(2)])

          // 因为x轴是均匀的12份，所以一份的宽度就是 All/12
          // params.coordSys.width 整个图型的宽度
          var width = params.coordSys.width / 24

          // 输出
          return {
            type: 'rect',
            shape: {
              // x轴上 柱的起始坐标
              x: start[0],

              // y轴上 柱的结束坐标
              y: start[1],

              // 柱的宽度
              width: width * api.value(1),

              // 柱的高度
              height: size[1]

              // 生成一个矩形需要知道xy的最大最小来确定范围
              // xMax = x + width; xMin = x
              // yMax = y; yMin = y - height
            },
            style: api.style()
          }
        },
        encode: {
          //  x轴使用data里的第一个维度数据
          x: 0,

          //  y轴使用data里的第三个维度数据
          y: 2,

          // 图例使用data里的第三个维度数据
          tooltip: 2,

          // 名称使用data里的第四个维度数据
          itemName: 3,
          itemStyle: {
            color: 5
          }
        },

        // data: [
        //   100, 100, 100, 100, 100, 100, 75, 75, 75, 75, 75, 75, 50, 50, 50, 50, 50, 50, 25, 25, 25, 25,
        //   25, 25
        // ],
        // data: [100, 75, 50, 25],
        data: [
          ['0h', 6, 0, 'a', [0, 0]],
          ['6h', 6, 0, 'b', [0, 0]],
          ['12h', 6, 0, 'c', [0, 0]],
          ['18h', 6, 0, 'd', [0, 0]]
        ].map((item, index) => {
          return {
            value: item,
            itemStyle: {
              color: ['#66CCFF', '#ff6699', '#ccff99', '#394fd3'][index]
            }
          }
        }),

        areaStyle: {
          opacity: 0.3
        },
        smooth: true
      }
    ]
  }
  st.setOption(st_opt)
}
</script>

<template>
  <div class="station">
    <div class="shell">
      <div class="column1">
        <StationList></StationList>
      </div>
      <div class="column2">
        <div style="height: 50%">
          <Situation></Situation>
        </div>
        <div style="height: 10%; display: flex; text-align: center; font-weight: 700; font-size: large">
          <div
            style="
              flex: 1;
              background-color: #ff3400;
              border-radius: 12px;
              height: 85%;
              margin-right: 20px;
            "
          >
            尖时电量<br />{{ topCount }}
          </div>
          <div
            style="
              flex: 1;
              background-color: #ff6699;
              border-radius: 12px;
              height: 85%;
              margin-right: 20px;
            "
          >
            峰时电量<br />{{ highCount }}
          </div>
          <div
            style="
              flex: 1;
              background-color: #39ff005f;
              border-radius: 12px;
              height: 85%;
              margin-right: 20px;
            "
          >
            平时电量<br />{{ normalCount }}
          </div>
          <div style="flex: 1; background-color: #66ccff; border-radius: 12px; height: 85%">
            谷时电量<br />{{ lowCount }}
          </div>
        </div>
        <div style="height: 40%" ref="station"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.station {
  position: relative;
  height: 100%;
  width: 100%;
  // background-color: #fff;
  // padding-top: 2%;
  .shell {
    position: absolute;
    top: 60px;
    bottom: 0;
    width: 100%;
    // background-color: #fff;
    pointer-events: all;
    display: flex;
    // backdrop-filter: blur(2px);
    .column1 {
      flex: 6;

      background: linear-gradient(#043753, #0437539f);
      flex-direction: column;
      // background-color: #fff4;
      border-radius: 12px;
    }
    .column2 {
      flex: 4;
      background: linear-gradient(#043753, #0437539f);
      // border-radius: 12px;
      // flex-direction: column;
      // display: flex;
      color: white;
      // .panel1 {
      //   // background-color: #0000;
      // }
      // .panel2 {
      //   // background-color: #0000;
      // }
    }
  }
}
</style>
