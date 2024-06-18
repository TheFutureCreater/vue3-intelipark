// 计费模型信息交互
import request from '@/utils/request'

// 获取数据库计费模型信息列表
export const getFeeInfoListService = (pageData) => {
  return request({
    url: '/fee/page',
    params: pageData
  })
}

// 添加计费模型信息
export const addFeeInfoService = (info) => {
  return request({
    url: '/fee',
    method: 'POST',
    data: info
  })
}

// 修改计费模型信息
export const editFeeInfoService = (info) => {
  return request({
    url: `/fee/${info.feeCode}`,
    method: 'PUT',
    data: info
  })
}

// 删除多行计费模型信息
export const delFeeInfoListService = (idList) => {
  return request({
    url: '/fee',
    method: 'DELETE',
    data: idList
  })
}
