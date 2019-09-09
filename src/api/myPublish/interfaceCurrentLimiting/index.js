import request from '@/utils/request'

export function getAllapiFlowConfigInfo(query) {
  return request({
    url: '/api/apiFlowConfig/getAllapiFlowConfigInfo',
    method: 'get',
    params: query
  })
}

export function insertApiFlowConfigInfo(obj) {
  return request({
    url: '/api/apiFlowConfig/insertApiFlowConfigInfo',
    method: 'post',
    data: obj
  })
}

export function getOneApiFlowConfigInfo(id) {
  return request({
    url: '/api/apiFlowConfig/getOneApiFlowConfigInfo/' + id,
    method: 'get'
  })
}

export function delApiFlowConfigInfo(id) {
  return request({
    url: '/api/apiFlowConfig/' + id,
    method: 'delete'
  })
}


export function updateApiFlowConfigInfo(id,obj) {
  return request({
    url: '/api/apiFlowConfig/' + id,
    method: 'put',
    data: obj
  })
}
