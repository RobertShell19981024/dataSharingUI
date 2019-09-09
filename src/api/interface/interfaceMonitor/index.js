import request from '@/utils/request'

export function page(query) {
    return request({
        url: '/api/workbench/apiAccessRecord/page',
        method: 'get',
        params: query
    })
}

// 查询最近一周每天的接口访问次数
export function getApiAccessWeekRecord() {
    return request({
        url: '/api/workbench/apiAccessRecord/getApiAccessWeekRecord',
        method: 'get'
    })
}

// 分页查询通用接口
export function getApiAccessRecordByPage(query) {
    return request({
        url: '/api/workbench/apiAccessRecord/getApiAccessRecordByPage',
        method: 'get',
        params: query
    })
}
