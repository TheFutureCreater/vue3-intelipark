// 充电设备接口信息交互
import request from '@/utils/request'

// 获取数据库充电设备接口信息列表
export const getConnectorInfoListService = (pageData) => {
  return request({
    url: '/connections/page',
    params: pageData
  })
}

// 添加充电设备接口信息
export const addConnectorInfoService = (info) => {
  return request({
    url: '/connections',
    method: 'POST',
    data: info
  })
}

// 修改充电设备接口信息
export const editConnectorInfoService = (info) => {
  return request({
    url: `/connections/${info.connectorId}`,
    method: 'PUT',
    data: info
  })
}

// 删除多行充电设备接口信息
export const delConnectorInfoListService = (idList) => {
  return request({
    url: '/connections',
    method: 'DELETE',
    data: idList
  })
}
