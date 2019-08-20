import request from '@/utils/request'

export function page(query) {
    return request({
        url: '/api/workbench/apiAuthRel/getAPIInfoByUserId',
        method: 'get',
        params: query
    })
}

export function getOneApiBaseInfo(id) {
    return request({
        url: '/api/workbench/apiBaseInfo/getOneApiBaseInfo/' + id,
        method: 'get'
    })
}
