/* eslint-disable no-undef */
import Model from '../../model/model'
import $ from '../../utils/tool'

const colorful = ['#5B8FF9', '#6DC8EC', '#E8684A', '#F6BD16', '#5D7092', '#5AD8A6','#9270CA', '#FEB7D5', '#C8DAFC', '#F6BD16', '#5D7092', '#5AD8A6']
const defalutTitle = '上帝掷骰子'
const defalutSector = [
  {order: 1, color: '#83d0ef', text: '1'},
  {order: 1, color: '#73a0fa', text: '2'},
  {order: 1, color: '#73deb3', text: '3'},
  {order: 1, color: '#7585a2', text: '4'},
  {order: 1, color: '#f7c739', text: '5'},
  {order: 1, color: '#eb7e65', text: '6'}
]

const app = getApp()
const model = new Model()

Page({
  data: {
    title: '',
    options: [], // 扇区
    music: true,
    vibrate: true,
    showSetting: false,
    showCheat: false,
    result: null,
    checkIndex: -1,
    setInterId: '',
    _id: null,
    hasChoose: false,
    updateResult: false
  },

  showSetting() {
    this.setData({
      showSetting: !this.data.showSetting
    })
  },

  showCheat() {
    this.setData({
      showCheat: true
    })
    wx.hideTabBar()
  },

  chooseCheat(e) {
    const index = e.target.dataset.index
    this.setData({
      checkIndex: index,
      hasChoose: true
    })
  },

  hiddenCheat() {
    this.setData({
      showCheat: false,
      hasChoose: false,
    })
    wx.showTabBar()
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

  getResult(e) {
    // 将记录存入数据库
    const {title, options, _id, checkIndex} = this.data
    const history = {
      _id,
      title,
      result: options[e.detail].text,
      date: '',
      isCheat: checkIndex !== -1,
      checkIndex: e.detail
    }
    model.updateTimes(_id)
    model.addHistory(history)

    this.setData({
      result: e.detail,
      updateResult: true
    })
    const currentPage = getCurrentPages()[0].route
    if (currentPage === 'pages/home/home') {
      const msg = `你选中了${this.data.options[e.detail].text}`
      $.tip(msg)
    }
  },

  dealData(options) {
    options.forEach((item, index) => {
      item.color = colorful[index]
    })
    return options
  },

  async getDataFormUserDb() {
    const {result} = await model.getUserDecide()
    if (result.length !== 0) {
      const {options, title, _id} = result[0]
      this.setData({
        options: await this.dealData(options),
        title,
        _id
      })
    } else {
      this.setData({
        options: defalutSector,
        title: defalutTitle
      })
    }
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
    } else {
      this.getDataFormUserDb()
    }
  },

  async fromShare(option) {
    const {data} = await model.toHomeFromShare(option.id)
    const {options, title} = data[0]
    this.setData({
      title,
      options: this.dealData(options),
      checkIndex: option.checkIndex - 0
    })
    this.selectComponent('#myPizza').rotateAuto()
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

  onLoad(options) {
    $.loading()
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
    $.hideLoading()
  },

  onReady: function () {

  },

  onShareAppMessage: function () {

  }
})