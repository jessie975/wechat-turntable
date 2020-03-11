/* eslint-disable no-undef */
import $ from './utils/tool'
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
          this.globalData.CustomBar = e.statusBarHeight + 50
        }
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
    $.loading()
    const model = new Model()
    const {data: info} = await model.getUserInfo()
    if (info.length === 0) {
      await model.register()
    }
    $.hideLoading()
  },
  onLaunch() {
    this.initEnv()
    this.initUiGlobal()
    this.login()
  },
  globalData: {
    StatusBar: null,
    Custom: null,
    CustomBar: null,
    screenHeight: null,
    env: '',
    decide: null
  }
})
