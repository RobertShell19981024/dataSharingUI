import request from '@/utils/request'


export function getOneApiBaseDescriptions(id) {
  return request({
    url: '/api/apiBaseDescriptions/getOneApiBaseDescriptions/' + id,
    method: 'get'
  })
}
export function updateOneApiBaseDescriptions(id, obj) {
  return request({
    url: '/api/apiBaseDescriptions/'+id+'/updateOneApiBaseDescriptions',
    method: 'put',
    data: obj
  })
}
