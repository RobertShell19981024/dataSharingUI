import request from '@/utils/request'

export function page(query) {
    return request({
        url: '/api/workbench/apiBaseInfo/getAllApiBaseInfo',
        method: 'get',
        params: query
    })
}

export function addObj(obj) {
    return request({
        url: '/api/workbench/apiBaseInfo/addOneApiBaseInfo',
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

export function delOneHeader(id) {
    return request({
        url: '/api/workbench/apiHeaderInfo/deleteOneApiHeaderInfo/' + id,
        method: 'delete'
    })
}

export function delOneQueryString(id) {
    return request({
        url: '/api/workbench/apiQueryInfo/deleteOneApiQueryInfo/' + id,
        method: 'delete'
    })
}

export function delOneBodyInfo(id) {
    return request({
        url: '/api/workbench/apiBodyInfo/deleteOneApiBodyInfo/' + id,
        method: 'delete'
    })
}

// 获取所有用户权限信息
export function getAllUserAuth(id) {
    return request({
        url: '/api/workbench/apiAuthRel/getAllUserAuth/' + id,
        method: 'get'
    })
}

// 更新用户权限 
export function updateUserAuth(obj,id) {
    return request({
        url: '/api/workbench/apiAuthRel/updateUserAuth/' + id,
        method: 'put',
        data: obj
    })
}