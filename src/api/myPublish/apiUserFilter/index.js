import request from '@/utils/request'

export function page1(query) {
  return request({
    url: '/api/apiUserFilter/getAllApiUserFilter',
    method: 'get',
    params: query
  })
}

export function addObj1(obj) {
  return request({
    url: '/api/apiUserFilter/insertApiUserFilter',
    method: 'post',
    data: obj
  })
}

export function getOneApiUserFilter(id) {
  return request({
    url: '/api/apiUserFilter/getOneApiUserFilter/' + id,
    method: 'get'
  })
}

export function delObj1(id) {
  return request({
    url: '/api/apiUserFilter/deleteApiUserFilter/' + id,
    method: 'delete'
  })
}


export function getFilterByApiId(id) {
  return request({
    url: '/api/apiUserFilter/getOneApiUserFilterByApiId/' + id,
    method: 'get'
  })
}

export function updateFilter(obj,id) {
  return request({
    url: '/api/apiUserFilter/updateApiUserFilter/' + id,
    method: 'put',
    data: obj
  })
}
