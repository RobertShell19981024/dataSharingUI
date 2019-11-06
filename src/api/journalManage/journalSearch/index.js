import request from '@/utils/request'

export function getApiAccessRecords(query) {
    return request({
        url: '/api/apiAccessRecord/getapiAccessRecord',
        method: 'get',
        params: query
    })
}

export function getCountLog() {
  return request({
    url: '/api/apiAccessRecord/getCountLog',
    method: 'get',
  })
}

export function addApiAccessRecord(obj) {
    return request({
        url: '/api/apiAccessRecord',
        method: 'post',
        data: obj
    })
}

export function getApiAccessRecord(id) {
    return request({
        url: '/api/apiAccessRecord/' + id,
        method: 'get'
    })
}

export function delApiAccessRecord(id) {
    return request({
        url: '/api/apiAccessRecord/' + id,
        method: 'delete'
    })
}

export function putApiAccessRecord(id, obj) {
    return request({
        url: '/api/apiAccessRecord/' + id,
        method: 'put',
        data: obj
    })
}
