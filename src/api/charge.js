import request from '@/utils/request'

//充电记录
export const getChargeInfo = (parkid) => {
  return request({
    url: `/chargingRecords/all/${parkid}`,
    method: 'GET'
  })
}

//获取充电站分时电量统计
export const getChargingSubselctions = (stationId, date) => {
  return request({
    url: `/chargingRecords/subsectionsCount/${stationId}`,
    method: 'GET',
    params: {
      date: date
    }
  })
}

//充电订单数量统计
// export const getChargeStats = (parkid, days) => {
//   return request({
//     url: '/screen/crecoredstats',
//     method: 'GET',
//     params: {
//       parkId: parkid,
//       days: days
//     }
//   })
// }
