// 车辆信息交互
import request from '@/utils/request'

// 获取数据库车辆信息列表
export const getVehicleInfoListService = (pageData) => {
  return request({
    url: '/vehicle/list',
    params: pageData
  })
}

// 根据用户id获取车辆信息列表
// export const getVehicleInfoByIdService = (userId) => {
//   return request({
//     url: '/vehicle/userId',
//     params: {
//       userId
//     }
//   })
// }

// 删除车辆信息
export const delVehicleInfoByIdService = (vehicleId) => {
  return request({
    url: '/vehicle',
    method: 'DELETE',
    params: {
      vehicleId
    }
  })
}

// 添加车辆信息
export const addVehicleInfoService = (info) => {
  return request({
    url: '/vehicle',
    method: 'POST',
    data: info
  })
}

// 修改车辆信息
export const editVehicleInfoService = (info) => {
  return request({
    url: '/vehicle',
    method: 'PUT',
    data: info
  })
}

// 删除多行车辆信息
export const delVehicleInfoListService = (info) => {
  return request({
    url: '/vehicle',
    method: 'DELETE',
    data: info
  })
}
