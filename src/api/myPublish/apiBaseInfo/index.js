import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/api/apiBaseInfo/getAllApiBaseInfo',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/apiBaseInfo/insertApiBaseInfo',
    method: 'post',
    data: obj
  })
}

export function getOneApiBaseInfo(id) {
  return request({
    url: '/api/apiBaseInfo/getOneApiBaseInfo/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/apiBaseInfo/deleteApiBaseInfo/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/apiBaseInfo/updateApiBaseInfo/' + id,
    method: 'put',
    data: obj
  })
}

export function getAllApiBaseInfo() {
  return request({
    url: '/api/apiBaseInfo/getAllApiBaseInfo',
    method: 'get',
  })
}
