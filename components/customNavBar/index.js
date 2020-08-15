const app = getApp();
Component({
  data: {
    
  },
  properties: {
    city: String
  },
  lifetimes: {
    attached() {
      // 获取状态栏信息
      const { statusBarHeight } = wx.getSystemInfoSync();
      // 获取右上角胶囊到顶部的距离和胶囊高度
      const { top, height } = wx.getMenuButtonBoundingClientRect();
      // 获取胶囊到状态栏的距离
      const gap = top- statusBarHeight;
      // 导航栏高度
      const navBarHeight = 2 * gap + height + statusBarHeight + 'px';
      const paddingTop = statusBarHeight + 12 + 'px';
      this.setData({
        navBarHeight,
        paddingTop
      });
      app.globalData['navBarHeight'] = navBarHeight;
    }
  },
  methods: {
    handleLocation() {
      wx.getSetting({
        success: ({ authSetting }) => {
          if (!authSetting['scope.userLocation']) {
            wx.openSetting({
              success: ({ authSetting }) => {
                authSetting['scope.userLocation'] && wx.chooseLocation({
                  success: ({ longitude, latitude }) => {
                    this.handleChangeAddress({ longitude, latitude })
                  },
                  fail: err => {}
                });
              }
            })
          } else {
            wx.chooseLocation({
              success: ({ longitude, latitude }) => {
                this.handleChangeAddress({ longitude, latitude });
              },
              fail: err => {}
            });
          }
        }
      })
    },
    handleChangeAddress(address) {
      this.triggerEvent('changeAddress', address);
    }
  }
})
