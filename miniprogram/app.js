/* eslint-disable no-undef */
import Model from './model/model'

App({
  initUiGlobal() {
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight
        this.globalData.screenHeight = e.screenHeight
        const capsule = wx.getMenuButtonBoundingClientRect()
        if (capsule) {
          this.globalData.Custom = capsule
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 44
        }
        this.globalData.tabbarHeight = e.screenHeight - e.statusBarHeight - this.globalData.CustomBar - e.windowHeight
      }
    })
  },
  initEnv() {
    const envVersion = __wxConfig.envVersion
    const env = envVersion === 'develop' ? 'turntable-dev' : 'turntable-prod'
    wx.cloud.init({
      env,
      traceUser: true
    })
    this.globalData.env = env
  },
  async login() {
    const model = new Model()
    const {data: info} = await model.getUserInfo()
    if (info.length === 0) {
      await model.register()
    }
  },
  setAd() {
    try {
      wx.setStorageSync('hasGetAd', false)
    } catch (e) {
      console.log( e)
    }
  },
  onLaunch() {
    this.initEnv()
    this.initUiGlobal()
    this.login()
    this.setAd()
  },
  globalData: {
    StatusBar: null,
    Custom: null,
    CustomBar: null,
    screenHeight: null,
    env: '',
    decide: null,
    rotateStart: false
  }
})
