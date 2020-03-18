import Model from '../../model/model'
import router from '../../utils/router'
import $ from '../../utils/tool'

const app =  getApp()
const model = new Model()

Page({

  data: {
    list: [],
    noMore: false,
    pageSum: -1,
    showLoading: true
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
    if (!app.globalData.rotateStart) {
      app.globalData.decide = {
        title,
        options,
        _id
      }
      router.reLaunch('home')
    } else {
      $.tip('还有决定未结束，请稍后再切换哦~')
    }
    
  },

  async getList() {
    const {list, pageSum} = await model.getHotDecides()
    this.setData({
      list,
      pageSum
    })
    this.setData({showLoading: false})
  },

  onLoad() {
    this.getList()
  },

  async onPullDownRefresh() {
    const {pageSum, list} = this.data
    wx.showNavigationBarLoading()
    if (pageSum > 1) {
      this.setData({showLoading: true})
      const {list: newList} = await model.getHotDecides(pageSum)
      this.setData({
        list: [...list, ...newList],
        pageSum: pageSum - 1
      })
    } else {
      $.tip('没有更多数据了')
      this.setData({
        noMore: true
      })
    } 
    this.setData({showLoading: false})
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  onShareAppMessage: function () {

  }
})