import request from '@/utils/request'
//获取通知相关信息
export function page(query) {
    return request({
        url: '/api/workbench/noticeBaseInfo/getnoticeBaseInfo',
        method: 'get',
        params: query
    })
}
export function selectNoticeBaseInfoByUserid() {
    return request({
        url: '/api/workbench/noticeBaseInfo/selectNoticeBaseInfoByUserid',
        method: 'get'
    })
}
//添加通知类型信息
export function insertNoticeBaseInfo(obj) {
    return request({
        url: '/api/workbench/noticeBaseInfo/insertNoticeBaseInfo',
        method: 'post',
        data: obj
    })
}
export function updateBaseInfo(obj) {
    return request({
        url: '/api/workbench/noticeBaseInfo/updatenoticeBaseInfo/',
        method: 'put',
        data: obj
    })
}

export function delObj(id) {
    return request({
        url: '/api/workbench/noticeBaseInfo/' + id,
        method: 'delete'
    })
}export function getObj(id) {
    return request({
        url: '/api/workbench/noticeBaseInfo/' + id,
        method: 'get'
    })
}
export function putObj(id, obj) {
    return request({
        url: '/api/workbench/noticeBaseInfo/' + id,
        method: 'put',
        data: obj
    })
}