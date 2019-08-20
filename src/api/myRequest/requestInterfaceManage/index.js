import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/api/apiJgtoptFilter/getAllApiJgtoPtInfo',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/apiJgtoptFilter/insertApiJgtoPtInfo',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/apiJgtoptFilter/getOneApiJgPtInfo/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/apiJgtoptFilter/deleteRequestApiInfo/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/apiJgtoptFilter/updateApiJgtoPtInfo/' + id,
    method: 'put',
    data: obj
  })
}



