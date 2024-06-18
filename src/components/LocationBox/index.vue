<!-- eslint-disable no-undef -->
<script setup>
import { LocationFilled, Location } from '@element-plus/icons-vue'
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
import { ref, onMounted, computed } from 'vue'
import { getStationInfoListService } from '@/api/station'

const upperProps = defineProps({
  lng: {
    type: Number
  },
  lat: {
    type: Number
  }
})
var map,
  zoom,
  geocode,
  currentP,
  // localsearch,
  resultAddress = '未输入地址信息',
  markerArray = [],
  markerLabelArray = []
const emit = defineEmits(['get-location'])
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

// 开启地图点击事件
const addMapClick = () => {
  removeMapClick()
  isMapClick.value = true
  map.addEventListener('click', getGeocodeAddress)
}

// 关闭地图点击事件
const removeMapClick = () => {
  isMapClick.value = false
  map.removeEventListener('click', getGeocodeAddress)
}

// 逆地理编码获取
const getGeocodeAddress = (e) => {
  currentP = e
  geocode.getLocation(e.lnglat, MapClick)
}

// 地图点击事件
const MapClick = async (result) => {
  if (result.getStatus() == 0) resultAddress = result.getAddress()
  else resultAddress = '获取详细地址信息失败'
  emit('get-location', {
    lng: currentP.lnglat.getLng(),
    lat: currentP.lnglat.getLat(),
    address: resultAddress
  })
  console.log(currentP.lnglat.getLng() + '，' + currentP.lnglat.getLat() + JSON.stringify(resultAddress))
}

// 展示地图标签
const showMarkerOverLay = () => {
  showLabel.value = true
  showMarker.value = true
  markerArray.forEach((marker) => {
    marker.show()
  })
  markerLabelArray.forEach((markerLabel) => {
    markerLabel.show()
  })
}

// 隐藏地图标签
const hideMarkerOverLay = () => {
  showLabel.value = false
  showMarker.value = false
  markerArray.forEach((marker) => {
    marker.hide()
  })
  markerLabelArray.forEach((markerLabel) => {
    markerLabel.hide()
  })
}

// 展示地图标签文字
const showLabelOverLay = () => {
  showLabel.value = true
  markerLabelArray.forEach((markerLabel) => {
    markerLabel.show()
  })
}

// 隐藏地图标签文字
const hideLabelOverLay = () => {
  showLabel.value = false
  markerLabelArray.forEach((markerLabel) => {
    markerLabel.hide()
  })
}

// 地图加载
const loadMap = async () => {
  await getStationInfoList()
  loadJs('http://api.tianditu.gov.cn/api?v=4.0&tk=db59fa63c535be8d887a1e4989f2a542').then(() => {
    // 加载成功，进行后续操作
    const T = window.T
    map = new T.Map('mapDiv', { datasourcesControl: true })
    zoom = 17
    map.centerAndZoom(new T.LngLat(upperProps.lng || 103.98603, upperProps.lat || 30.58488), zoom)
    // map.enableScrollWheelZoom()
    var ctrl = new T.Control.MapType({ position: T_ANCHOR_BOTTOM_RIGHT })
    map.addControl(ctrl) //添加控件
    geocode = new T.Geocoder() //创建逆地理编码对象
    map.addEventListener('click', getGeocodeAddress)

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

// 设置十字准星样式
const mapCursorStyle = computed(() => {
  return isMapClick.value ? { cursor: 'crosshair' } : {}
})

onMounted(() => {
  // hideLabelOverLay()
  console.log(markerArray)
  console.log(JSON.stringify(markerArray))
})
</script>

<template>
  <div class="location-box">
    <div class="map-inner-top-right">
      <el-tooltip :content="isMapClick ? '结束标点' : '开始标点'" placement="left" effect="light">
        <div class="top-right-button" v-if="isMapClick" @click="removeMapClick">
          <el-icon size="25"><LocationFilled /></el-icon>
        </div>
        <div class="top-right-button" v-else @click="addMapClick">
          <el-icon size="25"><Location /></el-icon>
        </div>
      </el-tooltip>
      <span style="display: block; width: 80%; height: 1px; background-color: #cccccc"></span>
      <el-tooltip :content="showMarker ? '隐藏标点' : '显示标点'" placement="left" effect="light">
        <div class="top-right-button" v-if="showMarker" @click="hideMarkerOverLay">
          <el-image style="width: 20px; height: 20px" :src="showSvg" />
        </div>
        <div class="top-right-button" v-else @click="showMarkerOverLay">
          <el-image style="width: 20px; height: 20px" :src="hideSvg" />
        </div>
      </el-tooltip>
      <span style="display: block; width: 80%; height: 1px; background-color: #cccccc"></span>
      <el-tooltip :content="showLabel ? '隐藏名称' : '显示名称'" placement="left" effect="light">
        <div class="top-right-button" v-if="showLabel" @click="hideLabelOverLay">
          <el-image style="width: 20px; height: 20px" :src="labelShowSvg" />
        </div>
        <div class="top-right-button" v-else @click="showLabelOverLay">
          <el-image style="width: 20px; height: 20px" :src="labelHideSvg" />
        </div>
      </el-tooltip>
    </div>
    <div id="mapDiv" :style="mapCursorStyle"></div>
  </div>
</template>

<style lang="scss" scoped>
.location-box {
  user-select: none;
  position: relative;
  height: 100%;
  width: 100%;

  .map-inner-top-left {
    position: absolute;
    z-index: 1;
    top: 10px;
    left: 10px;
    // height: 200px;
    // width: 200px;
  }

  .map-inner-left-search-box {
    position: absolute;
    z-index: 1;
    top: 58px;
    left: 10px;
    width: 350px;
    background-color: #fff;
    border-radius: 3px;
    border: 1px solid #dcdfe6;
    // display: flex;
    // flex-direction: column;

    .search-box-header {
      padding: 10px;
      border-bottom: 1px solid #dcdfe6;
      font-size: 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .search-box-body {
      height: 240px;

      .box-body {
        width: 100%;
        padding: 0 10px;

        .body-item {
          width: 330px;
          height: 60px;
          border-bottom: 1px solid #dcdfe6;
        }
      }

      .box-body:hover {
        background-color: #fbfbfb;
      }
    }
  }

  .map-inner-top-right {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    z-index: 1;
    top: 10px;
    right: 10px;
    // height: 200px;
    // width: 200px;
    background-color: #fff;
    border-radius: 4px;

    .top-right-button {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      width: 40px;
      border-radius: 4px;
      cursor: pointer;
    }

    .top-right-button:hover {
      background-color: #f2f2f2;
    }
  }

  #mapDiv {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
}
</style>
