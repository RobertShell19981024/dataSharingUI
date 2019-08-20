import request from '@/utils/request'


export function addObj1(obj) {
  return request({
    url: '/api/apiTimeFilter/addOneApiTimeFilter',
    method: 'post',
    data: obj
  })
}

export function getObj1(id) {
  return request({
    url: '/api/apiTimeFilter/' + id,
    method: 'get'
  })
}

export function putObj1(id, obj) {
  return request({
    url: '/api/apiTimeFilter/' + id,
    method: 'put',
    data: obj
  })
}

export function delObj1(id) {
  return request({
    url: '/api/apiTimeFilter/' + id,
    method: 'delete'
  })
}
export function getApiTimeFilterInfoList(id) {
  return request({
    url: '/api/apiTimeFilter/getApiTimeFilterInfoList/' + id,
    method: 'get'
  })
}


export function getOneApiTimeFilter(id) {
  return request({
    url: '/api/apiTimeFilter/getOneApiTimeFilter/' + id,
    method: 'get',
  })
}
