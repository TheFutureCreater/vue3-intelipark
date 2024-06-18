// 用户信息交互
import request from '@/utils/request'

// 获取个人信息列表
export const getUserInfoListService = (pageData) => {
  return request({
    url: '/person/getList',
    params: pageData
  })
}

// 获取个人信息列表
export const getUserInfoByIdService = (id) => {
  return request({
    url: '/person/getById',
    params: {
      id
    }
  })
}

// 添加用户或管理员信息
export const addPersonInfoService = (info) => {
  return request({
    url: `/person/register/${info.role}`,
    method: 'POST',
    data: info
  })
}

// 修改用户信息
export const editPersonInfoService = (info) => {
  return request({
    url: `/person/update/${info.id}`,
    method: 'PUT',
    data: info
  })
}

// 删除多行用户信息
export const delUserInfoListService = (info) => {
  return request({
    url: '/person',
    method: 'DELETE',
    data: info
  })
}

// 用户登录
export const userLoginService = (info) => {
  return request({
    url: '/login/admin',
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: Object.keys(info)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(info[key])}`)
      .join('&')
  })
}

// 用户注册
export const userRegisterService = (info) => {
  return request({
    url: '/person/register/admin',
    method: 'POST',
    data: info
  })
}
