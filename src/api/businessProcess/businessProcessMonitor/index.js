import request from '@/utils/request'

// 获取流程实例列表
export function page(query) {
    return request({
        url: '/api/workbench/wfmActivity/getAllActivityInfo',
        method: 'get',
        params: query
    })
}

// 根据业务编号查询流程图json信息
export function getImageJsonByBusinessNo(id) {
    return request({
        url: '/api/workbench/wfmActivity/getImageJsonByBusinessNo/'+id,
        method: 'get'
    })
}
