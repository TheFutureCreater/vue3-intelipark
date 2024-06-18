import request from '@/utils/request'

export const getWeatherInfo = (lat, lon) => {
  return request({
    url: 'https://api.openweathermap.org/data/2.5/weather',
    method: 'GET',
    params: {
      lat: lat,
      lon: lon,
      appid: '164e165ac5917a9306610abeb50ed15c',
      lang: 'zh_cn'
    }
  })
}
