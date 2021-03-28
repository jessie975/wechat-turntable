const defaultId = 'adunit-10169da7766e56c0'

const adUnitIds = {
  home: 'adunit-10169da7766e56c0'
}

export function destroyVideoAd() {
  // 开发者工具中，页面销毁，调用下面代码会报错，真机好像没报错，先不销毁了。
  // if (__wxConfig.platform === 'devtools') { return }
  // try {
  //   if (this.videoAd && !this.videoAd._destroyed) {
  //     this.videoAd.destroy()
  //   }
  // } catch (error) {
  //   console.log(error)
  // }
}

export function onShowVideoAd() {
  this.videoAd.show().catch(() => {
    this.videoAd.load()
      .then(() => this.videoAd.show())
      .catch(err => {
        console.log(err)
        wx.showToast({
          title: '视频加载失败, 请重试 ~',
          icon: 'none'
        })
      })
  })
}

export function initVideoAd(page, giveReward) {
  let adUnitId = defaultId
  if (adUnitIds[page]) {
    adUnitId = adUnitIds[page]
  }
  const that = this
  this.videoAd = wx.createRewardedVideoAd({adUnitId})
  this.videoAd.onLoad(() => { console.log('加载激励视频广告') })
  this.videoAd.onError(err => {
    console.log(err)
    that.setData({videoAdState: false})
  })
  this.videoAd.onClose(res => {
    const {isEnded} = res
    if (isEnded) {
      typeof giveReward === 'function' && giveReward()
    } else {
      wx.showToast({
        title: '提前关闭了视频，不满足条件哦~',
        icon: 'none',
        duration: 2000
      })
    }
  })
}
