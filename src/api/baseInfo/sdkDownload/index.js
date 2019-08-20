import request from '@/utils/request'

// 下载java sdk包
export function getJavaSDK(typeId) {
    return request({
        url: '/api/workbench/sdkFileManage/downloadSDKFile/'+typeId,
        method: 'get',
        responseType: 'arraybuffer'
    })
}