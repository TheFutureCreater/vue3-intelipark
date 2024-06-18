import request from '@/utils/request'

//充电设备数量统计
//ok
export const getEqStateByParkId = (parkid) => {
  return request({
    url: '/connections/count',
    method: 'GET',
    params: {
      parkId: parkid
    }
  })
}

//充电设备动态
export const getEqList = (parkid) => {
  return request({
    url: `/connections/occupy/${parkid}`,
    method: 'GET'
  })
}

export const getEqUsingRate = (parkid) => {
  return request({
    url: `/connections/useRate/${parkid}`
  })
}
