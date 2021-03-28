/* eslint-disable no-undef */
import Model from '../../model/model'
import $ from '../../utils/tool'
import {destroyVideoAd, initVideoAd, onShowVideoAd} from '../../utils/ad'

const colorful = ['#5B8FF9', '#6DC8EC', '#E8684A', '#F6BD16', '#5D7092', '#5AD8A6','#9270CA', '#FEB7D5', '#C8DAFC', '#F6BD16', '#5D7092', '#5AD8A6']

const app = getApp()
const model = new Model()

Page({
  data: {
    title: '',
    options: [], // 扇区
    cheatOptions: [],
    music: true,
    vibrate: true,
    showSetting: false,
    showCheat: false,
    result: null,
    checkIndex: -1,
    cancelCheat: false,
    setInterId: '',
    _id: null,
    updateResult: false,
    showTurntable: false,
    showLoading: true,
    isShare: false,
    videoAd: null,
    giveCheckIndex: -1,
    hasGetAd: false
  },

  showSetting() {
    this.setData({
      showSetting: !this.data.showSetting
    })
  },

  showCheat() {
    const {options, cheatOptions, checkIndex} = this.data
    if (cheatOptions.length === 0) {
      options.forEach(item => {
        cheatOptions.push(item.text)
      })
    } else {
      if (checkIndex !== -1) {
        cheatOptions[options.length] = '取消作弊模式'
      }
    }
    
    if (!app.globalData.rotateStart) {
      this.setData({
        showCheat: true,
        showTurntable: false,
        cheatOptions
      })
    } else {
      $.tip('当前还有决定未结束，请稍后~')
    }
  },

  chooseCheat(e) {
    const {options, cheatOptions} = this.data
    const index = e.target.dataset.index
    if (cheatOptions.length > options.length) {
      if (index === cheatOptions.length - 1) {
        this.setData({cancelCheat: true})
      }
    }
    this.setData({
      checkIndex: index,
      giveCheckIndex: index
    })
  },

  giveReward() {
    this.setData({
      showCheat: false,
      checkIndex: this.data.giveCheckIndex
    })
    setTimeout(() => {
      this.setData({showTurntable: true})
    }, 100)

    if (!this.data.hasGetAd) {
      wx.showToast({
        title: '作弊模式激活成功 ~',
        icon: 'none'
      })
    }
    // 设置已经看过广告
    try {
      wx.setStorageSync('hasGetAd', true)
      this.setData({
        hasGetAd: true
      })
    } catch (e) {
      console.log( e)
    }
  },

  cheatSubmit() {
    if (this.data.cancelCheat) {
      this.setData({
        checkIndex: -1,
        showCheat: false
      })
      setTimeout(() => {
        this.setData({showTurntable: true})
      }, 100)
    } else if (this.data.hasGetAd) {
      this.giveReward()
    } else {
      this.onShowVideoAd()
    }
  },

  hiddenCheat() {
    this.setData({
      showCheat: false
    })
    setTimeout(() => {
      this.setData({showTurntable: true})
    }, 100)
  },

  changeSetting(e) {
    const {music, vibrate} = this.data
    const type = e.currentTarget.dataset.type
    const value = type === 'music' ? music : vibrate
    this.setData({
      [type]: !value
    })
    wx.setStorageSync(type, !value)
  },

  rotateStart(e) {
    app.globalData.rotateStart = e.detail
    this.setData({
      showSetting: false,
      updateResult: false
    })
  },

  getResult(e) {
    // 将记录存入数据库
    const {title, options, _id, checkIndex, isShare} = this.data
    const history = {
      _id,
      title,
      result: options[e.detail].text,
      date: '',
      isCheat: checkIndex !== -1,
      checkIndex: e.detail
    }
    if (!isShare) {
      model.updateTimes(_id)
      model.addHistory(history)
    }
    app.globalData.rotateStart = false
    this.setData({
      result: e.detail,
      updateResult: true
    })
    const currentPage = getCurrentPages()[0].route
    if (currentPage === 'pages/home/home') {
      const who = isShare ? 'Ta' : '你'
      const msg = `${who}选中了${this.data.options[e.detail].text}`
      this.setData({isShare: false})
      $.tip(msg)
    }
  },

  dealData(options) {
    options.forEach((item, index) => {
      item.color = colorful[index]
    })
    return options
  },

  rander() {
    this.setData({
      showTurntable: true,
      showLoading: false
    })
  },

  async getDataFormUserDb() {
    const {result} = await model.getUserDecide()
    let options = []
    let title = ''
    let _id = ''
    if (result.length !== 0) {
      options = result[0].options
      title = result[0].title
      _id = result[0]._id
    } else {
      const {list} = await model.getHotDecides()
      options = list[0].options
      title = list[0].title
      _id = list[0]._id
    }
    this.setData({
      options: await this.dealData(options),
      title,
      _id
    })
    this.rander()
  },

  async getDecide() {
    const decide = app.globalData.decide
    if (decide) {
      const options = this.dealData(decide.options)
      this.setData({
        title: decide.title,
        options,
        _id: decide._id
      })
      this.rander()
    } else {
      this.getDataFormUserDb()
    }
  },

  async fromShare(option) {
    const {data} = await model.toHomeFromShare(option.id)
    const {options, title, _id} = data[0]
    this.setData({
      _id,
      title,
      options: this.dealData(options),
      checkIndex: option.checkIndex - 0,
      isShare: true
    })
    this.rander()
    setTimeout(() => {
      this.selectComponent('#myPizza').rotateAuto()
      this.setData({checkIndex: -1}) // 从分享页进入默认转动一次后修改选中为默认
    }, 400)
  },

  getSettingFormStorage() {
    try {
      const MusicValue = wx.getStorageSync('music')
      const vibrateValue = wx.getStorageSync('vibrate')
      this.setData({
        music: MusicValue,
        vibrate: vibrateValue
      })
    } catch (e) {
      this.setData({
        music: true,
        vibrate: true
      })
    }
  },

  onShowVideoAd() {
    onShowVideoAd.call(this)
  },

  onLoad(options) {
    this.getSettingFormStorage()
    if (Object.keys(options).length !== 0) {
    // 从分享入口进首页
      this.fromShare(options)
      this.setData({
        result: options.checkIndex
      })
    } else {
      // 先从全局变量里取，如果没有则从用户最近创建的决定里面取，如果还是没有就给默认的
      this.getDecide()
    }

    // 是否已经看过广告
    const that = this
    wx.getStorage({
      key: 'hasGetAd',
      success (res) {
        that.setData({
          hasGetAd: res.data
        })
      }
    })
  },

  onUnload() {
    destroyVideoAd.call(this)
  },

  onReady() {
    initVideoAd.call(this, 'home', this.giveReward.bind(this))
  },

  onShareAppMessage: function () {

  }
})