import request from '../../utils/http'
const app = getApp();
Page({
  data: {
    city: '深圳宝安',
    isGetLocation: false,
    paddingTop: '',
    backgroundColor: 'transparent',
    navBarColor: '#fff'
  },
  onShow() {
    if (this.data.isGetLocation) return;
      // 获取用户授权信息
      wx.getSetting({
        success: ({ authSetting }) => {
          // 如果用户没有授权地理位置
          if (!authSetting['scope.userLocation']) {
            // 弹框请用户授权
            wx.authorize({
              scope: 'scope.userLocation',
              // 如果同意
              success: (e) => {
                // 判断手机是否开启了地址位置信息
                wx.getSystemInfo({
                  success: ({ locationEnabled }) => {
                    // 如果有开启地址位置
                    if (locationEnabled) {
                      this.handleGetLocation();
                      return
                    }
                    this.handleGetWeather();
                    this.handleShowTip && this.handleShowTip('未开启定位');
                  }
                })
              },
              fail: () => {
                this.handleGetWeather();
                this.handleShowTip && this.handleShowTip('未开启授权');
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
                this.handleShowTip && this.handleShowTip('未开启定位');
              }
            })
          }
        }
      })
  },
  onLoad() {
    // 获取上次定位地址
    wx.getStorage({
      key: 'city',
      success: ({ data }) => {
        data && this.setData({
          city: data
        });
      }
    });
    this.setData({
      paddingTop: app.globalData.navBarHeight,
    })
  },
  // 获取地理位置信息
  handleGetLocation() {
    wx.getLocation({
      // 获取经纬度
      success: ({ longitude, latitude }) => {
        const { isGetLocation } = this.data;
        this.handleCoordToAddress(longitude, latitude);
        isGetLocation || this.setData({
          isGetLocation: true
        });
      }
    })
  },
  // 获取天气信息
  async handleGetWeather() {
    const [now, hourly, daily, indices] = await Promise.all([this.request('/weather/now'),
    this.request('/weather/24h'),
    this.request('/weather/7d'),
    this.request('/indices/1d', { type: '1,3,5,6,9,13' })]);
    const { daily: life} = indices;
    console.log(now);
    const weather = {
      ...now,
      ...daily,
      ...hourly,
      life
    }
    console.log(weather)
    this.setData({
      weather
    })
  },
  
  handleAddress({ detail: { longitude, latitude }  }) {
    this.handleCoordToAddress(longitude, latitude);
  },
  // 坐标转换为地址
  handleCoordToAddress(longitude, latitude) {
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
          }, () => {
            wx.setStorageSync('city', `${adm2}${name}`);
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
  },
  // 显示定位提示
  handleShowTip(text) {
    const tip = wx.getStorageSync('city') ? '为您展示上次定位位置' : '默认展示深圳宝安区';
    wx.showToast({
      title: `${text},${tip}`,
      icon: 'none'
    });
    this.handleShowTip = null;
  }
})