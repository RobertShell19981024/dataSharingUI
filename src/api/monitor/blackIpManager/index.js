import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/api/workbench/blackListIp/getAllBlackListIp',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/workbench/blackListIp/addOneBlackIp',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/workbench/blackListIp/getOneBlackIp/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/workbench/blackListIp/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/workbench/blackListIp/updateOneBlackIp/' + id,
    method: 'put',
    data: obj
  })
}



