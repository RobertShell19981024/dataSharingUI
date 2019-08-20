import request from '@/utils/request'

export function page(query){
    return request({
        url: '/api/workbench/apiBaseInfo/getAllApiInfoByPage',
        method: 'get',
        params: query
    })
}