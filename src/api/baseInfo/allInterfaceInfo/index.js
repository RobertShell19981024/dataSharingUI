import request from '@/utils/request'

export function page(query) {
    return request({
        url: '/api/workbench/apiBaseInfo/getNotAllInterfaceInfo',
        method: 'get',
        params: query
    })
}

