<!-- eslint-disable no-unused-vars -->
<script setup>
import { LocationFilled, Location /* Search, CloseBold */ } from '@element-plus/icons-vue'
import labelShowSvg from '@/assets/icons/labelShow.svg'
import labelHideSvg from '@/assets/icons/labelHide.svg'
import showSvg from '@/assets/icons/show.svg'
import hideSvg from '@/assets/icons/hide.svg'
import locateRedSvg from '@/assets/icons/充电站红.svg'
import locateBlueSvg from '@/assets/icons/充电站蓝.svg'
import locateGraySvg from '@/assets/icons/充电站灰.svg'
import locateOrangeSvg from '@/assets/icons/充电站橙.svg'
import locateCyanSvg from '@/assets/icons/充电站青.svg'
import loadJs from '@/utils/load.js'
import stationConstructionStatic from '@/assets/json/stationConstruction'
import stationStatusStatic from '@/assets/json/stationStatus'
import stationTypeStatic from '@/assets/json/stationType'
import { ref } from 'vue'
import { getStationInfoListService } from '@/api/station'
// import { onMounted } from 'vue'

var map,
  zoom,
  geocode,
  currentP,
  // localsearch,
  resultAddress = '未输入地址信息',
  markerArray = [],
  markerLabelArray = []
const isMapClick = ref(true)
const showMarker = ref(true)
const showLabel = ref(true)
const pageTotal = ref(0)
const stationData = ref([])
const pageData = ref({
  pageNum: 1,
  pageSize: 100
})

// 请求后端获取信息
const getStationInfoList = async () => {
  const rs = await getStationInfoListService(pageData.value)
  pageTotal.value = rs.data.data.totalRow
  stationData.value = rs.data.data.records
}

const loadMap = async () => {
  loadJs('http://api.tianditu.gov.cn/api?v=4.0&tk=db59fa63c535be8d887a1e4989f2a542').then(async () => {
    await getStationInfoList()
    // 加载成功，进行后续操作
    const imageURL =
      'http://t0.tianditu.gov.cn/img_w/wmts?' +
      'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles' +
      '&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=db59fa63c535be8d887a1e4989f2a542'
    const T = window.T
    const lay = new T.TileLayer(imageURL, { minZoom: 1, maxZoom: 18 })
    const config = { layers: [lay] }
    const map = new T.Map('mapDiv', config)
    const zoom = 16
    map.centerAndZoom(new T.LngLat(103.9858, 30.58375), zoom)
    map.enableScrollWheelZoom()
    //创建标注对象
    //创建标注对象
    for (var i = 0; i < stationData.value.length; i++) {
      var locateSvg
      if (stationData.value[i].stationStatus === 50) locateSvg = locateCyanSvg
      else if (stationData.value[i].stationStatus === 6) locateSvg = locateOrangeSvg
      else if (stationData.value[i].stationStatus === 5) locateSvg = locateRedSvg
      else if (stationData.value[i].stationStatus === 1) locateSvg = locateBlueSvg
      else locateSvg = locateGraySvg
      var icon = new T.Icon({
        iconUrl: locateSvg,
        iconSize: new T.Point(36, 45),
        iconAnchor: new T.Point(18, 45)
      })
      var marker = new T.Marker(
        new T.LngLat(stationData.value[i].stationLng, stationData.value[i].stationLat),
        { icon: icon }
      ) // 创建标注
      map.addOverLay(marker) //添加标注
      var markerLabel = new T.Label({
        text: `<b>${stationData.value[i].stationName}<b>`,
        position: marker.getLngLat(),
        offset: new T.Point(5, -25)
      }) // 创建文字
      map.addOverLay(markerLabel) // 添加文字
      var sContent = `
            <div style="user-select: text; font-size: 14px">
              <div style="cursor: text;">
                <strong>站点名称：</strong> ${stationData.value[i].stationName} <br />
                <strong>充电费率：</strong> ${stationData.value[i].electricityFee} 元/KW·h <br />
                <strong>服务费率：</strong> ${stationData.value[i].serviceFee} 元/h <br />
                <strong>停车费率：</strong> ${stationData.value[i].parkFee} 元/h <br />
                <strong>站点类型：</strong> ${stationTypeStatic.find((item) => item.key === stationData.value[i].stationType).value} <br />
                <strong>站点状态：</strong> ${stationStatusStatic.find((item) => item.key === stationData.value[i].stationStatus).value} <br />
                <strong>建设场所：</strong> ${stationConstructionStatic.find((item) => item.key === stationData.value[i].stationConstruction).value} <br />
                <strong>服务电话：</strong> ${stationData.value[i].serviceTel} <br />
                <strong>经纬坐标：</strong> ${stationData.value[i].stationLng}，${stationData.value[i].stationLat} <br />
                <strong>详细地址：</strong> ${stationData.value[i].stationAddress} <br />
                <div style="width: 100%; text-align: end; user-select: none; margin-top: 10px">
                  <a href="${window.location.host}/admin/basic/equip?stationId=${stationData.value[i].stationId}" style="color: #2a81cb; cursor: pointer">查看详情→</a>
                </div>
              </div>
            </div>`
      addClickHandler(sContent, marker) // 点击事件
      markerArray.push(marker)
      markerLabelArray.push(markerLabel)
    }

    // 创建点击事件
    function addClickHandler(content, marker) {
      marker.addEventListener('click', function (e) {
        openInfo(content, e)
      })
    }
    //开启信息窗口
    function openInfo(content, e) {
      var point = e.lnglat
      marker = new T.Marker(point) // 创建标注
      var markerInfoWin = new T.InfoWindow(content, { offset: new T.Point(0, -30) }) // 创建信息窗口对象
      map.openInfoWindow(markerInfoWin, point) //开启信息窗口
    }
  })
}
loadMap()
</script>

<template>
  <div id="mapDiv"></div>
</template>

<style lang="scss" scoped>
#mapDiv {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
}
</style>
