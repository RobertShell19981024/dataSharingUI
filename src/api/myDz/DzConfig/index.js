import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/api/dzYixing/getAllApiDzBaseInfo',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/dzYixing/insertApiBaseAndDzfilterInfo',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/dzYixing/getOneDzYixingInfo/' + id,
    method: 'get'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/dzYixing/updateApiDzBaseInfo/' + id,
    method: 'put',
    data: obj
  })
}

export function delObj(id) {
  return request({
    url: '/api/dzYixing/deleteDzApiYixingInfo/' + id,
    method: 'delete'
  })
}
