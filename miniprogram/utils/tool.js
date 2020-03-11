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

  loading(title = '数据拉取中...', mask = true) {
    return new Promise(resolve => { wx.showLoading({title, mask, complete: resolve}) })
  },

  hideLoading() { wx.hideLoading() },

  // 保留两位小数点
  saveTwoNum(num) {
    return Math.floor(num * 100)/100
  },

  callCloud(options, showLoading = true) {
    showLoading && wx.showLoading({title: '获取数据中', mask: true})
    return wx.cloud.callFunction(options).then(res => {
      showLoading && wx.hideLoading()
      return res
    }).catch(e => {
      console.log(e)
      showLoading && wx.hideLoading()
      throw e
    })
  }
}
