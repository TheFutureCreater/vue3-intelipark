import request from '@/utils/request'

//充电榜单的用户信息\
//ok
export const getUserList = (startDate, endDate) => {
  return request({
    url: '/chargingRecords/top',
    method: 'GET',
    params: {
      startDate: startDate,
      endDate: endDate
    }
  })
}

//用户信息统计
export const getUserStats = () => {
  return request({
    url: '/person/count',
    method: 'GET'
  })
}
