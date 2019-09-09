import request from '@/utils/request'

export function getAllapiJsonKeyInfo(query) {
  return request({
    url: '/api/apiJsonKeyFilter/getAllapiJsonKeyInfo',
    method: 'get',
    params: query
  })
}
export function addApiJsonKeyFilter(obj) {
  return request({
    url: '/api/apiJsonKeyFilter/insertApiJsonKeyInfo',
    method: 'post',
    data: obj
  })
}

export function getOneApiJsonKeyInfo(id) {
  return request({
    url: '/api/apiJsonKeyFilter/getOneApiJsonKeyInfo/' + id,
    method: 'get'
  })
}

export function delOneApiJsonKeyInfo(id) {
  return request({
    url: '/api/apiJsonKeyFilter/' + id,
    method: 'delete'
  })
}

export function updateOneApiJsonKeyInfo(id, obj) {
  return request({
    url: '/api/apiJsonKeyFilter/' + id,
    method: 'put',
    data: obj
  })
}
export function getAllapiJsonKeyInfoList(id) {
  return request({
    url: '/api/apiJsonKeyFilter/getAllapiJsonKeyInfoList/' + id,
    method: 'get'
  })
}
