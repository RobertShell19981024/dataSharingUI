import request from '@/utils/request'

export function getApiusers(id) {
  return request({
    url: '/api/apiUserMember/'+id+'/getApiusers/',
    method: 'get'
  })
}

export function updateusers(id,obj) {
  return request({
    url: '/api/apiUserMember/'+id+'/updateusers/',
    method: 'put',
    params: obj
  })
}
