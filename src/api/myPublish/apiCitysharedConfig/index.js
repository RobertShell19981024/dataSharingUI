import request from '@/utils/request'


export function insertApiCitysharedConfigInfo(obj) {
  return request({
    url: '/api/apiCitysharedConfig/insertApiCitysharedConfigInfo',
    method: 'post',
    data: obj
  })
}

export function getOneApiCitysharedConfigInfo(id) {
  return request({
    url: '/api/apiCitysharedConfig/getOneApiCitysharedConfigInfo/' + id,
    method: 'get'
  })
}

export function delApiCitysharedConfig(id) {
  return request({
    url: '/api/apiCitysharedConfig/' + id,
    method: 'delete'
  })
}

export function updateApiCitysharedConfig(id, obj) {
  return request({
    url: '/api/apiCitysharedConfig/' + id,
    method: 'put',
    data: obj
  })
}
