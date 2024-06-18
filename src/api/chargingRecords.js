// 充电记录信息交互
import request from '@/utils/request'

// 获取数据库充电记录信息列表
export const getChargeInfoListService = (pageData) => {
  return request({
    url: '/chargingRecords/page',
    params: pageData
  })
}
