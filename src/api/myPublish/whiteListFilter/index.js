import request from '@/utils/request'


export function addObj2(obj) {
  return request({
    url: '/api/apiIpWhitelistFilter/addOneApiIPFilter',
    method: 'post',
    data: obj
  })
}

export function getObj2(id) {
  return request({
    url: '/api/apiIpWhitelistFilter/' + id,
    method: 'get'
  })
}

export function putObj2(id, obj) {
  return request({
    url: '/api/apiIpWhitelistFilter/' + id,
    method: 'put',
    data: obj
  })
}

export function delObj2(id) {
  return request({
    url: '/api/apiIpWhitelistFilter/' + id,
    method: 'delete'
  })
}
export function getApiIPFilterInfoList(id) {
  return request({
    url: '/api/apiIpWhitelistFilter/getApiIPFilterInfoList/' + id,
    method: 'get'
  })
}


export function getOneApiIPFilter(id) {
  return request({
    url: '/api/apiIpWhitelistFilter/getOneApiIPFilter/' + id,
    method: 'get',
  })
}
