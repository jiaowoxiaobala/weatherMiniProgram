const baseUrl = 'https://devapi.heweather.net/v7/';

export default function requset(url, data = {}) {
  const { longitude = '113.91685',
          latitude = '22.65015' } = wx.getStorageSync('location');
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${baseUrl}${url}`,
      data: {
        key: '11d5c67f43f745c3a3a12656b548f9d9',
        location: `${longitude},${latitude}`,
        ...data
      },
      success: ({ data }) => {
        resolve(data);
      },
      fail: err => {
        reject(err);
      }
    })
  })
}