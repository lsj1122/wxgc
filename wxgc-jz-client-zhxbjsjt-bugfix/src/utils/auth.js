import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// bimface TokenKey
export function getBimfaceToken() {
  return Cookies.get("bimfaceTokenKey")
}

export function setBimfaceToken(bimfaceToken) {
  return Cookies.set("bimfaceTokenKey", bimfaceToken)
}

export function removeBimfaceToken() {
  return Cookies.remove("bimfaceTokenKey")
}
