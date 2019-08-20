import request from '@/utils/request'
//获取通知相关信息
export function getCorpBaseInfo() {
    return request({
        url: '/api/workbench/userKeyInfo/getNoticeCorpBaseInfo',
        method: 'get'
    })
}

export function updateCorpBaseInfo(obj) {
    return request({
        url: '/api/workbench/userKeyInfo/updateNoticeCorpBaseInfo',
        method: 'put',
        data: obj
    })
}
