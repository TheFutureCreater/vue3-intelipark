<script setup>
import BasicConnector from './BasicConnector.vue'
import BasicEquipment from './BasicEquipment.vue'
import BasicStation from './BasicStation.vue'
import BasicOperator from './BasicOperator.vue'
import BasicPark from './BasicPark.vue'
import { Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useFacilityStore } from '@/stores'
import parkSvg from '@/assets/icons/园区.svg'
import operatorSvg from '@/assets/icons/运营商.svg'
import stationSvg from '@/assets/icons/充电站01.svg'
import equipmentSvg from '@/assets/icons/充电设备.svg'
import connectorSvg from '@/assets/icons/充电接口.svg'

// import { useRouter } from 'vue-router'

// const router = useRouter()
const segmentedMap = [
  {
    value: '园区',
    label: '园区',
    img: parkSvg
  },
  {
    value: '运营商',
    label: '运营商',
    img: operatorSvg
  },
  {
    value: '充电站',
    label: '充电站',
    img: stationSvg
  },
  {
    value: '充电设备',
    label: '充电设备',
    img: equipmentSvg
  },
  {
    value: '设备接口',
    label: '设备接口',
    img: connectorSvg
  }
]
const facilityStore = useFacilityStore()
const stationRef = ref()
const equipmentRef = ref()
const connectorRef = ref()
const parkRef = ref()
const operatorRef = ref()

// 响应更改url参数
const handleUrlChange = () => {
  const urlParams = new URLSearchParams(window.location.search)
  urlParams.set('stage', facilityStore.stageValue)
  urlParams.delete('parkId')
  urlParams.delete('operatorId')
  urlParams.delete('stationId')
  urlParams.delete('equipmentId')
  switch (facilityStore.stageValue) {
    case '充电站':
      if (facilityStore.fatherId[0]) {
        if (facilityStore.parkOrOperator === '园区') urlParams.set('parkId', facilityStore.fatherId[0])
        else urlParams.set('operatorId', facilityStore.fatherId[0])
      }
      break
    case '充电设备':
      if (facilityStore.fatherId[1]) urlParams.set('stationId', facilityStore.fatherId[1])
      break
    case '设备接口':
      if (facilityStore.fatherId[2]) urlParams.set('equipmentId', facilityStore.fatherId[2])
      break
  }

  // 检查 urlParams 是否包含任何参数
  const newUrl = urlParams.toString() === '' ? window.location.pathname : `?${urlParams}`
  // 使用当前的 history.state
  const currentState = history.state ? history.state : null
  // 替换当前历史记录，同时保留现有的 history.state
  window.history.replaceState(currentState, '', newUrl)
}

// 获取url请求参数
const getUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const stage = urlParams.get('stage')
  const parkId = urlParams.get('parkId')
  const operatorId = urlParams.get('operatorId')
  const stationId = urlParams.get('stationId')
  const equipmentId = urlParams.get('equipmentId')

  if (stage) facilityStore.stageValue = stage
  facilityStore.fatherId[0] = parkId || operatorId || 0
  facilityStore.fatherId[1] = stationId || 0
  facilityStore.fatherId[2] = equipmentId || 0
  handleUrlChange()
}
getUrlParams()

// 信息添加逻辑
const handleAdd = () => {
  console.log('信息添加逻辑')
  switch (facilityStore.stageValue) {
    case '园区':
      parkRef.value.handleAdd()
      break
    case '运营商':
      operatorRef.value.handleAdd()
      break
    case '充电站':
      stationRef.value.handleAdd()
      break
    case '充电设备':
      equipmentRef.value.handleAdd()
      break
    case '设备接口':
      connectorRef.value.handleAdd()
      break
    default:
      return
  }
}

const handleStageChange = () => {
  switch (facilityStore.stageValue) {
    case '充电站':
      facilityStore.fatherId[0] = 0
      break
    case '充电设备':
      facilityStore.fatherId[1] = 0
      break
    case '设备接口':
      facilityStore.fatherId[2] = 0
      break
  }
  console.log('handleStageChange')
  handleUrlChange()
}
</script>

<template>
  <PageContainer :title="true">
    <template #header>
      <span style="margin-right: 10px">场所设备信息管理</span>

      <div class="custom-style">
        <el-segmented
          block
          v-model="facilityStore.stageValue"
          :options="segmentedMap"
          style="width: 550px"
          @change="handleStageChange"
        >
          <template #default="{ item }">
            <div class="svg-text">
              <el-image style="width: 18px; height: 18px; margin-right: 3px" :src="item.img" />
              <span>{{ item.label }}</span>
            </div>
          </template>
        </el-segmented>
      </div>

      <div style="display: flex">
        <el-button type="success" @click="handleAdd" :icon="Plus">添加</el-button>
      </div>
    </template>

    <template #content>
      <BasicPark
        v-if="facilityStore.stageValue === '园区'"
        ref="parkRef"
        @url-change="handleUrlChange"
      />
      <BasicOperator
        v-if="facilityStore.stageValue === '运营商'"
        ref="operatorRef"
        @url-change="handleUrlChange"
      />
      <BasicStation
        v-if="facilityStore.stageValue === '充电站'"
        ref="stationRef"
        @url-change="handleUrlChange"
      />
      <BasicEquipment
        v-if="facilityStore.stageValue === '充电设备'"
        ref="equipmentRef"
        @url-change="handleUrlChange"
      />
      <BasicConnector
        v-if="facilityStore.stageValue === '设备接口'"
        ref="connectorRef"
        @url-change="handleUrlChange"
      />
    </template>
  </PageContainer>
</template>

<style lang="scss" scoped>
.park-and-operator {
  width: 100%;
}

.custom-style .el-segmented {
  --el-segmented-item-selected-color: var(--el-text-color-primary);
  --el-segmented-item-selected-bg-color: #ffd100;
  --el-border-radius-base: 5px;
  user-select: none;
}

.svg-text {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 15px;
  justify-content: center;
}

.svg-text:hover {
  // color: #409eff;
  font-weight: bold;
}

.svg-icon {
  margin-right: 5px;
  width: 15px;
  height: 15px;
}

.top-elform-query {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>
