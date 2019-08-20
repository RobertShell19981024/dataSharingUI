import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/api/groupType/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/groupType',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/groupType/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/groupType/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/groupType/' + id,
    method: 'put',
    data: obj
  })
}
