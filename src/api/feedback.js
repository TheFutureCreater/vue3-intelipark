// 反馈信息交互
import request from '@/utils/request'

// 获取数据库反馈信息列表
export const getFeedbackInfoListService = (pageData) => {
  return request({
    url: '/feedback/list',
    params: pageData
  })
}

// 删除反馈信息
export const delFeedbackInfoByIdService = (FeedbackId) => {
  return request({
    url: '/feedback',
    method: 'DELETE',
    params: {
      FeedbackId
    }
  })
}

// 添加反馈信息
export const addFeedbackInfoService = (info) => {
  return request({
    url: '/feedback',
    method: 'POST',
    data: info
  })
}

// 修改反馈信息
export const editFeedbackInfoService = (info) => {
  return request({
    url: '/feedback',
    method: 'PUT',
    data: info
  })
}

// 删除多行反馈信息
export const delFeedbackInfoListService = (info) => {
  return request({
    url: '/feedback',
    method: 'DELETE',
    data: info
  })
}
