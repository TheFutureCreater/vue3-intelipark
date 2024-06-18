// 园区信息交互
import request from '@/utils/request'

// 获取数据库园区信息列表
export const getParkInfoListService = (pageData) => {
  return request({
    url: '/park/list',
    params: pageData
  })
}

// 添加园区信息
export const addParkInfoService = (info) => {
  return request({
    url: '/park',
    method: 'POST',
    data: info
  })
}

// 修改园区信息
export const editParkInfoService = (info) => {
  return request({
    url: `/park/${info.parkId}`,
    method: 'PUT',
    data: info
  })
}

// 删除多行园区信息
export const delParkInfoListService = (idList) => {
  return request({
    url: '/park',
    method: 'DELETE',
    data: idList
  })
}
