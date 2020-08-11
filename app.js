import request from './utils/http';
App({
  onLaunch() {
    this.handleExtendPage();
  },

  // 扩展Page对象
  handleExtendPage() {
    // 保存原来的Page
    const originPage = Page;
    // 覆盖Pages
    Page = config => {
      config.request = request;
      // 之后可以在Page里直接通过this.request发起网络请求
      return originPage(config);
    }
  },
  globalData: {

  }
})