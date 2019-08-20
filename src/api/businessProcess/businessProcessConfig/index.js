import request from '@/utils/request'

// 获取所有API信息
export function getAllStepApiBaseInfo() {
    return request({
        url: '/api/workbench/apiBaseInfo/getAllStepApiBaseInfo',
        method: 'get'
    })
}

// 新建流程
export function addNewProcess(obj) {
    return request({
        url: '/api/workbench/wfmProcess/addNewProcess',
        method: 'post',
        data: obj
    })
}

// 获取模板名称列表
export function getAllProcessName() {
    return request({
        url: '/api/workbench/wfmProcess/getAllProcessName',
        method: 'get'
    })
}

// 根据模板ID查询模板所有信息
export function getAllProcessInfo(pId) {
    return request({
        url: '/api/workbench/wfmProcess/getProcessInfoById/'+pId,
        method: 'get'
    })
}

// 更新模板信息
export function updateProcessInfoById(pId,obj) {
    return request({
        url: '/api/workbench/wfmProcess/updateProcessInfoById/'+pId,
        method: 'put',
        data: obj
    })
}