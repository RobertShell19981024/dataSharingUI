import request from '@/utils/request'

export function getAllApiNotionalConfigInfo() {
  return request({
    url: '/api/apiNotionalsharedConfig/getAllApiNotionalConfigInfo',
    method: 'get',
  })
}

export function insertNotionalsharedConfig(obj) {
  return request({
    url: '/api/apiNotionalsharedConfig/insertNotionalsharedConfig',
    method: 'post',
    data: obj
  })
}

export function getOneApiNotionalsharedConfig(id) {
  return request({
    url: '/api/apiNotionalsharedConfig/getOneApiNotionalsharedConfig/' + id,
    method: 'get'
  })
}

export function deleteNotionalsharedConfig(id) {
  return request({
    url: '/api/apiNotionalsharedConfig/' + id,
    method: 'delete'
  })
}


export function updateNotionalsharedConfig(id,obj) {
  return request({
    url: '/api/apiNotionalsharedConfig/' + id,
    method: 'put',
    data: obj
  })
}
