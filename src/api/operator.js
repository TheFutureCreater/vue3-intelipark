// 运营商信息交互
import request from '@/utils/request'

// 获取数据库运营商信息列表
export const getOperatorInfoListService = (pageData) => {
  return request({
    url: '/operator/list',
    params: pageData
  })
}

// 添加运营商信息
export const addOperatorInfoService = (info) => {
  return request({
    url: '/operator',
    method: 'POST',
    data: info
  })
}

// 修改运营商信息
export const editOperatorInfoService = (info) => {
  return request({
    url: `/operator/${info.operatorId}`,
    method: 'PUT',
    data: info
  })
}

// 删除多行运营商信息
export const delOperatorInfoListService = (idList) => {
  return request({
    url: '/operator',
    method: 'DELETE',
    data: idList
  })
}
