import request from '@/utils/request'
//分页查询
export function page(query) {
    return request({
      url: '/api/workbench/noticeTypeInfo/getAllTypeIdByUserId',
      method: 'get',
      params: query
    })
  }
  


