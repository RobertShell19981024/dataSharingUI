import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/api/gateLog/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/gateLog',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/gateLog/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/gateLog/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/gateLog/' + id,
    method: 'put',
    data: obj
  })
}
