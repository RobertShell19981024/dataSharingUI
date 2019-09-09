import request from '@/utils/request'

// 统计当前用户下已经发布的接口数量
export function getCountPublishByApiOwnerId() {
  return request({
    url: '/api/apiBaseInfo/publishByApiOwnerId',
    method: 'get'
  })
}

//统计当前用户下发布的接口访问数量
export function getCountPublishByApiUserId() {
  return request({
    url: '/api/apiBaseInfo/publishByApiUserId',
    method: 'get'
  })
}

//统计当前用户下今日访问数量
export function getCountPublishByApiUserIdAndByday() {
  return request({
    url: '/api/apiBaseInfo/publishByApiUserIdAndByday',
    method: 'get'
  })
}

//统计当前用户下请求接口数量
export function getCountRequsetByApiOwnerId() {
  return request({
    url: '/api/apiJgtoptFilter/requsetByApiOwnerId',
    method: 'get'
  })
}
