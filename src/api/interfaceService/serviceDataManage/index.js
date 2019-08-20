import request from '@/utils/request'

// 分页查询备份数据信息
export function page(query) {
    return request({
        url: '/api/workbench/apiAccessRecord/getSafeApiAccessRecordByPage',
        method: 'get',
        params: query
    })
}

export function getObj(id) {
    return request({
        url: '/api/workbench/apiAccessRecord/getOneApiAccessRecord/' + id,
        method: 'get'
    })
}