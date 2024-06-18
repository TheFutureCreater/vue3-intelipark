import request from '@/utils/request'

//ok
export const getStatsByParkid = (parkid, startDate, endDate) => {
  return request({
    url: '/stats',
    method: 'GET',
    params: {
      parkId: parkid,
      startDate: startDate,
      endDate: endDate
    }
  })
}
