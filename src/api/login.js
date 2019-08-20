import request from '@/utils/request'


export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/api/jwt/token',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function logout(token) {
  return request({
    url: '/api/jwt/invalid',
    method: 'post',
    params: {
      token: token
    }
  })
}

export function getInfo() {
  return request({
    url: '/api/user/front/info',
    method: 'get'
  })
}

export function getMenus() {
  return request({
    url: '/api/user/front/menus',
    method: 'get'
  })
}

export function getAllMenus() {
  return request({
    url: '/api/user/front/menu/all',
    method: 'get'
  })
}
