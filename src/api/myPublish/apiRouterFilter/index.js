import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/api/apiRouterFilter/getAllApiRouterFilter',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/apiRouterFilter/insertApiRouterFilter',
    method: 'post',
    data: obj
  })
}

export function getOneApiRouterFilter(id) {
  return request({
    url: '/api/apiRouterFilter/getOneApiRouterFilter/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/apiRouterFilter/deleteApiRouterFilter/' + id,
    method: 'delete'
  })
}

export function getAllRequestFilter(id) {
  return request({
    url: '/api/apiRouterFilter/getAllRequestFilter/' + id,
    method: 'get',
  })
}

export function getAllDzFilter(id) {
  return request({
    url: '/api/apiRouterFilter/getAllDzFilter/' + id,
    method: 'get',
  })
}
