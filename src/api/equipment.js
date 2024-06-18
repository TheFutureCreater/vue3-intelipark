// 充电设备信息交互
import request from '@/utils/request'

// 获取数据库充电设备信息列表
export const getEquipmentInfoListService = (pageData) => {
  return request({
    url: '/equipments/page',
    params: pageData
  })
}

// 添加充电设备信息
export const addEquipmentInfoService = (info) => {
  return request({
    url: '/equipments',
    method: 'POST',
    data: info
  })
}

// 修改充电设备信息
export const editEquipmentInfoService = (info) => {
  return request({
    url: `/equipments/${info.equipmentId}`,
    method: 'PUT',
    data: info
  })
}

// 删除多行充电设备信息
export const delEquipmentInfoListService = (idList) => {
  return request({
    url: '/equipments',
    method: 'DELETE',
    data: idList
  })
}
