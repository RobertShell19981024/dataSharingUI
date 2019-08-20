import request from '@/utils/request'

// 分页查询通知类型
export function page(query) {
    return request({
        url: '/api/workbench/noticeRecord/getApiNoticeDataDetail',
        method: 'get',
        params: query
    })
}
export function getObj(recordId) {
    return request({
        url: '/api/workbench/noticeRecord/getOneNoticeRecord/' + recordId,
        method: 'get'
    })
}
