import request from '@/utils/request'

export function page(query) {
    return request({
        url: '/api/workbench/apiBaseInfo/getAllApiBaseInfoIsNull',
        method: 'get',
        params: query
    })
}

export function addObj(obj) {
    return request({
        url: '/api/workbench/apiBaseInfo/addOneApiBaseInfoNotPubkey',
        method: 'post',
        data: obj
    })
}

export function getObj(id) {
    return request({
        url: '/api/workbench/apiBaseInfo/getOneApiBaseInfo/' + id,
        method: 'get'
    })
}

export function delObj(id) {
    return request({
        url: '/api/workbench/apiBaseInfo/deleteOneApiBaseInfo/' + id,
        method: 'delete'
    })
}

export function putObj(id, obj) {
    return request({
        url: '/api/workbench/apiBaseInfo/updateOneApiBaseInfo/' + id,
        method: 'put',
        data: obj
    })
}
