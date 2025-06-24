import axios from 'axios'

export function getWeather(city) {
  let url  = "https://www.tianqiapi.com/free/week?appid=21631136&appsecret=U6ediBAa&city="+ city;
  return axios({
    url,
    method: 'get'
  })
}
