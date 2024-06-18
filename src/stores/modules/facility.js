import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFacilityStore = defineStore('intellipark-facility', () => {
  const parkOrOperator = ref('园区')
  const fatherId = ref([0, 0, 0]) // 0园区或运营商，1充电站，2设备
  const stageValue = ref('园区') // 当前层 1园区/运营商 2充电站 3充电设备 4设备接口

  return {
    parkOrOperator,
    fatherId,
    stageValue
  }
})
