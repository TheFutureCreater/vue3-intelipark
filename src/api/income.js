import request from '@/utils/request'

//收入信息统计
export const getIncomeInfo = (parkid, startDate, endDate) => {
  return request({
    url: `/chargingRecords/costCount/${parkid}`,
    method: 'GET',
    params: {
      startDate: startDate,
      endDate: endDate
    }
  })
}
