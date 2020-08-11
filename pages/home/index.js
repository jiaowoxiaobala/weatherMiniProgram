import request from '../../utils/http'
const app = getApp();
Page({
  data: {
    city: '深圳宝安',
    isGetLocation: false,
    paddingTop: ''
  },
  onLoad() {
      this.setData({
        paddingTop: app.globalData.navBarHeight,
      })
     // 获取用户授权信息
     wx.getSetting({
      success: ({ authSetting }) => {
        // 如果用户没有授权地理位置
        if (!authSetting['scope.userLocation']) {
          // 弹框请用户授权
          wx.authorize({
            scope: 'scope.userLocation',
            // 如果同意
            success: () => {
              // 判断手机是否开启了地址位置信息
              wx.getSystemInfo({
                success: ({ locationEnabled }) => {
                  // 如果有开启地址位置
                  if (locationEnabled) {
                    this.handleGetLocation();
                    return
                  }
                  this.handleGetWeather();
                }
              })
            }
          })
        } else {
          // 授权了地址位置的情况,判断手机是否有开启地址位置
          wx.getSystemInfo({
            success: ({ locationEnabled }) => {
              // 如果有开启地址位置
              if (locationEnabled) {
                this.handleGetLocation();
                return
              }
              this.handleGetWeather();
            }
          })
        }
      }
    })
  },
  // 获取地理位置信息
  handleGetLocation() {
    wx.getLocation({
      // 获取经纬度
      success: ({ longitude, latitude }) => {
        wx.request({
          url: 'https://geoapi.heweather.net/v2/city/lookup',
          data: {
            location: `${longitude},${latitude}`,
            key: '11d5c67f43f745c3a3a12656b548f9d9'
          },
          success: ({data: { location }}) => {
            const { adm2, name } = location[0];
            if (name) {
              this.setData({
                city: `${adm2}${name}`
              });
              wx.setStorage({
                data: {
                  longitude,
                  latitude
                },
                key: 'location',
              });
            }
            this.handleGetWeather();
          }
        })
      }
    })
  },
  // 获取天气信息
  async handleGetWeather() {
    const [now, hourly, daily] = await Promise.all([this.request('/weather/now'), this.request('/weather/24h'),this.request('/weather/15d')]);
    const weather = {
      ...now,
      ...daily,
      ...hourly
    }
    this.setData({
      weather
    })
  },
  handleAddress({ detail }) {
    const { address, ...location } = detail;
    wx.setStorageSync('location', location);
    this.setData({
      city: address
    })
    this.handleGetWeather();
  }
})