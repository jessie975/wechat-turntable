import Model from '../../model/model'
import router from '../../utils/router'

const app =  getApp()
const model = new Model()

Page({

  data: {
    list: [],
    showFoot: false
  },

  toAdd() {
    router.push('add')
  },
  toEdit(e) {
    const {list} = this.data
    router.push('addUpdate', {}, res => {
      res.eventChannel.emit('updateDecide', {
        data: list[e.detail],
        isHot: true
      })
    })
  },
  toHome(e) {
    const {list} = this.data
    const {title, options, _id} = list[e.target.dataset.index]
    app.globalData.decide = {
      title,
      options,
      _id
    }
    router.reLaunch('home')
  },

  async getList() {
    const {data: list} = await model.getHotDecides()
    this.setData({
      list,
      showFoot: true
    })
  },

  onLoad() {
    this.getList()
  },

  onReady() {
  },

  onShow: function () {

  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})