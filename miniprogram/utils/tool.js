const OPENID = 'uid'

export default {
  get app() {
    return getApp()
  },
  get openid() {
    return wx.getStorageSync(OPENID)
  },

  tip(msg, duration = 2000) {
    return new Promise(resolve =>
      wx.showToast({
        title: msg,
        icon: 'none',
        duration,
        complete() {
          setTimeout(() => {
            resolve()
          }, duration)
        }
      })
    )
  },

  // 保留两位小数点
  saveTwoNum(num) {
    return Math.floor(num * 100)/100
  },

  callCloud(options) {
    return wx.cloud.callFunction(options).then(res => {
      return res
    }).catch(e => {
      console.log(e)
      throw e
    })
  }
}
