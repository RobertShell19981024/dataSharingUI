import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/api/workbench/ipMappingInfo/selectIPMappings',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/workbench/ipMappingInfo/addIPMapping',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/workbench/ipMappingInfo/selectIPMappingById/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/workbench/ipMappingInfo/deleteIPMappingById/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/workbench/ipMappingInfo/updateIPMappingById/' + id,
    method: 'put',
    data: obj
  })
}
