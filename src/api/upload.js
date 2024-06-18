// 上传文件
import request from '@/utils/request'

export const staionCustomHttpRequest = ({ file, onSuccess, onError, onProgress }) => {
  const formData = new FormData()
  formData.append('file', file)

  return request({
    url: '/stations/excel', // 替换为你的上传接口
    method: 'POST',
    data: formData,
    onUploadProgress: (event) => {
      if (event.lengthComputable) {
        onProgress({ percent: (event.loaded / event.total) * 100 })
      }
    }
  })
    .then((response) => {
      onSuccess(response.data)
      ElMessage.success('添加成功')
    })
    .catch((error) => {
      onError(error)
    })
}

export const equipmentCustomHttpRequest = ({ file, onSuccess, onError, onProgress }) => {
  const formData = new FormData()
  formData.append('file', file)

  return request({
    url: '/equipments/excel', // 替换为你的上传接口
    method: 'POST',
    data: formData,
    onUploadProgress: (event) => {
      if (event.lengthComputable) {
        onProgress({ percent: (event.loaded / event.total) * 100 })
      }
    }
  })
    .then((response) => {
      onSuccess(response.data)
      ElMessage.success('添加成功')
    })
    .catch((error) => {
      onError(error)
    })
}

export const connectorCustomHttpRequest = ({ file, onSuccess, onError, onProgress }) => {
  const formData = new FormData()
  formData.append('file', file)

  return request({
    url: '/connections/excel', // 替换为你的上传接口
    method: 'POST',
    data: formData,
    onUploadProgress: (event) => {
      if (event.lengthComputable) {
        onProgress({ percent: (event.loaded / event.total) * 100 })
      }
    }
  })
    .then((response) => {
      onSuccess(response.data)
      ElMessage.success('添加成功')
    })
    .catch((error) => {
      onError(error)
    })
}
