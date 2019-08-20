import request from '@/utils/request'
//获取生成好的密钥信息
export function getUserSecretKey() {
    return request({
        url: '/api/workbench/userKeyInfo/getUserSecretKey',
        method: 'get'
    })
}
//根据条件重新生成密钥信息
export function updateUserSecretKey(obj) {
    return request({
        url: '/api/workbench/userKeyInfo/updateUserSecretKey',
        method: 'put',
        params: obj
        
    })
}
