const pages = {
  home: '/pages/home/home',
  manage: '/pages/manage/manage',
  add: "/pages/manage/add/add",
  addUpdate: "/pages/manage/add/add?update=true",
  hot: '/pages/hot/hot'
}

export default {
  push(url, events = {}, callback = () => {}) {
    wx.navigateTo({
      url: pages[url],
      events,
      success: callback
    })
  },

  pop(delta) {
    wx.navigateBack({delta})
  },

  redirectTo(url) {
    wx.redirectTo({url: pages[url]})
  },

  reLaunch(url) {
    wx.reLaunch({url: pages[url]})
  }
}
