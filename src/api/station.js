// 充电站信息交互
import request from '@/utils/request'

// 获取数据库充电站信息列表
export const getStationInfoListService = (pageData) => {
  return request({
    url: '/stations/page',
    params: pageData
  })
}

// 获取数据库充电站信息列表
export const getStationInfoByIdService = (id) => {
  return request({
    url: '/stations',
    params: id
  })
}

// 添加充电站信息
export const addStationInfoService = (info) => {
  return request({
    url: '/stations',
    method: 'POST',
    data: info
  })
}

// 修改充电站信息
export const editStationInfoService = (info) => {
  return request({
    url: `/stations/${info.stationId}`,
    method: 'PUT',
    data: info
  })
}

// 删除多行充电站信息
export const delStationInfoListService = (idList) => {
  return request({
    url: '/stations',
    method: 'DELETE',
    data: idList
  })
}

//获取充电站快慢充接口数量统计
export const getConnectorStatusByStationId = (stationId, date) => {
  return request({
    url: `/stations/countConnectorStatus/${stationId}`,
    method: 'GET',
    params: {
      date: date
    }
  })
}

//获取充电站充电排行榜
export const getStationChargingList = () => {
  return request({
    url: '/chargingRecords/chargingTop'
  })
}
