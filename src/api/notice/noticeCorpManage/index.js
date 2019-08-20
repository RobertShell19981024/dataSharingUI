import request from '@/utils/request'

// 分页查询通知类型
export function page(query) {
    return request({
        url: '/api/workbench/noticeTypeInfo/getAllNoticeType',
        method: 'get',
        params: query
    })
}

// 查询获取所有可接收通知的用户名和主键ID
export function getAllActiviveUser(id) {
    return request({
        url: '/api/workbench/noticeBaseInfo/getAllActiviveUser/' + id,
        method: 'get'
    })
}
//添加通知类型信息
export function insertNoticeTypeInfo(obj) {
    return request({
        url: '/api/workbench/noticeTypeInfo/insertNoticeTypeInfo',
        method: 'post',
        data: obj
    })
}
//删除信息
export function delObj(id) {
    return request({
        url: '/api/workbench/noticeTypeInfo/deleteOneNoticeBaseInfo/' + id,
        method: 'delete'
    })
}
// 更新通知用户关系表
export function updateNoticeUserRelList(obj,id) {
    return request({
        url: '/api/workbench/noticeUserRel/updateNoticeUserRelList/' + id,
        method: 'put',
        data: obj
    })
}
