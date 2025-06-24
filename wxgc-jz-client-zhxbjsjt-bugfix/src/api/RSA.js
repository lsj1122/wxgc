import request from '@/utils/request'


/**
 * 获取RSA加密的公钥
 * @returns {AxiosPromise}
 */
export function getRsaPublicKey() {
  return request({
    url: '/auth/rsaPublicKey',
    method: 'get',
    params:{secret:process.env.VUE_APP_CLIENT_SECRET}
  })
}





